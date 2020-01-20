const Franchise = require('../../models/franchise/franchise');
const should    = require('chai').should();

beforeEach((done) => {
    Franchise.deleteMany().then(() => {
        done();
    }).catch((err) => {
        done(err);
    })
});

it("should reject with non-unique name", (done) => {
    var sameName = 'Walmart';

    var franchise = new Franchise();
    franchise.name = sameName;

    franchise.save().then(() => {
        franchise = new Franchise();
        franchise.name = sameName;

        franchise.save().then(() => {
            done('Non-unique franchise name saved.');
        }).catch((err) => {
            done();
        });
    }).catch((err) => {
        done('Unique franchise did not save.');
    });;
});

it("should reject without name", (done) => {
    new Franchise().save().then(() => {
        done('Empty name saved.');
    }).catch((err) => {
        done();
    });
});

it("should resolve with saved franchise", (done) => {
    var name = 'Walmart';
    new Franchise({ name: name }).save().then((u) => {
        u.should.have.property('_id');
        u.should.have.property('__v');
        u.should.have.property('name');
        u.name.should.eql(name);
        done();
    }).catch((err) => {
        done(err);
    });
});