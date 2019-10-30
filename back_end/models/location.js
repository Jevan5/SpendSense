const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const LocationSchema = new Schema({
    _franchiseId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: 'hashed',
        ref: 'Franchise'
    }, address: {
        type: String,
        required: true
    }, city: {
        type: String,
        required: true
    }, country: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Location', LocationSchema);