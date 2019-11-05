const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;
const Location      = require('./location');
const ReceiptItem   = require('./receiptItem');
const logger        = require('../tools/logger');

const LocationItemSchema = new Schema({
    _locationId: {
        type: Schema.Types.ObjectId,
        required: [true, logger.isRequiredMessage()],
        ref: 'Location',
        unique: false
    }, _receiptItemId: {
        type: Schema.Types.ObjectId,
        required: [true, logger.isRequiredMessage()],
        ref: 'ReceiptItem',
        unique: false
    }, lastPurchased: {
        type: Date,
        required: [true, logger.isRequiredMessage()]
    }
});

LocationItemSchema.index({ _locationId: 1, _receiptItemId: 1 }, { unique: true });

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