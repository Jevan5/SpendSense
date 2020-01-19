import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';

import { ModelService } from 'src/app/services/model/model.service';
import { Receipt } from 'src/app/models/receipt/receipt';
import { ReceiptItem } from 'src/app/models/receiptItem/receiptItem';
import { SystemItem } from 'src/app/models/systemItem/systemItem';
import { Location } from 'src/app/models/location/location';
import { Franchise } from 'src/app/models/franchise/franchise';
import { LoadableComponent } from 'src/app/components/loadable/loadable.component';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-manual-entry',
  templateUrl: './manual-entry.component.html',
  styleUrls: ['./manual-entry.component.scss'],
})
export class ManualEntryComponent extends LoadableComponent implements OnInit {
  items: Array<{
    name: string,
    price: string,
    hasAmount: boolean,
    amount: number,
    unit: string,
    tag: string
  }>;
  franchises: Array<Franchise>;
  selectedFranchise: Franchise;
  locations: Array<Location>;
  selectedLocation: Location;
  date: Date;

  constructor(public modelService: ModelService, public loadingController: LoadingController, public toastController: ToastController, public authenticationService: AuthenticationService) {
    super(loadingController, toastController);
    this.items = [];
    this.selectedFranchise = null;
    this.selectedLocation = null;
    this.date;

    this.setLoadingMessage('Loading franchises').then(() => {
      return this.modelService.getAll(Franchise, new Map<string, string>());
    }).then((f) => {
      this.franchises = f;

      return this.setLoadingMessage('Loading locations');
    }).then(() => {
      return this.modelService.getAll(Location, new Map<string, string>());
    }).then((l) => {
      this.locations = l;

      return this.clearMessage();
    }).catch((err) => {
      this.setErrorMessage('first error');
    });
  }

  // getfranchises(event){
  //   for(var i = 0; i > this.franchises.length(), i++){

  //   }
  // }

  ngOnInit() {}

  private newItem(): void{
    this.items.push({
      name: '',
      price: '',
      hasAmount: false,
      amount: null,
      unit: null,
      tag: ''
    });
  }

  private toggleHasAmount(entry) {
    entry.hasAmount = !entry.hasAmount;
  }

  private searchLocation(name: string): void {

  }

  private submit(): void{
    var receipt = new Receipt();
    receipt.setValue('date', this.date);
    receipt.setValue('_locationId', this.selectedLocation); 
    receipt.setValue('_userId', this.authenticationService.getUser().getValue('_id'));

    this.modelService.save(receipt).then((r) => {
      receipt = r;

      var receiptItem = new ReceiptItem();

      receiptItem.setValue('name', this.items[0].name);
      receiptItem.setValue('price', this.items[0].price);
      receiptItem.setValue('amount', 1);
      receiptItem.setValue('_receiptId', receipt.getValue('_id'));
      receiptItem.setValue('_systemItemId', null);  

      return this.modelService.save(receiptItem);
    }).then((receiptItem) => {
      return this.setSuccessMessage('Receipt item added!');
    }).catch((err) => {
      this.setErrorMessage('second error');
    });
  }

  private delete(item): void{
    var i;
    for (i=0; i < this.items.length; i++)
    {
      if(this.items[i] == item){
        this.items.splice(i,1);
      }
    }
  }

  private readyForSubmit(): boolean {
    if (this.selectedLocation == null) {
      return false;
    }

    let ready = true;
    this.items.forEach((item) => {
      if (item.name == null || item.name == '') {
        ready = false;
      }
    });
    return ready;
  }


}
