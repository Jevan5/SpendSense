const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;
const logger    = require('../tools/logger');

const SystemItemSchema = new Schema({
    tag: {
        type: String,
        required: [true, logger.isRequiredMessage()],
        unique: false
    }, name: {
        type: String,
        required: [true, logger.isRequiredMessage()],
        unique: false
    }
});

SystemItemSchema.index({ name: 1, tag: 1 }, { unique: true });

module.exports = mongoose.model('SystemItem', SystemItemSchema);