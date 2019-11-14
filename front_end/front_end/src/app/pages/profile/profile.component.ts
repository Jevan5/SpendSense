import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { LoadableComponent } from 'src/app/components/loadable/loadable.component';
import { User } from 'src/app/models/user/user';
import { ModelService } from 'src/app/services/model/model.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent extends LoadableComponent implements OnInit {
  public model: {
    username: string,
    firstName: string,
    lastName: string,
    email: string
  };
  public editing: boolean;

  constructor(public authenticationService: AuthenticationService,
    public modelService: ModelService,
    public loadingController: LoadingController,
    public toastController: ToastController
    ) {
    super(loadingController, toastController);

    this.model = {
      username: this.authenticationService.getUser().getValue('username'),
      firstName: this.authenticationService.getUser().getValue('firstName'),
      lastName: this.authenticationService.getUser().getValue('lastName'),
      email: this.authenticationService.getUser().getValue('email')
    };
    this.editing = false;
  }

  ngOnInit() {}

  /**
   * Saves information changes for the user.
   */
  public save(): Promise<User> {
    return new Promise((resolve, reject) => {
      var tryingToChangeEmail;
      var newEmail = this.model.email;
      this.setLoadingMessage('Saving user information').then(() => {
        if (this.model.email == '') {
          throw new Error("'email' must be non-empy.");
        }

        var user = this.authenticationService.getUser();

        if (user.getValue('email').toLowerCase() == this.model.email.toLowerCase()) {
          tryingToChangeEmail = false;
        } else {
          tryingToChangeEmail = true;
        }

        user.setValues(this.model);
        user.setValue('changingEmail', this.model.email);

        return this.modelService.save(user);
      }).then((user) => {
        return this.authenticationService.refreshUser();
      }).then((refreshedUser) => {
        this.model = {
          username: refreshedUser.getValue('username'),
          firstName: refreshedUser.getValue('firstName'),
          lastName: refreshedUser.getValue('lastName'),
          email: refreshedUser.getValue('email')
        };
  
        var message = 'Updated profile information.';
  
        if (tryingToChangeEmail) {
          message += ' Please check ' + newEmail + ' for a link to confirm your new email.';
        }
  
        this.editing = false;
        return this.setSuccessMessage(message);
      }).then(() => {
        resolve(this.authenticationService.getUser());
      }).catch((err) => {
        this.editing = true;
        this.setErrorMessage(err).then(() => {
          reject(err);
        }).catch((e) => {
          reject(e);
        });
      });
    });
  }

  /**
   * Toggles the editing.
   */
  public toggleEditing(): void {
    this.editing = !this.editing;
  }

  /**
   * Cancels editing.
   */
  public cancel(): void {
    this.model = {
      username: this.authenticationService.getUser().getValue('username'),
      firstName: this.authenticationService.getUser().getValue('firstName'),
      lastName: this.authenticationService.getUser().getValue('lastName'),
      email: this.authenticationService.getUser().getValue('email')
    };

    this.editing = false;
  }
}
