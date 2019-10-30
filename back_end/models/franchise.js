const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const FranchiseSchema = new Schema({
    name: {
        type: String,
        index: true,
        required: true
    }
});

module.exports = mongoose.model('Franchise', FranchiseSchema);