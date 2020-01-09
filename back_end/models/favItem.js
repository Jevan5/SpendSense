const mongoose          = require ('mongoose');
const Schema            = mongoose.Schema;
const User              = require('./user');
const Receipt           = require('./receipt');
const ReceiptItem       = require('./receiptItem');
const SystemItem        = require('./systemItem');
const logger            = require('../tools/logger');
const authorizer        = require('../tools/authorizer');
const uniqueValidator   = require('mongoose-unique-validator');

const FavItemSchema = new Schema({
    _userId: {
        type: Schema.Types.ObjectId,
        required: [true, logger.isRequiredMessage()],
        ref: 'User',
        unique: false
    }, _receiptItemId: {
        type: Schema.Types.ObjectId,
        required: [true, logger.isRequiredMessage()],
        ref: 'ReceiptItem',
        unique: false
    }, _systemItemId: {
        type: Schema.Types.ObjectId,
        required: [true, logger.isRequiredMessage()],
        ref: 'SystemItem'
    }
});

FavItemSchema.index({ _userId: 1, _receiptItemId: 1 }, { unique: true });

FavItemSchema.pre('save', function(next) {
    var user;
    var receiptItem;

    User.findById(this._userId).then((u) => {
        user = u;

        if (!user) {
            throw new Error(logger.valueNotExistMessage(this._userId, '_userId'));
        }

        return ReceiptItem.findById(this._receiptItemId);
    }).then((r) => {
        receiptItem = r;

        if (!receiptItem) {
            throw new Error(logger.valueNotExistMessage(this._receiptItemId, '_receiptItemId'));
        }

        return Receipt.findById(receiptItem._receiptId);
    }).then((receipt) => {
        if (!authorizer.idMatches(receipt._userId, this._userId)) {
            throw new Error(logger.valuesDontMatchMessage(receipt._userId, 'receipt._userId', this._userId, '_userId'));
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

module.exports = mongoose.model('FavItem', FavItemSchema);