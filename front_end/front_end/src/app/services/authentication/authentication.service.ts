import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../../models/user/user';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private user: User;
  private password: string;
  private authorizationHeader = 'Authorization';

  constructor(private http: HttpClient, public storage: Storage) {}

  /**
   * Attempts to login the user.
   * @param username Username of user.
   * @param password Password of user.
   * @returns Resolves with the logged in User if login is successful.
   */
  public login(username: string, password: string): Observable<User> {
    return new Observable((subscriber) => {
      if (username == null) {
        subscriber.error('username is null');
        return;
      }

      if (password == null) {
        subscriber.error('password is null');
        return;
      }

      this.http.get('http://' + environment.backEndIp + ':' + environment.backEndPort + '/users', {
        headers: new HttpHeaders({
          'Authorization': username + ',' + password
        })
      }).subscribe((data: any) => {
        try {
          this.user = User.createFromResponse(data.user);
          this.password = password;

          this.storage.set('username', username).then(() => {
            return this.storage.set('password', password);
          }).then(() => {
            subscriber.next(this.getUser());
          }).catch((err) => {
            subscriber.error(err);
          });
        } catch (e) {
          subscriber.error(e);
        }
      }, (err) => {
        subscriber.error(err);
      });
    });
  }

  /**
   * Logs the current user out, if logged in.
   */
  public logout(): void {
    this.user = null;
    this.password = null;
  }

  /**
   * Determines whether or not a user is logged in.
   * @returns True if a user is logged in. Otherwise, false.
   */
  public isLoggedIn(): boolean {
    return this.getUser() != null;
  }

  /**
   * Attempts to register the user.
   * @param username Username of user.
   * @param password Password for user.
   * @param firstName First name of user.
   * @param lastName Last name of user.
   * @param email Email to use for registration.
   * @returns Resolves with the registered User if registration is successful. Still needs to be authenticated through email.
   */
  public register(username: string, password: string, firstName: string, lastName: string, email: string): Observable<User> {
    return new Observable((subscriber) => {
      this.http.post('http://' + environment.backEndIp + ':' + environment.backEndPort + '/users', {
        user: {
          username: username,
          password: password,
          firstName: firstName,
          lastName: lastName,
          email: email
        }
      }).subscribe((data: any) => {
        try {
          subscriber.next(User.createFromResponse(data.user));
        } catch (e) {
          subscriber.error(e);
        }
      }, (err) => {
        subscriber.error(err);
      });
    });
  }

  /**
   * Requests to change the password for a user. Still needs to be authenticated via email afterward.
   * @param username Username to change password for.
   * @param password New password.
   * @returns Resolves with the User if the password is requested to change.
   */
  public changePassword(username: string, password: string): Observable<User> {
    return new Observable((subscriber) => {
      this.http.put('http://' + environment.backEndIp + ':' + environment.backEndPort + '/users', {
        user: {
          username: username,
          changingPassword: password
        }
      }).subscribe((data: any) => {
        try {
          subscriber.next(User.createFromResponse(data.user));
        } catch (e) {
          subscriber.error(e);
        }
      }, (err) => {
        subscriber.error(err);
      });
    });
  }

  /**
   * Gets the name of the header used for authorization.
   * @returns The name of the header used for authorization.
   */
  public getAuthorizationHeader(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        Authorization: this.getUser().getValue('username') + ',' + this.password
      })
    };
  }

  /**
   * Gets a deep copy of the logged in user.
   * @returns A copy of the logged in user. Null if not logged in.
   */
  public getUser(): User {
    if (this.user == null) {
      return null;
    }

    return this.user.deepCopy();
  }

  /**
   * Attempts to refresh the data of the logged in user.
   * @returns Resolves with the refreshed loggined in user if successful.
   */
  public refreshUser(): Observable<User> {
    return this.login(this.getUser().getValue('username'), this.password);
  }

  /**
   * Attempts to login using credentials from local storage.
   * @returns Resolves with the logged in user if successful.
   */
  public autoLogin(): Observable<User> {
    var username;
    var password;
    this.storage = new Storage({});

    return new Observable((subscriber) => {
      this.storage.get('username').then((u) => {
        username = u;
  
        return this.storage.get('password');
      }).then((p) => {
        password = p;
  
        this.login(username, password).subscribe((data) => {
          subscriber.next(data);
        }, (err) => {
          subscriber.error(err);
        });
      }).catch((err) => {
        subscriber.error(err);
      });
    });
  }
}