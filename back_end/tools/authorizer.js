const cryptoHelper = require('./cryptoHelper');
const User = require('../models/user');

module.exports = class Authorizer {
    /**
     * Enumerator for authentication results.
     */
    static authenticationEnum = {
        USERNAME_INVALID: 'Username is invalid.',
        PASSWORD_INVALID: 'Password is invalid.',
        AUTHENTICATION_INVALID: 'Authentication is invalid.',
        NOT_AUTHENTICATED: 'Account has not been authenticated. Please click the authentication link in your email.',
        SUCCESS: ''
    }

    /**
     * Extracts the authorization value from a request.
     * @param {Request} request Request to get authorization from. 
     * @returns {string} The value of the authorization.
     */
    static getAuthorization(request) {
        if (request.header('Authorization') == null) {
            throw new Error("Missing 'Authorization' header.");
        }

        return request.header('Authorization');
    }

    /**
     * Extracts the username from the authorization string.
     * @param {string} authorization String representing the authorization.
     * @returns {string} Username to be authorized.
     */
    static getUsername(authorization) {
        if (authorization.indexOf(',') < 0) {
            throw new Error("authorization (" + authorization + ") does not contain ','");
        }

        return authorization.substring(0, authorization.indexOf(','));
    }

    /**
     * Extracts the password from the authorization string.
     * @param {string} authorization String representing the authorization.
     * @returns {string} Password to be authorized.
     */
    static getPassword(authorization) {
        if (authorization.indexOf(',') < 0) {
            throw new Error("authorization (" + authorization + ") does not contain ','");
        }

        return authorization.substring(1 + authorization.indexOf(','));
    }

    /**
     * Extracts the username from the authorization value from a request.
     * @param {Request} request Request to get authorization from.
     * @returns {string} Username to be authorized.
     */
    static getUsernameFromRequest(request) {
        return this.getUsername(this.getAuthorization(request));
    }

    /**
     * Extracts the password from the authorization value from a request.
     * @param {Request} request Request to get authorized from.
     * @returns {string} Password to be authorized.
     */
    static getPasswordFromRequest(request) {
        return this.getPassword(this.getAuthorization(request));
    }

    /**
     * Compares two IDs. Converts them to their lowercase equivalents before
     * comparing.
     * @param {string} id One ID.
     * @param {string} otherId The other ID.
     * @returns {boolean} True if both IDs are equivalent.
     */
    static idMatches(id, otherId) {
        return id.toString().toLowerCase() === otherId.toString().toLowerCase();
    }

    /**
     * Checks whether an authentication plaintext matches against a User's hashed
     * authentication.
     * @param {string} authentication Plaintext of authentication to authenticate.
     * @param {User} user User to authenticate against.
     * @returns {boolean} True if the authentication plaintext passes authentication. Otherwise, false.
     */
    static checkAuthentication(authentication, user) {
        return cryptoHelper.isValidHash(authentication, user.salt, user.authentication);
    }

    /**
     * Authenticates the username and password passed in the request
     * against a User in the database that has authenticated their
     * registration.
     * @param {Request} request Request to authenticate.
     * @returns {Promise} Resolves with an authenticated User that has been
     * found which has a matching username and password as the request.
     */
    static authenticateRequest(request) {
        var username;
        var password;
        return new Promise((resolve, reject) => {
            username = this.getUsernameFromRequest(request);
            password = this.getPasswordFromRequest(request);
            resolve();
        }).then(() => {
            return User.findOne({ username: username.toLowerCase() });
        }).then((user) => {
            if (!user) {
                throw new Error(this.authenticationEnum.USERNAME_INVALID);
            } else if (!cryptoHelper.isValidHash(password, user.salt, user.password)) {
                throw new Error(this.authenticationEnum.PASSWORD_INVALID);
            } else if (!(user.authentication === '' || user.changingEmail !== '' || user.changingPassword !== '')) {
                throw new Error(this.authenticationEnum.NOT_AUTHENTICATED);
            } else {
                return user;
            }
        });
    }
};