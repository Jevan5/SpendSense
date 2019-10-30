const express           = require('express');
const router            = express.Router();
const LocationItem      = require('../../models/locationItem');
const User              = require('../../models/user');
const cryptoHelper      = require('../../tools/cryptoHelper');
const nodemailerHelper  = require('../../tools/nodemailerHelper');
const environment       = require('../../environment');
const authorizer        = require('../../tools/authorizer');
const promiseHelper     = require('../../tools/promiseHelper');
const logger            = require('../../tools/logger');

router.route('/')
    // Get all location items
    .get((req, res) => {
        authorizer.authenticateRequest(req).then((user) => {
            return LocationItem.find();
        }).then((locationItems) => {
            res.send({ locationItems: locationItems });
        }).catch((err) => {
            if (!promiseHelper.hasLeftChain()) {
                res.status(400).send(err.toString());
            }
        });
    });

module.exports = router;