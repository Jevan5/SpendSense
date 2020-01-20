const Franchise = require('../franchise/franchise');
const Location  = require('../location/location');

var franchise;
var franchiseData;

describe("Saving", () => {
    beforeEach((done) => {
        franchiseData = {
            name: 'Walmart'
        };
    
        Franchise.deleteMany().then(() => {
            franchise = new Franchise(franchiseData);
    
            return franchise.save();
        }).then((f) => {
            f.should.have.property('name');
            f.name.should.eql(franchiseData.name);
            franchise = f;
            done();
        }).catch((err) => {
            done(err);
        });
    });

    it("should reject without address", (done) => {
        var location = new Location({
            city: 'somecity',
            country: 'somecity',
            _franchiseId: franchise._id
        });

        location.save().then(() => {
            done('Location without address saved.');
        }).catch((err) => {
            done();
        });
    });

    it("should reject without city", (done) => {
        var location = new Location({
            address: 'someaddress',
            country: 'somecountry',
            _franchiseId: franchise._id
        });

        location.save().then(() => {
            done('Location without city saved.');
        }).catch((err) => {
            done();
        });
    });

    it("should reject without country", (done) => {
        var location = new Location({
            address: 'someaddress',
            city: 'somecity',
            _franchiseId: franchise._id
        });

        location.save().then(() => {
            done('Location without country saved.');
        }).catch((err) => {
            done();
        });
    });

    it("should reject without _franchiseId", (done) => {
        var location = new Location({
            address: 'someaddress',
            city: 'somecity',
            country: 'somecountry'
        });

        location.save().then(() => {
            done('Location without _franchiseId saved.');
        }).catch((err) => {
            done();
        });
    });

    it("should reject with invalid _franchiseId", (done) => {
        var location = new Location({
            address: 'someaddress',
            city: 'somecity',
            country: 'somecountry',
            _franchiseId: '012345678901234567890123'
        });

        location.save().then(() => {
            done('Location with invalid _franchiseId saved.');
        }).catch((err) => {
            done();
        });
    });

    it("should resolve with saved location", (done) => {
        var address = 'someaddress';
        var city =  'somecity';
        var country = 'somecountry';

        var location = new Location({
            address: address,
            city: city,
            country: country,
            _franchiseId: franchise._id
        });

        location.save().then((f) => {
            f.should.have.property('_id');
            f.should.have.property('__v');
            f.should.have.property('address');
            f.address.should.eql(address);
            f.should.have.property('city');
            f.city.should.eql(city);
            f.should.have.property('country');
            f.country.should.eql(country);
            f.should.have.property('_franchiseId');
            f._franchiseId.should.eql(franchise._id);
            done();
        }).catch((err) => {
            done(err);
        });
    });
});