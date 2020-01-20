const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;
const logger    = require('../../tools/logger');

const CommonTagSchema = new Schema({
    tag: {
        type: String,
        required: [true, logger.isRequiredMessage()]
    }, name: {
        type: String,
        required: [true, logger.isRequiredMessage()],
        unique: true
    }
});

CommonTagSchema.pre('save', function(next) {
    this.tag = this.tag.toLowerCase();
    this.name = this.name.toLowerCase();

    next();
});

module.exports = mongoose.model('CommonTag', CommonTagSchema);