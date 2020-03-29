const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;
const Location  = require('../location/location');
const User      = require('../user/user');
const logger    = require('../../tools/logger');

const FavLocationSchema = new Schema({
    _userId: {
        type: Schema.Types.ObjectId,
        required: [true, logger.isRequiredMessage()],
        ref: 'User',
        unique: false
    }, _locationId: {
        type: Schema.Types.ObjectId,
        required: [true, logger.isRequiredMessage()],
        ref: 'Location',
        unique: false
    }
});

FavLocationSchema.index({ _userId: 1, _locationId: 1 }, { unique: true });

FavLocationSchema.pre('save', function(next) {
    User.findById(this._userId).then((user) => {
        if (!user) {
            throw new Error(logger.valueNotExistMessage(this._userId, '_userId'));
        }

        return Location.findById(this._locationId);
    }).then((location) => {
        if (!location) {
            throw new Error(logger.valueNotExistMessage(this._locationId, '_locationId'));
        }

        next();
    }).catch((err) => {
        next(err);
    });
})

module.exports = mongoose.model('FavLocation', FavLocationSchema);