const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;
const ReceiptItem   = require('./receiptItem');

const ReceiptSchema = new Schema({
    _userId: {
        type: Schema.Types.ObjectId,
        index: 'hashed',
        required: true,
        ref: 'User'
    }, date: {
        type: Date,
        required: true
    }
});

ReceiptSchema.pre('remove', (receipt) => {
    return ReceiptItem.deleteMany({ _receiptId: receipt._id });
});

module.exports = mongoose.model('Receipt', ReceiptSchema);