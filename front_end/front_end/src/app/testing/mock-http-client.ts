import { TestVariables } from './test-variables';
import { Observable } from 'rxjs';

export class MockHttpClient {
    static user;

    public get(url: string): Observable<any> {
        if (MockHttpClient.user == null) {
            MockHttpClient.initializeUser();
        }

        return new Observable<any>((subscriber) => {
            if (url.indexOf('/') < 0) {
                subscriber.error(`'${url}' does not contain a '/'`);
                return;
            }

            let route = url.substring(url.lastIndexOf('/') + 1, url.length);

            if (route === 'users') {
                subscriber.next({
                    user: JSON.parse(JSON.stringify(MockHttpClient.user))
                });
            }
        });
    }

    public put(url: string, body): Observable<any> {
        if (MockHttpClient.user == null) {
            MockHttpClient.initializeUser();
        }
        
        return new Observable<any>((subscriber) => {
            if (url.indexOf('/') < 0) {
                subscriber.error(`'${url}' does not contain a '/'`);
                return;
            }

            let route = url.substring(url.lastIndexOf('/') + 1, url.length);

            if (route === 'users') {
                MockHttpClient.user.changingPassword = body.user.changingPassword;

                subscriber.next({
                    user: JSON.parse(JSON.stringify(MockHttpClient.user))
                });
            }
        })
    }

    private static initializeUser(): void {
        this.user = TestVariables.getUser().toJson();
        this.user._id = 1;
    }
}