import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  private isNavbarOpen: boolean;

  constructor(private router: Router, private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.isNavbarOpen = false;
  }

  /**
   * Toggles the navigation bar.
   * @returns Whether or not the navigation bar is now open.
   */
  private toggleNavbar(): boolean {
    return this.isNavbarOpen = !this.isNavbarOpen;
  }

  /**
   * Navigates to a path.
   * @param path Path to navigate to.
   */
  private clickNavigation(path: string): void {
    this.router.navigate([path]);
    this.isNavbarOpen = false;
  }

  /**
   * Logs the user out.
   */
  private clickLogout(): void {
    this.authenticationService.logout();
    this.isNavbarOpen = false;
  }
}