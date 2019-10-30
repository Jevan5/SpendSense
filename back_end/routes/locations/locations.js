const express           = require('express');
const router            = express.Router();
const Location          = require('../../models/location');
const Franchise         = require('../../models/franchise');
const User              = require('../../models/user');
const cryptoHelper      = require('../../tools/cryptoHelper');
const nodemailerHelper  = require('../../tools/nodemailerHelper');
const environment       = require('../../environment');
const authorizer        = require('../../tools/authorizer');
const promiseHelper     = require('../../tools/promiseHelper');
const logger            = require('../../tools/logger');

router.route('/')
    // Get all locations
    .get((req, res) => {
        authorizer.authenticateRequest(req).then((user) => {
            return Location.find();
        }).then((locations) => {
            res.send({ locations: locations });
        }).catch((err) => {
            if (!promiseHelper.hasLeftChain()) {
                res.status(400).send(err.toString());
            }
        });
    })
    // Create a new location
    .post((req, res) => {
        var location;
        authorizer.authenticateRequest(req).then((user) => {
            return Franchise.findById(req.body.location._franchiseId);
        }).then((franchise) => {
            if (!franchise) {
                throw new Error(logger.valueNotExistMessage(req.body.location._franchiseId, '_franchiseId'));
            }

            location = new Location(req.body.location);

            return location.save();
        }).then(() => {
            res.send({ location: location });
        }).catch((err) => {
            if (!promiseHelper.hasLeftChain()) {
                res.status(400).send(err.toString());
            }
        });
    });

router.route('/:_id')
    // Get a single location
    .get((req, res) => {
        authorizer.authenticateRequest(req).then((user) => {
            return Location.findById(req.params._id);
        }).then((location) => {
            if (!location) {
                throw new Error(logger.valueNotExistMessage(req.params._id));
            }

            res.send({ location: location });
        }).catch((err) => {
            if (!promiseHelper.hasLeftChain()) {
                res.status(400).send(err.toString());
            }
        });
    });

module.exports = router;