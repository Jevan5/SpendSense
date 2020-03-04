const User          = require('../user/user');
const FavItem       = require('../favItem/favItem');
const Franchise     = require('../franchise/franchise');
const Location      = require('../location/location');
const Receipt       = require('../receipt/receipt');
const ReceiptItem   = require('../receiptItem/receiptItem');
const SystemItem    = require('../systemItem/systemItem');

var user;
var favItem;
var franchise;
var location;
var receipt;
var receiptItem;
var systemItem;

describe("Saving", () => {
    beforeEach((done) => {
        User.deleteMany().then(() => {
            return FavItem.deleteMany();
        }).then(() => {
            return Franchise.deleteMany();
        }).then(() => {
            return Location.deleteMany();
        }).then(() => {
            return Receipt.deleteMany();
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
        }).then((si) => {
            systemItem = si;

            return new Receipt({
                _userId: user._id,
                _locationId: location._id,
                date: date
            }).save();
        }).then((r) => {
            receipt = r;

            return new ReceiptItem({
                _receiptId: invalidId,
                _systemItemId: systemItem._id,
                name: name,
                price: price
            }).save();
        }).then((ri) => {
            receiptItem = ri;

            done();
        }).catch((err) => {
            done(err);
        });
    });

    it("should reject without _userId", )
});