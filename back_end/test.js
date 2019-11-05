const chai          = require('chai');
const chaiHttp      = require('chai-http');
const mongoose      = require('mongoose');
const app           = require('./server');
const environment   = require('./environment');
const User          = require('./models/user');
const cryptoHelper  = require('./tools/cryptoHelper');
const secrets       = require('../secrets.json');

// chai.use(chaiHttp);
// chai.should();

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

describe("Tests", () => {
    describe("secret.json", () => {
        it("should load secrets.json file with required fields", (done) => {
            secrets.should.have.property('emailAddress');
            secrets.should.have.property('emailPassword');
            secrets.should.have.property('visionApiToken');
            done();
        });
    });
    runTest("Users", './routes/users/users.test.js');
    runTest("Authenticate", './routes/authenticate/authenticate.test.js');
    after(function () {
        console.log("after all tests");
    });
});