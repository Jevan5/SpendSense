const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;
const LocationItem  = require('./locationItem');

const ReceiptItemSchema = new Schema({
    _receiptId: {
        type: Schema.Types.ObjectId,
        index: 'hashed',
        ref: 'Receipt',
        required: true
    }, _systeItemId: {
        type: Schema.Types.ObjectId,
        index: 'hashed',
        ref: 'SystemItem',
        required: true
    }, name: {
        type: String,
        required: true
    }, price: {
        type: Number,
        required: true
    }, quantity: {
        type: Number,
        required: true
    }
});

ReceiptItemSchema.pre('remove', (receiptItem) => {
    return LocationItem.deleteMany({ _receiptItemId: receiptItem._id });
});

module.exports = mongoose.model('ReceiptItem', ReceiptItemSchema);