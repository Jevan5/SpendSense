const Receipt       = require('../../models/receipt/receipt');
const ReceiptItem   = require('../../models/receiptItem/receiptItem');
const SystemItem    = require('../../models/systemItem/systemItem');
const Location      = require('../../models/location/location');
const Franchise     = require('../../models/franchise/franchise');
const User          = require('../../models/user/user');

var franchise;
var location;
var user;
var receiptItems;
var systemItem;
var receipts;

var invalidId = '123456789012345678901234';
var date = '2018-09-15';

describe("Saving", () => {
    beforeEach((done) => {
        Franchise.deleteMany().then(() => {
            return Location.deleteMany();
        }).then(() => {
            return Receipt.deleteMany();
        }).then(() => {
            return User.deleteMany();
        }).then(() => {
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
            
            return new Franchise({
                name: 'someFranchise'
            }).save();
        }).then((f) => {
            franchise = f;

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
        new Receipt({
            _locationId: location._id,
            date: date
        }).save().then(() => {
            done('Saved without _userId');
        }).catch((err) => {
            done();
        });
    });

    it("should reject with non-existent _userId", (done) => {
        new Receipt({
            _userId: invalidId,
            _locationId: location._id,
            date: date
        }).save().then(() => {
            done('Saved with non-existent _userId');
        }).catch((err) => {
            done();
        });
    });

    it("should reject without _locationId", (done) => {
        new Receipt({
            _userId: user._id,
            date: date
        }).save().then(() => {
            done('Saved without _locationId');
        }).catch((err) => {
            done();
        });
    });

    it("should reject with non-existent _locationId", (done) => {
        new Receipt({
            _userId: user._id,
            _locationId: invalidId,
            date: date
        }).save().then(() => {
            done('Saved with non-existent _locationId');
        }).catch((err) => {
            done();
        });
    });

    it("should reject without date", (done) => {
        new Receipt({
            _userId: user._id,
            _locationId: location._id
        }).save().then(() => {
            done('Saved without date');
        }).catch((err) => {
            done();
        });
    });

    it("should resolve with receipt with null _locationId", (done) => {
        new Receipt({
            _userId: user._id,
            _locationId: null,
            date: date
        }).save().then((r) => {
            r.should.have.property('_id');
            r.should.have.property('__v');
            r.should.have.property('_userId', user._id);
            r.should.have.property('_locationId', null);
            r.should.have.property('date');
            r.date.getTime().should.eql(new Date(date).getTime());
            done();
        }).catch((err) => {
            done(err);
        });
    });

    it("should resolve with receipt with non-null _locationId", (done) => {
        new Receipt({
            _userId: user._id,
            _locationId: location._id,
            date: date
        }).save().then((r) => {
            r.should.have.property('_id');
            r.should.have.property('__v');
            r.should.have.property('_userId', user._id);
            r.should.have.property('_locationId', location._id);
            r.should.have.property('date');
            r.date.getTime().should.eql(new Date(date).getTime());

            done();
        }).catch((err) => {
            done(err);
        });
    });

    it("should omit invalid fields", (done) => {
        new Receipt({
            _userId: user._id,
            _locationId: location._id,
            date: date,
            invalid: 'something'
        }).save().then((r) => {
            r.should.not.have.property('invalid');

            done();
        }).catch((err) => {
            done(err);
        });
    });
});

describe("Deleting", () => {
    beforeEach((done) => {
        Franchise.deleteMany().then(() => {
            return Location.deleteMany();
        }).then(() => {
            return ReceiptItem.deleteMany();
        }).then(() => {
            return Receipt.deleteMany();
        }).then(() => {
            return User.deleteMany();
        }).then(() => {
            return SystemItem.deleteMany();
        }).then(() => {
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
            
            return new Franchise({
                name: 'someFranchise'
            }).save();
        }).then((f) => {
            franchise = f;
    
            return new Location({
                _franchiseId: franchise._id,
                address: 'someAddress',
                city: 'someCity',
                country: 'someCity'
            }).save();
        }).then((l) => {
            location = l;

            return Receipt.create([
                new Receipt({
                    _userId: user._id,
                    _locationId: location._id,
                    date: date
                }),
                new Receipt({
                    _userId: user._id,
                    _locationId: location._id,
                    date: date
                })
            ]);
        }).then((r) => {
            receipts = r;
            
            return new SystemItem({
                tag: 'food',
                name: 'banana'
            }).save();
        }).then((s) => {
            systemItem = s;

            return ReceiptItem.create([
                new ReceiptItem({
                    _receiptId: receipts[0]._id,
                    _systemItemId: systemItem._id,
                    name: 'regular bananas from receipt 0',
                    price: 2,
                    amount: 5
                }),
                new ReceiptItem({
                    _receiptId: receipts[0]._id,
                    _systemItemId: systemItem._id,
                    name: 'organic bananas from receipt 0',
                    price: 3,
                    amount: 4
                }),
                new ReceiptItem({
                    _receiptId: receipts[1]._id,
                    _systemItemId: systemItem._id,
                    name: 'regular bananas from receipt 1',
                    price: 2.5,
                    amount: 4
                }),
                new ReceiptItem({
                    _receiptId: receipts[1]._id,
                    _systemItemId: systemItem._id,
                    name: 'organic bananas from receipt 1',
                    price: 3.5,
                    amount: 1
                })
            ]);
        }).then((r) => {
            receiptItems = r;

            done();
        }).catch((err) => {
            done(err);
        });
    });

    it("should delete all associated receiptItems", (done) => {
        var toDelete = receipts[0];

        toDelete.remove().then(() => {
            return ReceiptItem.find({ _id: { $in: [receiptItems[0]._id, receiptItems[1]._id] } });
        }).then((r) => {
            if (r.length > 0) {
                throw new Error('Did not delete all associated receiptItems');
            }

            done();
        }).catch((err) => {
            done(err);
        });
    });

    it("should not delete non-associated receiptItems", (done) => {
        var toDelete = receipts[0];

        toDelete.remove().then(() => {
            return ReceiptItem.find({ _id: { $in: [receiptItems[2]._id, receiptItems[3]._id] } });
        }).then((r) => {
            if (r.length < 2) {
                throw new Error("Deleted non-associated receiptItems");
            }

            done();
        }).catch((err) => {
            done(err);
        });
    });
});