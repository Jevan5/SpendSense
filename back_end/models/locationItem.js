const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;
const Location      = require('./location');
const ReceiptItem   = require('./receiptItem');
const logger        = require('../tools/logger');

const LocationItemSchema = new Schema({
    _locationId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Location',
        unique: false
    }, _receiptItemId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'ReceiptItem',
        unique: false
    }, lastPurchased: {
        type: Date,
        required: true
    }
});

LocationItemSchema.index({ _locationId: 1, _receiptItemId: 1 }, { unique: true });

LocationItemSchema.pre('save', (locationItem) => {
    return new Promise((resolve, reject) => {
        Location.findById(locationItem._locationId).then((location) => {
            if (!location) {
                reject(logger.valueNotExistMessage(locationItem._locationId, '_locationId'));
            }

            resolve();
        })
    });
});

module.exports = mongoose.model('LocationItem', LocationItemSchema);