const chai          = require('chai');
const app           = require('../../server');
const User          = require('../../models/user/user');
const cryptoHelper  = require('../../tools/cryptoHelper');

var password1 = 'WesternUniversity';
var salt1 = 'some salt';

// Authorized user
var user;

// User to be posted
var userToPost;

var nonAuthenticatedUserExample;

var password2 = 'Another password';
var salt2 = 'Another salt';
var authentication = 'some authentication string';

beforeEach((done) => {
    user = {
        firstName: 'Joshua',
        lastName: 'Evans',
        email: 'virtualytics20@gmail.com',
        username: 'jevans',
        password: cryptoHelper.hash(password1, salt1),
        salt: salt1,
        authentication: '',
        changingEmail: '',
        changingPassword: ''
    };
    
    userToPost = {
        firstName: 'Michael',
        lastName: 'Scott',
        email: 'Virtualytics21@gmail.com',
        username: 'Mscott',
        password: password2
    };

    nonAuthenticatedUserExample = {
        firstName: 'Jim',
        lastName: 'Gordon',
        email: 'Virtualytics21@gmail.com',
        username: 'Mscott',
        password: password2,
        salt: salt2,
        authentication: cryptoHelper.hash(authentication, salt2),
        changingEmail: '',
        changingPassword: ''
    };

    User.deleteMany().then(() => {
        return new User(user).save();
    }).then((u) => {
        user._id = u._id.toString();
        user.__v = u.__v;
        done();
    }).catch((err) => {
        console.log('\n\n' + err.toString() + '\n\n');
    });
});

describe("GET /", () => {
    it("should reject with no 'Authorization' header", (done) => {
        chai.request(app)
        .get('/users')
        .end((err, res) => {
            res.should.have.status(400);
            done();
        });
    });
    it("should reject with non-existant username in 'Authorization' header", (done) => {
        chai.request(app)
        .get('/users')
        .set('Authorization', 'invalid username,password')
        .end((err, res) => {
            res.should.have.status(400);
            done();
        });
    });
    it("should reject with existing username in 'Authorization' header, but wrong password", (done) => {
        chai.request(app)
        .get('/users')
        .set('Authorization', user.username + ',wrongPassword')
        .end((err, res) => {
            res.should.have.status(400);
            done();
        });
    });
    it("should reject with correct username and password in 'Authorization' header for non-authenticated user", (done) => {
        new User(nonAuthenticatedUserExample).save().then(() => {
            chai.request(app)
            .get('/users')
            .set('Authorization', userToPost.username + ',' + password2)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
        });
    });
    it("should respond with corresponding user with existing username and correct password in 'Authorization' header", (done) => {
        chai.request(app)
        .get('/users')
        .set('Authorization', user.username + ',' + password1)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.user.should.eql(user);
            done();
        });
    });
});

describe("PUT /", () => {
    it("should reject with non-existent username", (done) => {
        chai.request(app)
        .put('/users')
        .send({ user: userToPost })
        .end((err, res) => {
            res.should.have.status(400);
            done();
        });
    });
    it("should reject with non-authenticated user", (done) => {
        new User(nonAuthenticatedUserExample).save().then(() => {
            chai.request(app)
            .put('/users')
            .send({ user: nonAuthenticatedUserExample })
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
        });
    });
    it("should reject if password is less than " + cryptoHelper.getMinPasswordLength() + " characters", (done) => {
        user.changingPassword = cryptoHelper.generateRandomString(cryptoHelper.getMinPasswordLength() - 1);
        chai.request(app)
        .put('/users')
        .send({ user: user })
        .end((err, res) => {
            res.should.have.status(400);
            done();
        });
    });
    it("should respond with corresponding user with changingPassword and authentication changed, changingEmail cleared, and no other fields changed", (done) => {
        var newPassword = cryptoHelper.generateRandomString(cryptoHelper.getMinPasswordLength());
        User.findById(user._id).then((u) => {
            u.changingEmail = 'not empty';

            return u.save();
        }).then(() => {
            chai.request(app)
            .put('/users')
            .send({ user: {
                _id: 'should not change',
                __v: 'should not change',
                firstName: 'should not change',
                lastName: 'should not change',
                username: user.username,
                password: 'should not change',
                salt: 'should not change',
                changingPassword: newPassword
            }})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('user');
                res.body.user.should.have.property('_id');
                res.body.user._id.should.eql(user._id);
                res.body.user.should.have.property('__v');
                res.body.user.should.have.property('firstName');
                res.body.user.firstName.should.eql(user.firstName);
                res.body.user.should.have.property('lastName');
                res.body.user.lastName.should.eql(user.lastName);
                res.body.user.should.have.property('email');
                res.body.user.email.should.eql(user.email);
                res.body.user.should.have.property('changingEmail');
                res.body.user.changingEmail.should.eql('');
                res.body.user.should.have.property('changingPassword');
                res.body.user.changingPassword.should.eql(cryptoHelper.hash(newPassword, salt1));
                res.body.user.should.have.property('authentication');
                res.body.user.authentication.should.not.eql(user.authentication);
                res.body.user.should.have.property('username');
                res.body.user.username.should.eql(user.username);
                done();
            });
        });
    });
});

describe("POST /", () => {
    it("should reject with no first name", (done) => {
        userToPost.firstName = null;
        chai.request(app)
        .post('/users')
        .send({ user: userToPost })
        .end((err, res) => {
            res.should.have.status(400);
            done();
        })
    });
    it("should reject with no last name", (done) => {
        userToPost.lastName = null;
        chai.request(app)
        .post('/users')
        .send({ user: userToPost })
        .end((err, res) => {
            res.should.have.status(400);
            done();
        });
    });
    it("should reject with invalid email", (done) => {
        userToPost.email = 'invalid email';
        chai.request(app)
        .post('/users')
        .send({ user: userToPost })
        .end((err, res) => {
            res.should.have.status(400);
            done();
        });
    });
    it("should reject with non-unique email", (done) => {
        userToPost.email = user.email;
        chai.request(app)
        .post('/users')
        .send({ user: userToPost })
        .end((err, res) => {
            res.should.have.status(400);
            done();
        });
    });
    it("should reject with no username", (done) => {
        userToPost.username = null;
        chai.request(app)
        .post('/users')
        .send({ user: userToPost })
        .end((err, res) => {
            res.should.have.status(400);
            done();
        });
    });
    it("should reject with non-unique username", (done) => {
        userToPost.username = user.username;
        chai.request(app)
        .post('/users')
        .send({ user: userToPost })
        .end((err, res) => {
            res.should.have.status(400);
            done();
        });
    });
    it("should reject without password of length " + cryptoHelper.getMinPasswordLength() + " or more", (done) => {
        userToPost.password = cryptoHelper.generateRandomString(cryptoHelper.getMinPasswordLength() - 1);
        chai.request(app)
        .post('/users')
        .send({ user: userToPost })
        .end((err, res) => {
            res.should.have.status(400);
            done();
        });
    });
    it("should respond with created user", (done) => {
        chai.request(app)
        .post('/users')
        .send({ user: userToPost })
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('user');
            res.body.user.should.have.property('_id');
            res.body.user.should.have.property('__v');
            res.body.user.__v.should.eql(0);
            res.body.user.should.have.property('firstName');
            res.body.user.firstName.should.eql(userToPost.firstName);
            res.body.user.should.have.property('lastName');
            res.body.user.lastName.should.eql(userToPost.lastName);
            res.body.user.should.have.property('email');
            res.body.user.email.should.eql(userToPost.email.toLowerCase());
            res.body.user.should.have.property('username');
            res.body.user.username.should.eql(userToPost.username.toLowerCase());
            res.body.user.should.have.property('changingPassword');
            res.body.user.changingPassword.should.eql('');
            res.body.user.should.have.property('changingEmail');
            res.body.user.changingEmail.should.eql('');
            res.body.user.should.have.property('salt');
            res.body.user.salt.should.not.eql('');
            res.body.user.should.have.property('authentication');
            res.body.user.authentication.should.not.eql('');
            done();
        });
    });
});

describe("PUT /:_id", () => {
    it("should reject with no 'Authorization' header", (done) => {
        chai.request(app)
        .put('/users/' + user._id)
        .end((err, res) => {
            res.should.have.status(400);
            done();
        });
    });
    it("should reject with non-existant username in 'Authorization' header", (done) => {
        chai.request(app)
        .put('/users/' + user._id)
        .set('Authorization', 'invalid username,password')
        .end((err, res) => {
            res.should.have.status(400);
            done();
        });
    });
    it("should reject with existing username in 'Authorization' header, but wrong password", (done) => {
        chai.request(app)
        .put('/users/' + user._id)
        .set('Authorization', user.username + ',wrongPassword')
        .end((err, res) => {
            res.should.have.status(400);
            done();
        });
    });
    it("should reject with correct username and password in 'Authorization' header for non-authenticated user", (done) => {
        new User(nonAuthenticatedUserExample).save().then((u) => {
            chai.request(app)
            .put('/users/' + u._id)
            .set('Authorization', userToPost.username + ',' + password1)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
        });
    });
    it("should reject with correct username and password in 'Authorization' header, if the _id does not match the authorized user", (done) => {
        new User(nonAuthenticatedUserExample).save().then((u) => {
            chai.request(app)
            .put('/users/' + u._id)
            .set('Authorization', user.username + ',' + password1)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
        });
    });
    it("should respond with user and changed firstName, lastName, changingEmail, and authentication. No other fields are modified", (done) => {
        User.findById(user._id).then((u) => {
            u.changingPassword = 'in process of changing';

            return u.save();
        }).then(() => {
            user.firstName = 'New First Name';
            user.lastName = 'New Last Name';
            var oldEmail = user.email;
            user.email = "Shouldn't be changed";
            var oldUsername = user.username;
            user.username = "Shouldn't be changed";
            var oldPassword = user.password;
            var oldSalt = user.salt;
            user.salt = 'New salt';
            user.authentication = "New authentication";
            user.changingEmail = userToPost.email;

            chai.request(app)
            .put('/users/' + user._id)
            .set('Authorization', oldUsername + ',' + password1)
            .send({ user: user })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('user');
                res.body.user.should.have.property('_id');
                res.body.user._id.should.eql(user._id);
                res.body.user.should.have.property('__v');
                res.body.user.should.have.property('firstName');
                res.body.user.firstName.should.eql(user.firstName);
                res.body.user.should.have.property('lastName');
                res.body.user.lastName.should.eql(user.lastName);
                res.body.user.should.have.property('username');
                res.body.user.username.should.eql(oldUsername);
                res.body.user.should.have.property('password');
                res.body.user.password.should.eql(oldPassword);
                res.body.user.should.have.property('email');
                res.body.user.email.should.eql(oldEmail);
                res.body.user.should.have.property('changingPassword');
                res.body.user.changingPassword.should.eql('');
                res.body.user.should.have.property('salt');
                res.body.user.salt.should.eql(oldSalt);
                res.body.user.should.have.property('authentication');
                res.body.user.authentication.should.not.eql(user.authentication);
                res.body.user.should.have.property('changingEmail');
                res.body.user.changingEmail.should.eql(user.changingEmail.toLowerCase());
                done();
            });
        });
    });
});