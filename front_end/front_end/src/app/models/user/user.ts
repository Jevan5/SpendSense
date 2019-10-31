import { Model } from '../model/model';

export class User extends Model {
    private static fields = ['_id', '__v', 'username', 'password', 'email', 'authentication', 'firstName', 'lastName', 'changingEmail', 'changingPassword'];

    constructor() {
        super();
    }

    public getModelName(): string {
        return 'user';
    }

    public static createFromResponse(response: any): User {
        if (response == null) {
            throw new Error("response is null.");
        }

        let user = new User();

        User.fields.forEach((field) => {
            if (!response.hasOwnProperty(field)) {
                throw new Error("response (" + JSON.stringify(response) + ") is missing property (" + field + ")");
            }

            user.setValue(field, response[field]);
        });

        return user;
    }

    public deepCopy(): User {
        let user = new User();

        User.fields.forEach((field) => {
            if (this.hasField(field)) {
                user.setValue(field, this.getValue(field));
            }
        });

        return user;
    }
}