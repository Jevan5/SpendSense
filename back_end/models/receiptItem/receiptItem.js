const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;
const logger        = require('../../tools/logger');

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
    }, amount: {
        type: Number
    }
});

ReceiptItemSchema.pre('save', function(next) {
    // Ensure the field exists, even if it's null
    if (this.amount == null) {
        this.amount = null;
    }

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

const LocationItem  = require('../locationItem/locationItem');
const Receipt       = require('../receipt/receipt');
const SystemItem    = require('../systemItem/systemItem');