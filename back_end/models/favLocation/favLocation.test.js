const FavLocation = require('../favLocation/favLocation');
const Franchise = require('../franchise/franchise');
const Location = require('../location/location');
const User = require('../user/user');

var favLocation;
var franchise;
var location;
var user;

var invalidId = '123456789012345678901234';

describe("Saving", () => {
    beforeEach((done) => {
        FavLocation.deleteMany().then(() => {
            return Franchise.deleteMany();
        }).then(() => {
            return Location.deleteMany();
        }).then(() => {
            return User.deleteMany();
        }).then(() => {
            return new Franchise({
                name: 'someFranchise'
            }).save();
        }).then((f) => {
            franchise = f;

            return new User({
                email: 'someEmail',
                firstName: 'someFirstName',
                lastName: 'someLastName',
                username: 'someUsername',
                password: 'somePassword',
                salt: 'someSalt',
                changingPassword: '',
                changingEmail: '',
                authentication: ''
            }).save();
        }).then((u) => {
            user = u;

            return new Location({
                _franchiseId: franchise._id,
                address: 'someAddress',
                city: 'someCity',
                country: 'someCity'
            }).save();
        }).then((l) => {
            location = l;

            done();
        }).catch((err) => {
            done(err);
        });
    });

    it("should reject without _userId", (done) => {
        new FavLocation({
            _locationId: location._id
        }).save().then(() => {
            done('Saved without _userId');
        }).catch(() => {
            done();
        });
    });

    it("should reject with invalid _userId", (done) => {
        new FavLocation({
            _userId: invalidId,
            _locationId: location._id
        }).save().then(() => {
            done('Saved with invalid _userId');
        }).catch((err) => {
            done();
        });
    });

    it("should reject without _locationId", (done) => {
        new FavLocation({
            _userId: user._id
        }).save().then(() => {
            done('Saved without _locationId');
        }).catch(() => {
            done();
        });
    });

    it("should reject with invalid _locationId", (done) => {
        new FavLocation({
            _userId: user._id,
            _locationId: invalidId
        }).save().then(() => {
            done('Saved with invalid _locationId');
        }).catch(() => {
            done();
        });
    });

    it("should resolve with valid and unique pair of _userId and _locationId", (done) => {
        new FavLocation({
            _userId: user._id,
            _locationId: location._id
        }).save().then((fl) => {
            fl.should.have.property('_id');
            fl.should.have.property('__v');
            fl.should.have.property('_userId', user._id);
            fl.should.have.property('_locationId', location._id);
        })
    })
});