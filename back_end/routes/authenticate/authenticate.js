const express           = require('express');
const router            = express.Router();
const User              = require('../../models/user');
const cryptoHelper      = require('../../tools/cryptoHelper');
const nodemailerHelper  = require('../../tools/nodemailerHelper');
const environment       = require('../../environment');
const authorizer        = require('../../tools/authorizer');
const promiseHelper     = require('../../tools/promiseHelper');
const logger            = require('../../tools/logger');

const secureLength = 50;

router.route('/')
    // Authenticating a password or email change
    .get((req, res) => {
        if (req.query.username == null) {
            res.status(400).send("'username' query missing.");
            return;
        }

        if (req.query.authentication == null) {
            res.status(400).send("'authentication' query missing.");
            return;
        }

        var message;
        User.findOne({ username: req.query.username.toLowerCase() }).then((user) => {
            if (!user) {
                throw new Error(logger.valueNotExistMessage(req.query.username, 'username'));
            }

            if (user.authentication === '') {
                res.send('User already authenticated.');
                promiseHelper.leaveChain();
            }

            if (!authorizer.checkAuthentication(req.query.authentication, user)) {
                throw new Error('Invalid authentication.');
            }

            user.authentication = '';
            if (user.changingEmail !== '') {    // Changing email
                user.email = user.changingEmail;
                user.changingEmail = '';
                message = 'Changed email.';
            } else if (user.changingPassword !== '') {  // Changing password
                user.password = user.changingPassword;
                user.changingPassword = '';
                message = 'Changed password.';
            } else {    // Registering
                message = 'Registered account.';
            }

            return user.save();
        }).then(() => {
            res.send({ message: message });
        }).catch((err) => {
            if (!promiseHelper.hasLeftChain(err)) {
                res.status(400).send(err.toString());
            }
        });
    });

module.exports = router;