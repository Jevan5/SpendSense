const chai          = require('chai');
const chaiHttp      = require('chai-http');
const mongoose      = require('mongoose');
const app           = require('./server');
const environment   = require('./environment');
const User          = require('./models/user');
const cryptoHelper  = require('./tools/cryptoHelper');

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
    runTest("Users", './routes/users/users.test.js');
    runTest("Authenticate", './routes/authenticate/authenticate.test.js');
    after(function () {
        console.log("after all tests");
    });
});