const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;
const Location      = require('../location/location');
const ReceiptItem   = require('../receiptItem/receiptItem');
const logger        = require('../../tools/logger');

const LocationItemSchema = new Schema({
    _locationId: {
        type: Schema.Types.ObjectId,
        required: [true, logger.isRequiredMessage()],
        ref: 'Location',
        unique: false
    }, name: {
        type: String,
        required: [true, logger.isRequiredMessage()],
        unique: false
    }, tag: {
        type: String,
        required: [true, logger.isRequiredMessage()],
        unique: false
    }, price: {
        type: Number,
        required: [true, logger.isRequiredMessage()],
        unique: false
    }
});

LocationItemSchema.index({ name: 1, tag: 1, _locationId: 1 }, { unique: true });

LocationItemSchema.pre('save', function(next) {
    Location.findById(this._locationId).then((location) => {
        if (!location) {
            throw new Error(logger.valueNotExistMessage(this._locationId, '_locationId'));
        }

        next();
    }).catch((err) => {
        next(err);
    });
});

module.exports = mongoose.model('LocationItem', LocationItemSchema);