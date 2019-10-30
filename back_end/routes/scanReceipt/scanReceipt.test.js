const chai          = require('chai');
const chaiHttp      = require('chai-http');
const mongoose      = require('mongoose');
const app           = require('../../server');
const environment   = require('../../environment');
const User          = require('../../models/user');
const cryptoHelper  = require('../../tools/cryptoHelper');

chai.use(chaiHttp);
chai.should();

// TODO: this