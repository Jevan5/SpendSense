const mongoose          = require('mongoose');
const Schema            = mongoose.Schema;
const logger            = require('../tools/logger');
const uniqueValidator   = require('mongoose-unique-validator');

const FranchiseSchema = new Schema({
    name: {
        type: String,
        index: true,
        required: [true, logger.isRequiredMessage()],
        unique: true
    }
});

FranchiseSchema.plugin(uniqueValidator, { message: logger.alreadyExistsMessage() });

module.exports = mongoose.model('Franchise', FranchiseSchema);