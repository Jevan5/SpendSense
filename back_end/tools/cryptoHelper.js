const crypto = require('crypto');

module.exports = class CryptoHelper {
    /**
     * Creates a random string.
     * @param {number} length Length of string.
     * @returns {string} Random string of 'length' characters
     */
    static generateRandomString(length) {
        return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
    }

    /**
     * Hashes text with a salt.
     * @param {string} plaintext Text to hash.
     * @param {string} salt Salt to append to the text before hashing.
     * @returns {string} Hashed text.
     */
    static hash(plaintext, salt) {
        return crypto.pbkdf2Sync(plaintext, salt, 10000, 64, 'sha512').toString('hex');
    }
    /**
     * Determines if the plaintext and salt hash to a certain hash value.
     * @param {string} plaintext Text to hash.
     * @param {string} salt Salt to append to the plaintext before hashing.
     * @param {string} hash Hash to compare to.
     * @returns {boolean} True if the plaintext and salt hash to hash. Otherwise, false.
     */
    static isValidHash(plaintext, salt, hash) {
        return this.hash(plaintext, salt) === hash;
    }

    /**
     * Gets the length of a secure string.
     * @returns The length of a secure string.
     */
    static getSecureStringLength() {
        return 50;
    }

    /**
     * Gets the minimum length of a valid password.
     * @returns The minimum length of a valid password.
     */
    static getMinPasswordLength() {
        return 10;
    }
};