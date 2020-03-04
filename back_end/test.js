const secrets       = require('../secrets.json');
const mongoose      = require('mongoose');
const environment   = require('./environment');
const chai          = require('chai');
const chaiHttp      = require('chai-http');

chai.use(chaiHttp);
chai.should();


/**
 * Runs a test file.
 * @param {string} name Name of the test.
 * @param {string} path Path to the test file.
 */
function runTest(name, path) {
    describe(name, () => {
        require(path);
    });
}

before((done) => {
    mongoose.connection.close().then(() => {
        return mongoose.connect('mongodb://localhost:27017/' + environment.db, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }).then(() => {
        done();
    }).catch((err) => {
        done(err);
    });
});

describe("Tests", () => {
    describe("secret.json", () => {
        it("should load secrets.json file with required fields", (done) => {
            secrets.should.have.property('emailAddress');
            secrets.should.have.property('emailPassword');
            secrets.should.have.property('visionApiToken');
            done();
        });
    });

    describe("Models", () => {
        runTest("Franchise", "./models/franchise/franchise.test.js");
        runTest("Location", "./models/location/location.test.js");
        runTest("Receipt", "./models/receipt/receipt.test.js");
        runTest("ReceiptItem", "./models/receiptItem/receiptItem.test.js");
        runTest("SystemItem", "./models/systemItem/systemItem.test.js");
    });

    describe("Routes", () => {
        runTest("/users", './routes/users/users.test.js');
        runTest("/authenticate", './routes/authenticate/authenticate.test.js');
    });
});