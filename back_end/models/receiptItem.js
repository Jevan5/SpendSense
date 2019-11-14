const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;
const LocationItem  = require('./locationItem');
const Receipt       = require('./receipt');
const SystemItem    = require('./systemItem');
const logger        = require('../tools/logger');

const ReceiptItemSchema = new Schema({
    _receiptId: {
        type: Schema.Types.ObjectId,
        index: 'hashed',
        ref: 'Receipt',
        required: [true, logger.isRequiredMessage()]
    }, _systemItemId: {
        type: Schema.Types.ObjectId,
        index: 'hashed',
        ref: 'SystemItem',
        required: [true, logger.isRequiredMessage()]
    }, name: {
        type: String,
        required: [true, logger.isRequiredMessage()]
    }, price: {
        type: Number,
        required: [true, logger.isRequiredMessage()]
    }, quantity: {
        type: Number,
        required: [true, logger.isRequiredMessage()]
    }
});

ReceiptItemSchema.pre('remove', (receiptItem) => {
    return LocationItem.deleteMany({ _receiptItemId: receiptItem._id });
});

ReceiptItemSchema.pre('save', function(next) {
    Receipt.findById(this._receiptId).then((receipt) => {
        if (!receipt) {
            throw new Error(logger.valueNotExistMessage(this._receiptId, '_receiptId'));
        }

        return SystemItem.findById(this._systemItemId);
    }).then((systemItem) => {
        if (!systemItem) {
            throw new Error(logger.valueNotExistMessage(this._systemItemId, '_systemItemId'));
        }

        next();
    }).catch((err) => {
        next(err);
    });
});

module.exports = mongoose.model('ReceiptItem', ReceiptItemSchema);