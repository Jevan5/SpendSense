const fs = require('fs');
const Environment = require('../environment');

module.exports = class Logger {
    /**
     * Logs text to console and file.
     * @param {string} text Text to log.
     */
    static log(text) {
        let formattedText = new Date().toLocaleString() + ' ERROR: ' + text;
        console.log(formattedText);
        fs.appendFileSync(Environment.instance.logPath, formattedText);
    }

    /**
     * Generates a message indicating that a value does not exist.
     * @param {string} value Value which does not exist.
     * @param {string} descriptor Descriptor of the value.
     * @returns {string} Message indicating that a value does not exist.
     */
    static valueNotExistMessage(value, descriptor = '_id') {
        return descriptor + " (" + value + ") does not exist.";
    }

    /**
     * Generates a message indicating that two values do not match.
     * @param {string} value1 The first value.
     * @param {string} descriptor1 Descriptor of the first value.
     * @param {string} value2 The second value.
     * @param {string} descriptor2 Descriptor of the second value.
     * @returns {string} Message indicating that the two values do not match.
     */
    static valuesDontMatchMessage(value1, descriptor1, value2, descriptor2) {
        return descriptor1 + " (" + value1 + ") does not match " + descriptor2 + " (" + value2 + ").";
    }

    /**
     * Gets the message used for entries into a table that would violate uniqueness.
     * @returns {string} The message for uniqueness violation.
     */
    static alreadyExistsMessage() {
        return '{VALUE} already exists';
    }

    /**
     * Gets the message used for entries into a table which are missing a required field.
     * @returns {string} The message for the missing required field.
     */
    static isRequiredMessage() {
        return 'Is required';
    }

    /**
     * Generates a message indicating that a field is missing.
     * @param {string} field Field which is missing.
     * @returns {string} Message indicating that a field is missing.
     */
    static fieldMissingMessage(field) {
        return "'" + field + "' is missing.";
    }
};