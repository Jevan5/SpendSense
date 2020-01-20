import { Component, OnInit } from '@angular/core';
import { Franchise } from '../../models/franchise/franchise';
import { Location } from '../../models/location/location';
import { ModelService } from '../../services/model/model.service';
import { LoadableComponent } from '../../components/loadable/loadable.component';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-create-location',
  templateUrl: './create-location.component.html',
  styleUrls: ['./create-location.component.scss'],
})
export class CreateLocationComponent extends LoadableComponent implements OnInit {

  public franchises: Array<Franchise>;
  public franchise: Franchise;
  public model: {
    address: string,
    city: string,
    country: string
  };

  constructor(public modelService: ModelService,
    public toastController: ToastController,
    public loadingController: LoadingController) {

    super(loadingController, toastController);

    this.franchise = null;
    this.model = {
      address: '',
      city: '',
      country: ''
    };

    this.setLoadingMessage('Loading franchises...').then(() => {
      return this.modelService.getAll(Franchise);
    }).then((franchises) => {
      this.franchises = franchises;

      return this.clearMessage();
    }).catch((err) => {
      this.setErrorMessage(err);
    });
  }

  ngOnInit() {}

  public submit(): void {
    let location = new Location();
    location.setValue('_franchiseId', this.franchise.getValue('_id'));
    location.setValue('address', this.model.address);
    location.setValue('city', this.model.city);
    location.setValue('country', this.model.country);

    this.modelService.save(location).then((l) => {
      this.setSuccessMessage(`${l.getValue('address')}, ${l.getValue('city')}, ${l.getValue('country')} created!`);
    }).catch((err) => {
      this.setErrorMessage(err);
    });
  }

  public franchiseDisplayFunction(franchise: Franchise): string {
    return franchise.getValue('name');
  }

  public selectsFranchise(franchise: Franchise): void {
    this.franchise = franchise;
  }

  public unselectsFranchise(): void {
    this.franchise = null;
  }
}
