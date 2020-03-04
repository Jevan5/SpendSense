import { Model } from '../model';

export class User extends Model {
    public readonly class = User;

    constructor() {
        super();
    }

    public static getModelName(): string {
        return 'user';
    }

    public static getFields(): Array<string> {
        return ['_id', '__v', 'username', 'password', 'email', 'authentication', 'firstName', 'lastName', 'changingEmail', 'changingPassword', 'salt'];
    }
}