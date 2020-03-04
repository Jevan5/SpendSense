import { Component, OnInit } from '@angular/core';
import { ModelService } from 'src/app/services/model/model.service';
import { LoadableComponent } from 'src/app/components/loadable/loadable.component';
import { ToastController, LoadingController } from '@ionic/angular';
import { Receipt } from 'src/app/models/receipt/receipt';
import { Location } from 'src/app/models/location/location';
import { Franchise } from 'src/app/models/franchise/franchise';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-receipts',
  templateUrl: './view-receipts.component.html',
  styleUrls: ['./view-receipts.component.scss'],
})
export class ViewReceiptsComponent extends LoadableComponent implements OnInit {
  private receipts: Array<{
    receipt: Receipt,
    franchise: string
  }>;

  constructor(public modelService: ModelService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    public router: Router) {

    super(loadingController, toastController);

    this.setLoadingMessage('Loading receipts...').then(() => {
      return this.modelService.getAll(Receipt);
    }).then((rs) => {
      this.receipts = [];
      rs.forEach((r) => {
        this.receipts.push({
          receipt: r,
          franchise: ''
        });
      });

      return this.setLoadingMessage('Loading locations...');
    }).then(() => {
      return this.modelService.getAll(Location);
    }).then((ls) => {
      let locationMapping = Location.getMapping(ls);

      this.receipts.forEach((receipt) => {
        receipt.franchise = locationMapping.get(receipt.receipt.getValue('_locationId')).getValue('_franchiseId');
      });

      return this.setLoadingMessage('Loading franchises...');
    }).then(() => {
      return this.modelService.getAll(Franchise);
    }).then((fs) => {
      let franchiseMapping = Franchise.getMapping(fs);

      this.receipts.forEach((receipt) => {
        receipt.franchise = franchiseMapping.get(receipt.franchise).getValue('name');
      });

      this.receipts.sort((a, b) => { return b.receipt.getValue('date').getTime() - a.receipt.getValue('date').getTime() });

      return this.clearMessage();
    }).catch((err) => {
      this.setErrorMessage(err.toString());
    });
  }

  ngOnInit() {}

  /**
   * Allows the user to view and edit the receipt by navigating to the manual entry
   * page of the appropriate receipt.
   * @param receipt Receipt to view and edit.
   */
  public editReceipt(receipt: Receipt): void {
    this.router.navigate(['/manual-entry'], { queryParams: { _id: receipt.getValue('_id') } });
  }

  /**
   * Deletes a receipt.
   * @param receipt Receipt to delete.
   */
  public deleteReceipt(receipt: Receipt): void {
    this.setLoadingMessage('Deleting receipt...').then(() => {
      return this.modelService.deleteOne(receipt.getValue('_id'), Receipt);
    }).then(() => {
      let index;
      for (let i = 0; i < this.receipts.length; i++) {
        if (this.receipts[i].receipt.getValue('_id') === receipt.getValue('_id')) {
          index = i;
        }
      }

      this.receipts = this.receipts.slice(0, index).concat(this.receipts.slice(index + 1));

      return this.setSuccessMessage('Deleted receipt.');
    }).catch((err) => {
      this.setErrorMessage(err.toString());
    });
  }
}
