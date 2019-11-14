const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;
const ReceiptItem   = require('./receiptItem');
const User          = require('./user');
const Location      = require('./location');
const logger        = require('../tools/logger');

const ReceiptSchema = new Schema({
    _userId: {
        type: Schema.Types.ObjectId,
        index: 'hashed',
        required: [true, logger.isRequiredMessage()],
        ref: 'User'
    }, _locationId: {
        type: Schema.Types.ObjectId,
        index: 'hashed',
        ref: 'Location'
    }, date: {
        type: Date,
        required: [true, logger.isRequiredMessage()]
    }
});

ReceiptSchema.pre('remove', function(next) {
    ReceiptItem.deleteMany({ _receiptId: this._id }).then(() => {
        next();
    }).catch((err) => {
        next(err);
    });
});

ReceiptSchema.pre('save', function(next) {
    User.findById(this._userId).then((user) => {
        if (!user) {
            throw new Error(logger.valueNotExistMessage(this._userId, '_userId'));
        }

        if (this._locationId === undefined) {
            throw new Error('_locationId ' + logger.isRequiredMessage());
        } else if (this._locationId === null) {
            return 'not null';
        } else {
            return Location.findById(this._locationId);
        }
    }).then((location) => {
        if (!location) {
            throw new Error(logger.valueNotExistMessage(this._locationId, '_locationId'));
        }

        next();
    }).catch((err) => {
        next(err);
    });
});

module.exports = mongoose.model('Receipt', ReceiptSchema);