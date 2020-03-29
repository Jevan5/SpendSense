import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { LoadableComponent } from '../loadable/loadable.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent extends LoadableComponent implements OnInit {
  constructor(private router: Router,
    private authenticationService: AuthenticationService,
    public loadingController: LoadingController,
    public toastController: ToastController) {
    super(loadingController, toastController);
  }

  ngOnInit() {}

  /**
   * Navigates to a path.
   * @param path Path to navigate to.
   */
  private clickNavigation(path: string): void {
    this.router.navigate([path]);
  }

  /**
   * Logs the user out.
   */
  private clickLogout(): void {
    if (!this.authenticationService.isLoggedIn()) {
      throw new Error('Logging out when user is not logged in.');
    }

    this.setSuccessMessage("Goodbye, " + this.authenticationService.getUser().getValue('firstName'));
    this.authenticationService.logout();
    this.router.navigate(['/home']);
  }
}