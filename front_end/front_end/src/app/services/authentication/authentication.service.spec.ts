import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  let username: string;
  let password: string;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule
    ], providers: [
      {
        provide: Storage,
        useValue: new Storage({})
      }
    ]
  }));

  beforeEach(() => {
    // Make sure someone with these credentials is registered
    username = 'someusername';
    password = 'somePassword';
    authenticationService = TestBed.get(AuthenticationService);
    expect(authenticationService).toBeTruthy();
  });

  it("should not be logged in by default", () => {
    expect(authenticationService.isLoggedIn()).toEqual(false);
  });

  it("should not have a user logged in by default", () => {
    expect(authenticationService.getUser()).toEqual(null);
  });

  it("should be able to login", (done) => {
    authenticationService.login(username, password).subscribe((data) => {
      expect(data.getValue('username')).toEqual(username);
      expect(authenticationService.isLoggedIn()).toEqual(true);
      expect(authenticationService.getUser().getValue('username')).toEqual(data.getValue('username'));
      done();
    }, (err) => {
      fail(err);
    });
  });

  it("should be able to logout", (done) => {
    authenticationService.login(username, password).subscribe((data) => {
      expect(authenticationService.isLoggedIn()).toEqual(true);
      authenticationService.logout();
      expect(authenticationService.isLoggedIn()).toEqual(false);
      expect(authenticationService.getUser()).toBeNull();
      done();
    }, (err) => {
      fail(err);
    });
  });

  it("should be able to auto login. If this fails, try logging in manually to set local storage.", (done) => {
    authenticationService.storage.set('username', username).then(() => {
      return authenticationService.storage.set('password', password);
    }).then(() => {
      authenticationService.autoLogin().subscribe((data) => {
        expect(data.getValue('username')).toEqual(authenticationService.getUser().getValue('username'));
        done();
      });
    }, (err) => {
      fail(err);
    });
  });

  it("should be able to request to change password", (done) => {
    var oldChangingPassword;
    authenticationService.login(username, password).subscribe((user) => {
      oldChangingPassword = user.getValue('changingPassword');

      // Make sure password is new, and has length of at least 10
      authenticationService.changePassword(username, new Date().getMilliseconds().toString() + '000000000').subscribe((data) => {
        expect(data.getValue('changingPassword')).not.toEqual(oldChangingPassword);
        done();
      }, (err) => {
        fail(err);
      });
    }, (err) => {
      fail(err);
    });
  });

  it("should be able to refresh user after changes", (done) => {
    var oldChangingPassword;
    authenticationService.login(username, password).subscribe((user) => {
      oldChangingPassword = user.getValue('changingPassword');

      authenticationService.changePassword(username, new Date().getMilliseconds().toString() + '0000000000').subscribe((data) => {
        expect(data.getValue('changingPassword')).not.toEqual(oldChangingPassword);
        authenticationService.refreshUser().subscribe((u) => {
          expect(data.getValue('changingPassword')).toEqual(u.getValue('changingPassword'));
          expect(u.getValue('changingPassword')).toEqual(authenticationService.getUser().getValue('changingPassword'));
          done();
        }, (err) => {
          fail(err);
        });
      }, (err) => {
        fail(err);
      });
    }, (err) => {
      fail(err);
    });
  });
});
