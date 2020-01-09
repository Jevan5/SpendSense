const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;
const Franchise = require('./franchise');
const logger    = require('../tools/logger');

const LocationSchema = new Schema({
    _franchiseId: {
        type: Schema.Types.ObjectId,
        required: [true, logger.isRequiredMessage()],
        index: 'hashed',
        ref: 'Franchise',
        unique: false
    }, address: {
        type: String,
        required: [true, logger.isRequiredMessage()],
        unique: false
    }, city: {
        type: String,
        required: [true, logger.isRequiredMessage()],
        unique: false
    }, country: {
        type: String,
        required: [true, logger.isRequiredMessage()],
        unique: false
    }
});

LocationSchema.index({ _franchiseId: 1, city: 1, address: 1, country: 1 }, { unique: true });

LocationSchema.pre('save', function(next) {
    Franchise.findById(this._franchiseId).then((franchise) => {
        if (!franchise) {
            throw new Error(logger.valueNotExistMessage(this._franchiseId, '_franchiseId'));
        }

        next();
    }).catch((err) => {
        next(err);
    });
});

module.exports = mongoose.model('Location', LocationSchema);