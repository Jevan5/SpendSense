const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }, firstName: {
        type: String,
        required: true
    }, lastName: {
        type: String,
        required: true
    }, username: {
        type: String,
        unique: true,
        required: true
    }, password: {
        type: String,
        required: true
    }, salt: {
        type: String,
        required: true
    }, changingPassword: {
        type: String,
        required: () => {
            return typeof(this.changingPassword) === 'string' && (this.changingPassword === '' || this.changingEmail === '');
        }
    }, changingEmail: {
        type: String,
        required: () => {
            return typeof(this.changingEmail) === 'string' && (this.changingPassword === '' || this.changingEmail === '');
        }
    }, authentication: {
        type: String,
        required: () => {
            return this.authentication != null;
        }
    }
});

module.exports = mongoose.model('User', UserSchema);