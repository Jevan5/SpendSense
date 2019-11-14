import { Model } from '../model/model';

export class User extends Model {
    private static fields = ['_id', '__v', 'username', 'password', 'email', 'authentication', 'firstName', 'lastName', 'changingEmail', 'changingPassword'];

    constructor() {
        super();
    }

    public static getModelName(): string {
        return 'user';
    }

    public static createOneFromResponse(response: any): User {
        if (response == null) {
            throw new Error("response is null.");
        }

        if (response[User.getModelName()] == null) {
            throw new Error("response." + User.getModelName() + " is null.");
        }

        let user = new User();

        User.fields.forEach((field) => {
            if (!response[User.getModelName()].hasOwnProperty(field)) {
                throw new Error("response (" + JSON.stringify(response) + ") is missing property (" + field + ")");
            }

            user.setValue(field, response[User.getModelName()][field]);
        });

        return user;
    }

    public static createManyFromResponse(response: any): Array<User> {
        if (response == null) {
            throw new Error('response is null.');
        }

        if (response[User.getModelName() + 's'] == null) {
            throw new Error("response." + User.getModelName() + 's is null.');
        }

        var users = new Array<User>();

        response[User.getModelName() + 's'].forEach((user) => {
            users.push(User.createOneFromResponse({ user: user }));
        });

        return users;
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

    public getClass() {
        return User;
    }
}