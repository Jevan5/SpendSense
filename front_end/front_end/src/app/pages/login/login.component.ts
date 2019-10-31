import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Loadable } from '../../util/loadable/loadable';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends Loadable implements OnInit {
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
      password: string
    }
  };

  constructor(private router: Router, private authenticationService: AuthenticationService) {
    super();
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
        password: ''
      }
    };
  }

  /**
   * Attempts to login the user.
   */
  private login(): void {
    this.setLoadingMessage("Attempting to login " + this.model.login.username);
    this.authenticationService.login(this.model.login.username, this.model.login.password)
    .subscribe((data) => {
      this.router.navigate(['home']);
      this.clearMessage();
      this.clearValues();
    }, (err) => {
      this.setErrorMessage(err.error);
    });
  }

  /**
   * Attempts to register the user.
   */
  private register(): void {
    this.setLoadingMessage("Attempting to register " + this.model.register.username);
    this.authenticationService.register(this.model.register.username, this.model.register.password, this.model.register.firstName, this.model.register.lastName, this.model.register.email)
    .subscribe((data) => {
      this.setSuccessMessage('Registered user. Please check ' + this.model.register.email + ' for an authentication link to complete registration.');
      this.clearValues();
    }, (err) => {
      this.setErrorMessage(err.error);
    });
  }

  /**
   * Attempts to change a user's password.
   */
  private changePassword(): void {
    this.setLoadingMessage("Attempting to change password for " + this.model.changePassword.username);
    this.authenticationService.changePassword(this.model.changePassword.username, this.model.changePassword.password)
    .subscribe((data) => {
      this.setSuccessMessage('Requested to change password. Please check the email associated with the account for an authentication link to finish changing your password.');
      this.clearValues();
    }, (err) => {
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
        password: ''
      }
    }
  };
}
