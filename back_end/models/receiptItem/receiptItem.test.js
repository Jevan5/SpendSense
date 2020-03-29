const ReceiptItem   = require('../receiptItem/receiptItem');
const Receipt       = require('../receipt/receipt');
const Location      = require('../location/location');
const Franchise     = require('../franchise/franchise');
const User          = require('../user/user');
const SystemItem    = require('../systemItem/systemItem');

var franchise;
var location;
var user;
var receipt;
var systemItem;

var invalidId = '123456789012345678901234';
var date = '2018-09-15';

var name = 'banana';
var price = 150;
var amount = 5;

describe("Saving", () => {
    beforeEach((done) => {
        Franchise.deleteMany().then(() => {
            return Location.deleteMany();
        }).then(() => {
            return Receipt.deleteMany();
        }).then(() => {
            return User.deleteMany();
        }).then(() => {
            return ReceiptItem.deleteMany();
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

            return new SystemItem({
                tag: 'food',
                name: 'banana'
            }).save();
        }).then((s) => {
            systemItem = s;

            return new Receipt({
                _userId: user._id,
                _locationId: location._id,
                date: date
            }).save();
        }).then((r) => {
            receipt = r;

            done();
        }).catch((err) => {
            done(err);
        });
    });

    it("should reject without _receiptId", (done) => {
        new ReceiptItem({
            _systemItemId: systemItem._id,
            name: name,
            price: price
        }).save().then(() => {
            done('Saved without _receiptId');
        }).catch(() => {
            done();
        });
    });

    it("should reject with invalid _receiptId", (done) => {
        new ReceiptItem({
            _receiptId: invalidId,
            _systemItemId: systemItem._id,
            name: name,
            price: price
        }).save().then(() => {
            done('Saved with invalid _receiptId');
        }).catch(() => {
            done();
        });
    });

    it("should reject without _systemItemId", (done) => {
        new ReceiptItem({
            _receiptId: receipt._id,
            name: name,
            price: price
        }).save().then(() => {
            done('Saved without _systemItemId');
        }).catch(() => {
            done();
        });
    });

    it("should reject with invalid _systemItemId", (done) => {
        new ReceiptItem({
            _receiptId: receipt._id,
            _systemItemId: invalidId,
            name: name,
            price: price
        }).save().then(() => {
            done('Saved with invalid _systemItemId');
        }).catch(() => {
            done();
        });
    });

    it("should reject without name", (done) => {
        new ReceiptItem({
            _receiptId: receipt._id,
            _systemItemId: systemItem._id,
            price: price
        }).save().then(() => {
            done('Saved without name');
        }).catch(() => {
            done();
        });
    });

    it("should reject without price", (done) => {
        new ReceiptItem({
            _receiptId: receipt._id,
            _systemItemId: systemItem._id,
            name: name
        }).save().then(() => {
            done('Saved without price');
        }).catch(() => {
            done();
        });
    });

    it("should resolve with the receiptItem without being given an amount", (done) => {
        new ReceiptItem({
            _receiptId: receipt._id,
            _systemItemId: systemItem._id,
            name: name,
            price: price
        }).save().then((ri) => {
            ri.should.have.property('_id');
            ri.should.have.property('__v');
            ri.should.have.property('_receiptId', receipt._id);
            ri.should.have.property('_systemItemId', systemItem._id);
            ri.should.have.property('name', name);
            ri.should.have.property('price', price);
            ri.should.have.property('amount', null);

            done();
        }).catch((err) => {
            done(err);
        });
    });

    it("should resolve with the receiptitem being given an amount", (done) => {
        new ReceiptItem({
            _receiptId: receipt._id,
            _systemItemId: systemItem._id,
            name: name,
            price: price,
            amount: amount
        }).save().then((ri) => {
            ri.should.have.property('_id');
            ri.should.have.property('__v');
            ri.should.have.property('_receiptId', receipt._id);
            ri.should.have.property('_systemItemId', systemItem._id);
            ri.should.have.property('name', name);
            ri.should.have.property('price', price);
            ri.should.have.property('amount', amount);

            done();
        }).catch((err) => {
            done(err);
        });
    });
});