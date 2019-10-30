const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;
const Location  = require('./location');
const User      = require('./user');
const logger    = require('../tools/logger');

const FavLocationSchema = new Schema({
    _userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        unique: false
    }, _locationId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Location',
        unique: false
    }
});

FavLocationSchema.index({ _userId: 1, _locationId: 1 }, { unique: true });

FavLocationSchema.pre('save', (favLocation) => {
    return new Promise((resolve, reject) => {
        User.findById(favLocation._userId).then((user) => {
            if (!user) {
                throw new Error(logger.valueNotExistMessage(favLocation._userId, '_userId'));
            }

            return Location.findById(favLocation._locationId);
        }).then((location) => {
            if (!location) {
                throw new Error(logger.valueNotExistMessage(favLocation._locationId, '_locationId'));
            }

            resolve();
        }).catch((err) => {
            reject(err);
        });
    });
})

module.exports = mongoose.model('FavLocation', FavLocationSchema);