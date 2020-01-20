const express           = require('express');
const router            = express.Router();
const User              = require('../../models/user/user');
const cryptoHelper      = require('../../tools/cryptoHelper');
const nodemailerHelper  = require('../../tools/nodemailerHelper');
const environment       = require('../../environment');
const authorizer        = require('../../tools/authorizer');
const promiseHelper     = require('../../tools/promiseHelper');
const logger            = require('../../tools/logger');

router.route('/')
    // Use this to login
    .get((req, res) => {
        authorizer.authenticateRequest(req).then((user) => {
            res.send({ user: user });
        }).catch((err) => {
            res.status(400).send(err.toString());
        });
    })
    // Registering a new account
    .post((req, res) => {
        try {
            var user = new User(req.body.user);
            if (user.password == null) {
                throw new Error("Missing 'password'");
            }

            if (user.password.length < cryptoHelper.getMinPasswordLength()) {
                throw new Error('Password must be at least ' + cryptoHelper.getMinPasswordLength() + ' characters long.');
            }

            if (user.email == null) {
                throw new Error("Missing 'email'");
            }

            user.salt = cryptoHelper.generateRandomString(cryptoHelper.getSecureStringLength());
            user.password = cryptoHelper.hash(user.password, user.salt);
            var authenticationPlaintext = cryptoHelper.generateRandomString(cryptoHelper.getSecureStringLength());
            user.authentication = cryptoHelper.hash(authenticationPlaintext, user.salt);
            user.changingPassword = '';
            user.changingEmail = '';
        } catch (e) {
            res.status(400).send(e.toString());
            return;
        }

        nodemailerHelper.sendMail(user.email,
            'Registration for Virtualytics',
            'Please click the following link to complete registration: http://' + environment.ip + ':' + environment.port + '/authenticate/?username=' + user.username + '&authentication=' + authenticationPlaintext)
        .then(() => {
            return user.save();
        }).then(() => {
            res.send({ user: user });
        }).catch((err) => {
            if (!promiseHelper.hasLeftChain(err)) {
                res.status(400).send(err.toString());
            }
        });
    })
    // Trying to change a password. Will only change changingPassword and authentication fields.
    .put((req, res) => {
        if (req.body.user == null) {
            res.status(400).send('user is null.');
            return;
        }

        let user;

        User.findOne({ username: req.body.user.username.toLowerCase() }).then((res) => {
            user = res;

            if (!user) {
                throw new Error(logger.valueNotExistMessage(req.body.user.username, 'username'));
            }

            if (user.authentication !== '' && user.changingPassword == '' && user.changingEmail == '') {
                throw new Error(authorizer.authenticationEnum.NOT_AUTHENTICATED);
            }

            if (req.body.user.changingPassword.length < cryptoHelper.getMinPasswordLength()) {
                throw new Error('Password must be at least ' + cryptoHelper.getMinPasswordLength() + ' characters long.');
            }

            let authenticationPlaintext = cryptoHelper.generateRandomString(cryptoHelper.getSecureStringLength());
            user.authentication = cryptoHelper.hash(authenticationPlaintext, user.salt);
            user.changingPassword = cryptoHelper.hash(req.body.user.changingPassword, user.salt);
            // Can't be changing email and password at same time
            user.changingEmail = '';

            return nodemailerHelper.sendMail(user.email,
                'Password change for Virtualytics',
                'Please click the following link to change your password: http://' + environment.ip + ':' + environment.port + '/authenticate/?username=' + user.username + '&authentication=' + authenticationPlaintext);
        }).then(() => {
            return user.save();
        }).then(() => {
            res.send({ user: user });
        }).catch((err) => {
            if (!promiseHelper.hasLeftChain(err)) {
                res.status(400).send(err.toString());
            }
        });
    });

router.route('/:_id')
    // Updating an existing account. Can update their firstName and lastName, and request to change their email
    .put((req, res) => {
        var user;
        authorizer.authenticateRequest(req).then((u) => {
            user = u;

            if (req.body.user.changingEmail == '') {    // Don't want to change emails
                if (user.changingEmail != '') { // Previously did want to change emails
                    // Cancelling the email change request
                    user.authentication = '';
                    user.changingEmail = '';
                } else {    // Previously did not want to change emails
                    // Do nothing
                }
            } else {    // Has requested to change email (either now, or previously)
                if (req.body.user.changingEmail.toLowerCase() != user.changingEmail) {  // Has just now requested to change email
                    var authenticationPlaintext = cryptoHelper.generateRandomString(cryptoHelper.getSecureStringLength());
                    user.authentication = authenticationPlaintext;
                    user.changingEmail = req.body.user.changingEmail;
                    user.authentication = cryptoHelper.hash(authenticationPlaintext, user.salt);
                    user.changingPassword = '';

                    return nodemailerHelper.sendMail(user.changingEmail,
                        'Authenticating new email for Virtualytics',
                        'Please click the following link to authenticate: http://' + environment.ip + ':' + environment.port + '/authenticate/?username=' + user.username + '&authentication=' + authenticationPlaintext);
                }
            }
        }).then(() => {
            user.firstName = req.body.user.firstName;
            user.lastName = req.body.user.lastName;
            return user.save();
        }).then(() => {
            res.send({ user: user });
        }).catch((err) => {
            if (!promiseHelper.hasLeftChain(err)) {
                res.status(400).send(err.toString());
            }
        });
    });

module.exports = router;