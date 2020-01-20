import { Component, OnInit } from '@angular/core';
import { Franchise } from '../../models/franchise/franchise';
import { ModelService } from '../../services/model/model.service';
import { LoadableComponent } from '../../components/loadable/loadable.component';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-create-franchise',
  templateUrl: './create-franchise.component.html',
  styleUrls: ['./create-franchise.component.scss'],
})
export class CreateFranchiseComponent extends LoadableComponent implements OnInit {

  public model: {
    name: string
  };

  constructor(public modelService: ModelService,
    public toastController: ToastController,
    public loadingController: LoadingController) {
    
    super(loadingController, toastController);

    this.model = {
      name: ''
    };
  }

  ngOnInit() {}

  public submit(): void {
    let franchise = new Franchise();
    franchise.setValue('name', this.model.name);

    this.modelService.save(franchise).then((f) => {
      this.setSuccessMessage(`${f.getValue('name')} created!`);
    }).catch((err) => {
      this.setErrorMessage(err);
    });
  }
}
