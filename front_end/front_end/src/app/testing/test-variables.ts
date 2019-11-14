import { User } from 'src/app/models/user/user';

export class TestVariables {
    constructor() {}

    public static username: string = 'someusername';
    public static password: string = 'somepassword';

    /**
     * Mock user information.
     * @returns A mock user.
     */
    public static getUser(): User {
        var user = new User();
        user.setValues({
            __v: 0,
            username: 'someusername',
            password: 'somepassword',
            email: 'someEmail@server.endpoint',
            firstName: 'theirFirstName',
            lastName: 'theirLastName',
            salt: 'someSalt',
            authentication: '',
            changingEmail: '',
            changingPassword: ''
        });

        return user;
    }
}