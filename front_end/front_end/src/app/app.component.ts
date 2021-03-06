import { Component, Inject } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AuthenticationService } from './services/authentication/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public loggedInURLs = ['/profile', '/reports', '/search', '/manual-entry', '/create-franchise', '/create-location', '/upload-image', '/view-receipts', '/tutorial'];
  public loggedOutURLs = ['/login'];
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    @Inject(Router) private router: Router,
    @Inject(AuthenticationService) private authenticationService: AuthenticationService
  ) {
    this.initializeApp();

    // Can't navigate to login page if they're logged in
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (this.urlMatches(event.url, this.loggedInURLs)) { // URL which needs to be logged in for
          if (!this.authenticationService.isLoggedIn()) {
            this.router.navigate(['/home']);
          }
        } else if (this.urlMatches(event.url, this.loggedOutURLs)) { // URL which you can't be logged in for
          if (this.authenticationService.isLoggedIn()) {
            this.router.navigate(['/home']);
          }
        }
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  public urlMatches(url: string, toMatchAgainst: Array<string>): boolean {
    let matched = false;

    toMatchAgainst.forEach((matchingAgainst) => {
      if (url.indexOf(matchingAgainst) >= 0) {
        matched = true;
      }
    });

    return matched;
  }
}
