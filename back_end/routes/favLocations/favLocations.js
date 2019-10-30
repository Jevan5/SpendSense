const express           = require('express');
const router            = express.Router();
const FavLocation       = require('../../models/favLocation');
const User              = require('../../models/user');
const cryptoHelper      = require('../../tools/cryptoHelper');
const nodemailerHelper  = require('../../tools/nodemailerHelper');
const environment       = require('../../environment');
const authorizer        = require('../../tools/authorizer');
const promiseHelper     = require('../../tools/promiseHelper');
const logger            = require('../../tools/logger');

router.route('/')
    // Get all favourite locations for the authorized user
    .get((req, res) => {
        authorizer.authenticateRequest(req).then((user) => {
            return FavLocation.find({ _userId: user._id });
        }).then((favLocations) => {
            res.send({ favLocations: favLocations });
        }).catch((err) => {
            if (!promiseHelper.hasLeftChain()) {
                res.status(400).send(err.toString());
            }
        });
    })
    // Create a favourite location for the authorized user
    .post((req, res) => {
        var favLocation;
        authorizer.authenticateRequest(req).then((user) => {
            favLocation = new FavLocation();
            favLocation._userId = user._id;
            favLocation._locationId = req.body.favLocation._locationId;

            return favLocation.save();
        }).then(() => {
            res.send({ favLocation: favLocation });
        }).catch((err) => {
            if (!promiseHelper.hasLeftChain(err)) {
                res.status(400).send(err.toString());
            }
        });
    });

router.route('/:_id')
    // Get a single favourite location for the authorized user
    .get((req, res) => {
        var user;
        authorizer.authenticateRequest(req).then((u) => {
            user = u;
            return FavLocation.findById(req.params._id);
        }).then((favLocation) => {
            if (!favLocation) {
                throw new Error(logger.valueNotExistMessage(req.params._id));
            }

            if (!authorizer.idMatches(favLocation._userId, user._id)) {
                throw new Error(logger.valuesDontMatchMessage(favLocation._userId, '_userId', user._id, "authorized user._id"))
            }

            res.send({ favLocation: favLocation });
        }).catch((err) => {
            if (!promiseHelper.hasLeftChain(err)) {
                res.status(400).send(err.toString());
            } 
        });
    })
    // Deletes a single favourite location for the authorized user
    .delete((req, res) => {
        var user;
        authorizer.authenticateRequest(req).then((u) => {
            user = u;
            return FavLocation.findById(req.params._id);
        }).then((favLocation) => {
            if (!favLocation) {
                throw new Error(logger.valueNotExistMessage(req.params._id));
            }

            if (!authorizer.idMatches(favLocation._userId, user._id)) {
                throw new Error(logger.valuesDontMatchMessage(favLocation._userId, '_userId', user._id, "authorized user._id"))
            }

            return favLocation.remove();
        }).then(() => {
            res.send({});
        }).catch((err) => {
            if (!promiseHelper.hasLeftChain(err)) {
                res.status(400).send(err.toString());
            } 
        });
    })

module.exports = router;