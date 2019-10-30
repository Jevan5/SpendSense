const chai          = require('chai');
const chaiHttp      = require('chai-http');
const mongoose      = require('mongoose');
const app           = require('../../server');
const environment   = require('../../environment');
const User          = require('../../models/user');
const cryptoHelper  = require('../../tools/cryptoHelper');

chai.use(chaiHttp);
chai.should();

// User to be registered
var toRegister;

var authentication2 = 'anotherAuthenticationCode';
var salt2 = 'another salt';

var authentication1 = 'authenticationCode';
var salt1 = 'some salt';

beforeEach((done) => {
    toRegister = {
        firstName: 'Joshua',
        lastName: 'Evans',
        email: 'virtualytics20@gmail.com',
        username: 'jevans',
        password: 'some hash',
        salt: salt1,
        authentication: cryptoHelper.hash(authentication1, salt1),
        changingEmail: '',
        changingPassword: ''
    };

    User.deleteMany().then(() => {
        return new User(toRegister).save();
    }).then((u) => {
        toRegister._id = u._id.toString();
        toRegister.__v = u.__v;
        done();
    }).catch((err) => {
        console.log('\n\n' + err.toString() + '\n\n');
    });
});

describe("GET /", () => {
    it("should fail when missing username parameter", (done) => {
        chai.request(app)
        .get('/authenticate/?authentication=' + authentication1)
        .end((err, res) => {
            res.should.have.status(400);
            done();
        });
    });
    it("should fail when missing authentication parameter", (done) => {
        chai.request(app)
        .get('/authenticate/?username=' + toRegister.username)
        .end((err, res) => {
            res.should.have.status(400);
            done();
        });
    });
    it("should fail when using non-existent username", (done) => {
        chai.request(app)
        .get('/authenticate/?username=nonExistent&authentication=' + authentication1)
        .end((err, res) => {
            res.should.have.status(400);
            done();
        });
    });
    it("should fail with wrong authentication", (done) => {
        chai.request(app)
        .get('/authenticate/?username=' + toRegister.username + '&authentication=wrongAuthentication')
        .end((err, res) => {
            res.should.have.status(400);
            done();
        });
    });
    it("should authenticate registration", (done) => {
        chai.request(app)
        .get('/authenticate/?username=' + toRegister.username + '&authentication=' + authentication1)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('message');
            res.body.message.should.eql('Registered account.');

            User.findById(toRegister._id).then((u) => {
                u.should.have.property('authentication');
                u.authentication.should.eql('');
                u.should.have.property('changingEmail');
                u.changingEmail.should.eql('');
                u.should.have.property('changingPassword');
                u.changingPassword.should.eql('');
                done();
            });
        });
    });
    it("should authenticate email change", (done) => {
        var toChangeEmail = {
            firstName: 'Michael',
            lastName: 'Scott',
            email: 'virtualytics21@gmail.com',
            username: 'mscott',
            password: 'another hash',
            salt: salt1,
            authentication: cryptoHelper.hash(authentication1, salt1),
            changingEmail: 'newemail@uwo.ca',
            changingPassword: ''
        };

        new User(toChangeEmail).save().then((u) => {
            toChangeEmail._id = u._id;
            toChangeEmail.__v = u.__v;
            
            chai.request(app)
            .get('/authenticate/?username=' + toChangeEmail.username + '&authentication=' + authentication1)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('message');
                res.body.message.should.eql('Changed email.');

                User.findById(toChangeEmail._id).then((user) => {
                    user.should.have.property('email');
                    user.email.should.eql(toChangeEmail.changingEmail);
                    user.should.have.property('authentication');
                    user.authentication.should.eql('');
                    user.should.have.property('changingEmail');
                    user.changingEmail.should.eql('');

                    done();
                });
            });
        });
    });
    it("should authenticate password change", (done) => {
        var toChangePassword = {
            firstName: 'Michael',
            lastName: 'Scott',
            email: 'virtualytics21@gmail.com',
            username: 'mscott',
            password: 'another hash',
            salt: salt2,
            authentication: cryptoHelper.hash(authentication2, salt2),
            changingEmail: '',
            changingPassword: 'some other hash'
        };

        new User(toChangePassword).save().then((u) => {
            toChangePassword._id = u._id;
            toChangePassword.__v = u.__v;
            
            chai.request(app)
            .get('/authenticate/?username=' + toChangePassword.username + '&authentication=' + authentication2)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('message');
                res.body.message.should.eql('Changed password.');

                User.findById(toChangePassword._id).then((user) => {
                    user.should.have.property('password');
                    user.password.should.eql(toChangePassword.changingPassword);
                    user.should.have.property('authentication');
                    user.authentication.should.eql('');
                    user.should.have.property('changingPassword');
                    user.changingPassword.should.eql('');

                    done();
                });
            });
        });
    });
});