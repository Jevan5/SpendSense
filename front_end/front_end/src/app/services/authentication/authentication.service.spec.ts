import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { Storage } from '@ionic/storage';

import { AuthenticationService } from './authentication.service';
import { User } from 'src/app/models/user/user';
import { TestVariables } from 'src/app/testing/test-variables';

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
    username = TestVariables.username;
    password = TestVariables.password;
    authenticationService = TestBed.get(AuthenticationService);
    expect(authenticationService).toBeTruthy();
  });

  it("should not be logged in by default", (done) => {
    expect(authenticationService.isLoggedIn()).toEqual(false);
    done();
  });

  it("should not have a user logged in by default", (done) => {
    expect(authenticationService.getUser()).toEqual(null);
    done();
  });

  it("should be able to login.", (done) => {
    authenticationService.login(username, password).then((data) => {
      expect(data.getValue('username')).toEqual(username);
      expect(authenticationService.isLoggedIn()).toEqual(true);
      expect(authenticationService.getUser().getValue('username')).toEqual(data.getValue('username'));
      done();
    }, (err) => {
      fail("Make sure someone with the credentials (" + username + ',' + password + ") is registered." + JSON.stringify(err));
    });
  });

  it("should be able to logout", (done) => {
    authenticationService.login(username, password).then((data) => {
      expect(authenticationService.isLoggedIn()).toEqual(true);
      authenticationService.logout();
      expect(authenticationService.isLoggedIn()).toEqual(false);
      expect(authenticationService.getUser()).toBeNull();
      done();
    }, (err) => {
      fail(err);
    });
  });

  it("should be able to auto login.", (done) => {
    authenticationService.storage.set('username', username).then(() => {
      return authenticationService.storage.set('password', password);
    }).then(() => {
      return authenticationService.autoLogin();
    }).then((data) => {
      expect(data.getValue('username')).toEqual(authenticationService.getUser().getValue('username'));
      done();
    }).catch((err) => {
      fail(err);
    });
  });

  it("should be able to request to change password", (done) => {
    var oldChangingPassword;
    authenticationService.login(username, password).then((user) => {
      oldChangingPassword = user.getValue('changingPassword');

      // Make sure password is new, and has length of at least 10
      return authenticationService.changePassword(username, new Date().getMilliseconds().toString() + '000000000');
    }).then((data) => {
      expect(data.getValue('changingPassword')).not.toEqual(oldChangingPassword);
      done();
    }).catch((err) => {
      fail(err);
    });
  });

  it("should be able to refresh user after changes", (done) => {
    var user: User;
    var changedUser: User;
    var refreshedUser: User;
    authenticationService.login(username, password).then((u) => {
      user = u;
      var newPass = new Date().getMilliseconds().toString() + '0000000000';
      return authenticationService.changePassword(username, newPass);
    }).then((u) => {
      changedUser = u;
      expect(changedUser.getValue('changingPassword')).not.toEqual(user.getValue('changingPassword'));
      return authenticationService.refreshUser();
    }).then((u) => {
      refreshedUser = u;
      expect(changedUser.getValue('changingPassword')).toEqual(refreshedUser.getValue('changingPassword'));
      expect(refreshedUser.getValue('changingPassword')).toEqual(authenticationService.getUser().getValue('changingPassword'));
      done();
    }).catch((err) => {
      fail(err);
    });
  });
});
