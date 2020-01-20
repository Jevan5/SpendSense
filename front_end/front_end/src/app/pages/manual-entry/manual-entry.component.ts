import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { LoadableComponent } from 'src/app/components/loadable/loadable.component';
import { ModelService } from 'src/app/services/model/model.service';
import { User } from 'src/app/models/user/user';
import { Franchise } from 'src/app/models/franchise/franchise';
import { Location } from 'src/app/models/location/location';
import { Receipt } from 'src/app/models/receipt/receipt';
import { ReceiptItem } from 'src/app/models/receiptItem/receiptItem';
import { SystemItem } from 'src/app/models/systemItem/systemItem';
import { Router } from '@angular/router';
import { CommonTag } from 'src/app/models/commonTag/commonTag';
import { findBestMatch } from 'string-similarity';

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

  public franchises: Array<Franchise>;
  public locations: Array<Location>;
  public locationsOfFranchise: Array<Location>;
  public systemItems: Array<SystemItem>;
  public systemItemNames: Array<string>;
  public systemItemNameMapping: Map<string, Set<SystemItem>>;
  public tags: Array<string>;
  public commonTags: Map<string, string>;

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
    }>
  };

  constructor(public authenticationService: AuthenticationService,
    public modelService: ModelService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public router: Router) {

    super(loadingController, toastController);

    this.model = {
      franchise: null,
      location: null,
      receiptItems: []
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

      return this.setLoadingMessage('Loading system items...');
    }).then(() => {
      return this.modelService.getAll(SystemItem);
    }).then((systemItems) => {
      this.systemItems = systemItems;

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
      this.commonTags = new Map<string, string>();

      commonTags.forEach((commonTag) => {
        this.commonTags.set(commonTag.getValue('name'), commonTag.getValue('tag'));
      });

      return this.clearMessage();
    }).catch((err) => {
      this.setErrorMessage(err);
    });
  }

  public franchiseDisplayFunction(franchise: Franchise): string {
    return franchise.getValue('name');
  }

  public locationDisplayFunction(location: Location): string {
    return location.getValue('address') + ', ' + location.getValue('city') + ', ' + location.getValue('country');
  }

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

  public submit() {
    console.log(this.model);
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

    let missingSystemItemsPromise: Promise<void>;

    if (missingSystemItems.length > 0) {
      missingSystemItemsPromise = new Promise<void>((resolve, reject) => {
        this.setLoadingMessage('Creating missing system items...').then(() => {
          return this.modelService.saveMany(missingSystemItems);
        }).then((savedSystemItems) => {
          savedSystemItems.forEach((systemItem) => {
            if (!this.systemItemNameMapping.has(systemItem.getValue('name'))) {
              this.systemItemNameMapping.set(systemItem.getValue('name'), new Set<SystemItem>());
            }
    
            this.systemItemNameMapping.get(systemItem.getValue('name')).add(systemItem);
          });

          resolve();
        });
      });
    } else {
      missingSystemItemsPromise = new Promise<void>((resolve, reject) => {
        resolve();
      });
    }

    let receipt = new Receipt();
    receipt.setValue('_locationId', this.model.location.getValue('_id'));
    receipt.setValue('date', new Date());

    missingSystemItemsPromise.then(() => {
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
      this.setSuccessMessage('Successfully posted your receipt information.');
    }).catch((err) => {
      this.setErrorMessage(err.toString());
    });
  }

  public readyToSubmit(): boolean {
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

    let result = findBestMatch(receiptItem.nameOnReceipt, this.systemItemNames);

    receiptItem.commonName = result.bestMatch.target;

    if (this.commonTags.has(receiptItem.commonName)) {
      receiptItem.tag = this.commonTags.get(receiptItem.commonName);
    }

    // Resetting the dropdown search by ensuring its cleared before re-displaying it
    setTimeout(() => {
      receiptItem.nameOnReceiptEntered = true;
    }, 0);
  }
}
