import { User } from 'src/app/models/user/user';
import { HttpHeaders } from '@angular/common/http';

export class MockAuthenticationService {
    public user: User;
    public password: string;

    constructor(user: User) {
        this.user = user;
    }

    public login(username: string, password: string): Promise<User> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.password = password;
                this.user = new User();
                this.user.setValues({
                    _id: 10,
                    __v: 0,
                    username: username,
                    password: password,
                    email: 'someEmail',
                    firstName: 'someFirstName',
                    lastName: 'someLastName',
                    salt: 'someSalt',
                    authentication: '',
                    changingEmail: '',
                    changingPassword: ''
                });

                resolve(this.user);
            }, 100);
        });
    }

    public logout(): void {
        this.user = null;
        this.password = null;
    }

    public isLoggedIn(): boolean {
        return this.user != null;
    }

    public register(username: string, password: string, firstName: string, lastName: string, email: string): Promise<User> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                var user = new User();
                user.setValues({
                    _id: 11,
                    __v: 0,
                    username: username,
                    password: password,
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    salt: 'someSalt',
                    authentication: 'someAuthentication',
                    changingEmail: '',
                    changingPassword: ''
                });

                resolve(user);
            }, 100);
        });
    }

    public changePassword(username: string, password: string): Promise<User> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                var user = new User();
                user.setValues({
                    _id: 11,
                    __v: 0,
                    username: username,
                    password: 'somePassword',
                    email: 'someEmail',
                    firstName: 'someFirstName',
                    lastName: 'someLastName',
                    salt: 'someSalt',
                    authentication: 'someAuthentication',
                    changingPassword: password,
                    changingEmail: 'someEmail'
                });

                resolve(user);
            }, 100);
        });
    }

    public getAuthorizationHeader(): { headers: HttpHeaders } {
        return { headers: new HttpHeaders({ Authorization: this.user.getValue('username') + ',' + this.password })};
    }

    public getUser(): User {
        return this.user;
    }

    public refreshUser(): Promise<User> {
        return this.login(this.user.getValue('username'), this.password);
    }

    public autoLogin(): Promise<User> {
        return this.login('someUsername', 'somePassword');
    }
}