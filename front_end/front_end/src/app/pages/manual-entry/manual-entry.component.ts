import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { LoadableComponent } from 'src/app/components/loadable/loadable.component';
import { ModelService } from 'src/app/services/model/model.service';
import { Franchise } from 'src/app/models/franchise/franchise';
import { Location } from 'src/app/models/location/location';
import { Receipt } from 'src/app/models/receipt/receipt';
import { ReceiptItem } from 'src/app/models/receiptItem/receiptItem';
import { SystemItem } from 'src/app/models/systemItem/systemItem';
import { Router } from '@angular/router';
import { CommonTag } from 'src/app/models/commonTag/commonTag';
import { findBestMatch } from 'string-similarity';
import { ScanReceiptService } from '../../services/scan-receipt/scan-receipt.service';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-manual-entry',
  templateUrl: './manual-entry.component.html',
  styleUrls: ['./manual-entry.component.scss'],
})
export class ManualEntryComponent extends LoadableComponent {
  public amountUnits = {
    MG: 'mg',
    G: 'g',
    KG: 'kg'
  };

  /**
   * Array of all franchises.
   */
  public franchises: Array<Franchise>;
  /**
   * Array of all locations.
   */
  public locations: Array<Location>;
  /**
   * Mapping from location _ids to their associated locations.
   */
  public locationMapping: Map<string, Location>;
  /**
   * Array of locations which belong to the currently selected franchise.
   */
  public locationsOfFranchise: Array<Location>;
  /**
   * Array of all system items.
   */
  public systemItems: Array<SystemItem>;
  /**
   * Array of all system item names.
   */
  public systemItemNames: Array<string>;
  /**
   * Mapping from system item name to a set of system items with the same name.
   */
  public systemItemNameMapping: Map<string, Set<SystemItem>>;
  /**
   * Mapping from system item _id to the corresponding system item.
   */
  public systemItemMapping: Map<string, SystemItem>;
  /**
   * Array of all tags.
   */
  public tags: Array<string>;
  /**
   * Mapping from system item name to its most common tag.
   */
  public nameToTag: Map<string, string>;
  /**
   * If editing, this is the original receipt.
   */
  public originalReceipt: Receipt;

  public model: {
    franchise: Franchise,
    location: Location,
    receiptItems: Array<{
      nameOnReceipt: string,
      nameOnReceiptEntered: boolean,
      price: number,
      hasAmount: boolean,
      amount: number,
      amountUnit: string,
      commonName: string,
      tag: string
    }>,
    date: string
  };

  constructor(public authenticationService: AuthenticationService,
    public modelService: ModelService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public router: Router,
    public scanReceiptService: ScanReceiptService,
    public route: ActivatedRoute) {

    super(loadingController, toastController);

    const now = new Date();

    this.model = {
      franchise: null,
      location: null,
      receiptItems: [],
      date: ManualEntryComponent.getDateString(now)
    };

    this.setLoadingMessage('Loading franchises...').then(() => {
      return this.modelService.getAll(Franchise);
    }).then((franchises) => {
      this.franchises = franchises;

      return this.setLoadingMessage('Loading locations...');
    }).then(() => {
      return this.modelService.getAll(Location);
    }).then((locations) => {
      this.locations = locations;
      this.locationMapping = Location.getMapping(locations);

      return this.setLoadingMessage('Loading system items...');
    }).then(() => {
      return this.modelService.getAll(SystemItem);
    }).then((systemItems) => {
      this.systemItems = systemItems;

      this.systemItemMapping = SystemItem.getMapping(systemItems);

      this.systemItemNames = [];
      this.systemItemNameMapping = new Map<string, Set<SystemItem>>();

      let uniqueTags = new Set<string>();

      this.systemItems.forEach((systemItem) => {
        if (!this.systemItemNameMapping.has(systemItem.getValue('name'))) {
          this.systemItemNameMapping.set(systemItem.getValue('name'), new Set<SystemItem>());
          
          this.systemItemNames.push(systemItem.getValue('name'));
        }

        this.systemItemNameMapping.get(systemItem.getValue('name')).add(systemItem);

        uniqueTags.add(systemItem.getValue('tag'));
      });

      this.tags = Array.from(uniqueTags);

      return this.setLoadingMessage('Loading common tags...');
    }).then(() => {
      return this.modelService.getAll(CommonTag);
    }).then((commonTags) => {
      this.nameToTag = new Map<string, string>();

      commonTags.forEach((commonTag) => {
        this.nameToTag.set(commonTag.getValue('name'), commonTag.getValue('tag'));
      });

      return this.setLoadingMessage('Loading receipt information...');
    }).then(() => {
      return new Promise((resolve, reject) => {
        this.route.queryParamMap.subscribe((params) => {
          if (params.has('_id')) {  // Editing an existing receipt
            resolve(params.get('_id'));
          } else {  // Entering a new receipt
            resolve(null);
          }
        }, (err) => {
          reject(err);
        });
      });
    }).then((id: string) => {
      if (id == null) {
        return null;
      } else {
        return this.modelService.getOne(id, Receipt);
      }
    }).then((receipt) => {
      if (receipt == null) {
        this.originalReceipt = null;

        const scannedReceipt = this.scanReceiptService.getLastReceipt();

        if (scannedReceipt == null) {
          return;
        }

        this.scanReceiptService.clearLastReceipt();

        if (scannedReceipt.franchiseName != null) {
          const franchiseNames = this.franchises.map(franchise => franchise.getValue('name'));

          const closestFranchiseName = findBestMatch(scannedReceipt.franchiseName.toLowerCase(), franchiseNames).bestMatch.target;

          this.franchises.forEach((franchise) => {
            if (franchise.getValue('name') === closestFranchiseName) {
              this.selectsFranchise(franchise);
            }
          });
        }

        scannedReceipt.items.forEach((item) => {
          this.addReceiptItem();
          const receiptItem = this.model.receiptItems[this.model.receiptItems.length - 1];
          receiptItem.nameOnReceipt = item.description;
          receiptItem.nameOnReceiptEntered = true;
          receiptItem.price = item.price;
          receiptItem.commonName = findBestMatch(receiptItem.nameOnReceipt.toLowerCase(), this.systemItemNames).bestMatch.target;

          if (this.nameToTag.has(receiptItem.commonName)) {
            receiptItem.tag = this.nameToTag.get(receiptItem.commonName);
          }
        });
      } else {
        this.originalReceipt = receipt;
        this.model.date = ManualEntryComponent.getDateString(this.originalReceipt.getValue('date'));
        this.model.location = this.locationMapping.get(this.originalReceipt.getValue('_locationId'));
        this.model.franchise = Franchise.getMapping(this.franchises).get(this.model.location.getValue('_franchiseId'));

        return this.modelService.getAll(ReceiptItem).then((ris) => {
          ris.forEach((ri) => {
            if (ri.getValue('_receiptId') !== this.originalReceipt.getValue('_id')) {
              return;
            }

            this.addReceiptItem();
            const receiptItem = this.model.receiptItems[this.model.receiptItems.length - 1];
            receiptItem.nameOnReceipt = ri.getValue('name');
            receiptItem.commonName = this.systemItemMapping.get(ri.getValue('_systemItemId')).getValue('name');
            receiptItem.nameOnReceiptEntered = true;
            receiptItem.price = ri.getValue('price');
            receiptItem.tag = this.systemItemMapping.get(ri.getValue('_systemItemId')).getValue('tag');
          });
        }).catch((err) => {
          throw err;
        });
      }
    }).then(() => {
      return this.clearMessage();
    }).catch((err) => {
      this.setErrorMessage(err.toString());
    });
  }

  /**
   * Used to display the franchises in the dropdown search.
   * @param franchise Franchise to display.
   * @returns {string} String representation of the Franchise, which gets its name.
   */
  public franchiseDisplayFunction(franchise: Franchise): string {
    return franchise.getValue('name');
  }

  /**
   * Used to display the location in the dropdown search.
   * @param location Location to display.
   * @returns {string} String representation of the Location, which gets its address,
   * city, and country.
   */
  public locationDisplayFunction(location: Location): string {
    return location.getValue('address') + ', ' + location.getValue('city') + ', ' + location.getValue('country');
  }

  /**
   * Called when a franchise is selected from the dropdown search. This will
   * display the appropriate locations in the following dropdown search.
   * @param franchise Franchise selected.
   */
  public selectsFranchise(franchise: Franchise): void {
    this.model.franchise = franchise;

    this.locationsOfFranchise = [];

    this.locations.forEach((loc) => {
      if (loc.getValue('_franchiseId') === this.model.franchise.getValue('_id')) {
        this.locationsOfFranchise.push(loc);
      }
    });
  }

  public unselectsFranchise(): void {
    this.model.franchise = null;
    this.model.location = null;
  }

  public selectsLocation(location: Location): void {
    this.model.location = location;
  }

  public unselectsLocation(): void {
    this.model.location = null;
  }

  public addReceiptItem(): void {
    this.model.receiptItems.push({
      nameOnReceipt: '',
      nameOnReceiptEntered: false,
      price: 0,
      hasAmount: false,
      amountUnit: this.amountUnits.G,
      amount: 0,
      commonName: null,
      tag: null
    });
  }

  public removeReceiptItem(index: number): void {
    let front = this.model.receiptItems.slice(0, index);
    let back = this.model.receiptItems.slice(index + 1, this.model.receiptItems.length);

    this.model.receiptItems = front.concat(back);
  }

  public save(): void {
    let missingSystemItems: Array<SystemItem> = [];

    this.model.receiptItems.forEach((receiptItem) => {
      let systemItemExists = false;

      if (this.systemItemNameMapping.has(receiptItem.commonName.toLowerCase())) {
        let systemItemsSharingName = this.systemItemNameMapping.get(receiptItem.commonName.toLowerCase());

        systemItemsSharingName.forEach((systemItem) => {
          if (systemItem.getValue('tag') === receiptItem.tag.toLowerCase()) {
            systemItemExists = true;
          }
        });
      }

      if (!systemItemExists) {
        let missingSystemItem = new SystemItem();
        missingSystemItem.setValue('name', receiptItem.commonName.toLowerCase());
        missingSystemItem.setValue('tag', receiptItem.tag.toLowerCase());

        missingSystemItems.push(missingSystemItem);
      }
    });

    let receipt = new Receipt();

    new Promise((resolve, reject) => {
      if (this.originalReceipt == null) {
        resolve();
      } else {
        this.setLoadingMessage('Deleting old receipt...').then(() => {
          resolve();
        }).catch((err) => {
          reject(err);
        });
      }
    }).then(() => {
      if (this.originalReceipt != null) {
        return this.modelService.deleteOne(this.originalReceipt.getValue('_id'), Receipt);
      }
    }).then(() => {
      receipt.setValue('_locationId', this.model.location.getValue('_id'));
      receipt.setValue('date', new Date(this.model.date));
      
      if (missingSystemItems.length <= 0) {
        return;
      }

      return this.setLoadingMessage('Creating missing system items...').then(() => {
        return this.modelService.saveMany(missingSystemItems);
      }).then((savedSystemItems) => {
        savedSystemItems.forEach((systemItem) => {
          if (!this.systemItemNameMapping.has(systemItem.getValue('name'))) {
            this.systemItemNameMapping.set(systemItem.getValue('name'), new Set<SystemItem>());
          }

          this.systemItemNameMapping.get(systemItem.getValue('name')).add(systemItem);
        });
      }).catch((err) => {
        throw err;
      });
    }).then(() => {
      return this.setLoadingMessage('Creating receipt...');
    }).then(() => {
      return this.modelService.save(receipt);
    }).then((r) => {
      receipt = r;

      return this.setLoadingMessage('Creating receipt items...');
    }).then(() => {
      let receiptItems = [];

      this.model.receiptItems.forEach((ri) => {
        let receiptItem = new ReceiptItem();
        receiptItem.setValue('name', ri.nameOnReceipt);
        receiptItem.setValue('price', ri.price);
        receiptItem.setValue('_receiptId', receipt.getValue('_id'));

        if (ri.hasAmount) {
          if (ri.amountUnit === this.amountUnits.MG) {
            receiptItem.setValue('amount', ri.amount / 1000000);
          } else if (ri.amountUnit === this.amountUnits.G) {
            receiptItem.setValue('amount', ri.amount / 1000);
          } else {
            receiptItem.setValue('amount', ri.amount);
          }
        } else {
          receiptItem.setValue('amount', null);
        }

        this.systemItemNameMapping.get(ri.commonName.toLowerCase()).forEach((systemItem) => {
          if (systemItem.getValue('tag') === ri.tag.toLowerCase()) {
            receiptItem.setValue('_systemItemId', systemItem.getValue('_id'));
          }
        });

        receiptItems.push(receiptItem);
      });

      return this.modelService.saveMany(receiptItems);
    }).then(() => {
      return this.setSuccessMessage('Successfully posted your receipt information.');
    }).then(() => {
      this.router.navigate(['/home']);
    }).catch((err) => {
      this.setErrorMessage(err.toString());
    });
  }

  public readyToSave(): boolean {
    if (this.model.franchise == null) {
      return false;
    }

    if (this.model.location == null) {
      return false;
    }

    let issue = false;

    this.model.receiptItems.forEach((receiptItem) => {
      if (issue) {
        return;
      }

      if (receiptItem.nameOnReceipt == '') {
        issue = true;
        return;
      }

      if (receiptItem.commonName == null || receiptItem.commonName == '') {
        issue = true;
        return;
      }

      if (receiptItem.tag == null || receiptItem.tag == '') {
        issue = true;
        return;
      }

      if (receiptItem.price == null) {
        issue = true;
        return;
      }

      if (receiptItem.hasAmount && receiptItem.amount == null) {
        issue = true;
        return;
      }
    });

    return !issue;
  }

  public systemItemNameDisplayFunction(name: string): string {
    return name;
  }

  public tagDisplayFunction(tag: string): string {
    return tag;
  }

  public nameOnReceiptLeft(ev: any, index: number): void {
    let receiptItem = this.model.receiptItems[index];

    receiptItem.nameOnReceiptEntered = false;

    if (receiptItem.nameOnReceipt.trim() == '') {
      // Name on receipt was not filled out
      return;
    }

    if (this.systemItemNames.length > 0) {
      let result = findBestMatch(receiptItem.nameOnReceipt, this.systemItemNames);

      if (result.ratings[result.bestMatchIndex].rating > 0.1) {
        // Only decently accurate ratings accepted
        receiptItem.commonName = result.bestMatch.target;

        if (this.nameToTag.has(receiptItem.commonName)) {
          receiptItem.tag = this.nameToTag.get(receiptItem.commonName);
        }
      }
    }

    // Resetting the dropdown search by ensuring its cleared before re-displaying it
    setTimeout(() => {
      receiptItem.nameOnReceiptEntered = true;
    }, 0);
  }

  public selectsCommonName(name: string, index: number): void {
    if (this.nameToTag.has(name)) {
      this.model.receiptItems[index].tag = this.nameToTag.get(name);
    } else {
      this.model.receiptItems[index].tag = null;
    }
  }

  public static getDateString(date: Date): string {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
  }
}
