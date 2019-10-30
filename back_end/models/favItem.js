const mongoose      = require ('mongoose');
const Schema        = mongoose.Schema;
const User          = require('./user');
const Receipt       = require('./receipt');
const ReceiptItem   = require('./receiptItem');
const logger        = require('../tools/logger');
const authorizer    = require('../tools/authorizer');

const FavItemSchema = new Schema({
    _userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        unique: false
    }, _receiptItemId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'ReceiptItem',
        unique: false
    }, _systemItemId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'SystemItem'
    }
});

FavItemSchema.index({ _userId: 1, _receiptItemId: 1 }, { unique: true });

FavItemSchema.pre('save', (favItem) => {
    return new Promise((resolve, reject) => {
        var user;
        var receiptItem;
        User.findById(favItem._userId).then((u) => {
            user = u;

            if (!user) {
                throw new Error(logger.valueNotExistMessage(favItem._userId, '_userId'));
            }

            return ReceiptItem.findById(favItem._receiptItemId);
        }).then((r) => {
            receiptItem = r;

            if (!receiptItem) {
                throw new Error(logger.valueNotExistMessage(favItem._receiptItemId, '_receiptItemId'));
            }

            return Receipt.findById(receiptItem._receiptId);
        }).then((receipt) => {
            if (!authorizer.idMatches(receipt._userId, favItem._userId)) {
                throw new Error(logger.valuesDontMatchMessage(favItem._userId, '_userId', receipt._userId, "receipt item's receipt._userId"));
            }

            resolve();
        }).catch((err) => {
            reject(err);
        });
    });
})

module.exports = mongoose.model('FavItem', FavItemSchema);