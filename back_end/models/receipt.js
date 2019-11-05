const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;
const ReceiptItem   = require('./receiptItem');
const User          = require('./user');
const logger        = require('../tools/logger');

const ReceiptSchema = new Schema({
    _userId: {
        type: Schema.Types.ObjectId,
        index: 'hashed',
        required: [true, logger.isRequiredMessage()],
        ref: 'User'
    }, date: {
        type: Date,
        required: [true, logger.isRequiredMessage()]
    }
});

ReceiptSchema.pre('remove', function(next) {
    ReceiptItem.deleteMany({ _receiptId: receipt._id }).then(() => {
        next();
    }).catch((err) => {
        next(err);
    });
});

ReceiptSchema.pre('save', function(next) {
    User.findById(receipt._userId).then((user) => {
        if (!user) {
            throw new Error(logger.valueNotExistMessage(this._userId, '_userId'));
        }

        next();
    }).catch((err) => {
        next(err);
    });
});

module.exports = mongoose.model('Receipt', ReceiptSchema);