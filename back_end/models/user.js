const mongoose          = require('mongoose');
const Schema            = mongoose.Schema;
const uniqueValidator   = require('mongoose-unique-validator');
const logger            = require('../tools/logger');

const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, logger.isRequiredMessage()],
        unique: true,
        lowercase: [true, "Must be lowercase"]
    }, firstName: {
        type: String,
        required: [true, logger.isRequiredMessage()]
    }, lastName: {
        type: String,
        required: [true, logger.isRequiredMessage()]
    }, username: {
        type: String,
        unique: true,
        required: [true, logger.isRequiredMessage()],
        lowercase: [true, "Must be lowercase"]
    }, password: {
        type: String,
        required: [true, logger.isRequiredMessage()]
    }, salt: {
        type: String,
        required: [true, logger.isRequiredMessage()]
    }, changingPassword: {
        type: String
    }, changingEmail: {
        type: String,
        lowercase: [true, "Must be lowercase"]
    }, authentication: {
        type: String
    }
});

UserSchema.pre('save', function(next) {
    if (!this.username.match("^[A-Za-z0-9]+$")) {
        return next("'username' must only contain letters and digits.");
    }

    if (this.changingPassword && this.changingEmail) {
        return next("Only one of 'changingPassword' and 'changingEmail' may be active at once.");
    }

    ['changingPassword', 'changingEmail', 'authentication'].forEach((field) => {
        if (this[field] == null) {
            return next("'" + field + "' must exist.");
        }
    });

    this.username = this.username.toLowerCase();
    this.email = this.email.toLowerCase();
    
    next();
});

UserSchema.plugin(uniqueValidator, { message: logger.alreadyExistsMessage() });

module.exports = mongoose.model('User', UserSchema);