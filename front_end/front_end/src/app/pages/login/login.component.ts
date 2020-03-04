import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { LoadableComponent } from '../../components/loadable/loadable.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends LoadableComponent implements OnInit {
  private model: {
    login: {
      username: string,
      password: string
    }, register: {
      username: string,
      password: string,
      firstName: string,
      lastName: string,
      email: string
    }, changePassword: {
      username: string,
      changingPassword: string
    }
  };

  constructor(private router: Router,
    private authenticationService: AuthenticationService,
    public loadingController: LoadingController,
    public toastController: ToastController) {
    super(loadingController, toastController);
  }

  ngOnInit() {
    this.model = {
      login: {
        username: '',
        password: ''
      }, register: {
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: ''
      }, changePassword: {
        username: '',
        changingPassword: ''
      }
    };
  }

  /**
   * Attempts to login the user.
   */
  private login(): void {
    this.setLoadingMessage("Attempting to login " + this.model.login.username).then(() => {
      return this.authenticationService.login(this.model.login.username, this.model.login.password);
    }).then((user) => {
      this.setSuccessMessage('Welcome back, ' + user.getValue('firstName'));
      this.clearValues();
      this.router.navigate(['home']);
    }).catch((err) => {
      this.setErrorMessage(err);
    });
  }

  /**
   * Attempts to register the user.
   */
  private register(): void {
    this.setLoadingMessage("Attempting to register " + this.model.register.username).then(() => {
      return this.authenticationService.register(this.model.register.username, this.model.register.password, this.model.register.firstName, this.model.register.lastName, this.model.register.email);
    }).then((user) => {
      return this.setSuccessMessage('Registered ' + user.getValue('username') + '. Please check ' + user.getValue('email') + ' for an authentication link to complete registration.');
    }).then(() => {
      this.clearValues();
    }).catch((err) => {
      this.setErrorMessage(err);
    });
  }

  /**
   * Attempts to change a user's password.
   */
  private changePassword(): void {
    this.setLoadingMessage("Attempting to change password for " + this.model.changePassword.username).then(() => {
      return this.authenticationService.changePassword(this.model.changePassword.username, this.model.changePassword.changingPassword);
    }).then((user) => {
      this.clearValues();
      this.setSuccessMessage('Requested to change password. Please check the email associated with the account for an authentication link to finish changing your password.');
    }).catch((err) => {
      this.setErrorMessage(err.error);
    });
  }

  /**
   * Clears all values on the page.
   */
  private clearValues(): void {
    this.model = {
      login: {
        username: '',
        password: ''
      }, register: {
        username: '',
        password: '',
        email: '',
        firstName: '',
        lastName: ''
      }, changePassword: {
        username: '',
        changingPassword: ''
      }
    };
  }
}
