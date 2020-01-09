const express       = require('express');
const router        = express.Router();
const Franchise     = require('../../models/franchise/franchise');
const authorizer    = require('../../tools/authorizer');
const promiseHelper = require('../../tools/promiseHelper');
const logger        = require('../../tools/logger');

router.route('/')
    // Gets all franchises
    .get((req, res) => {
        authorizer.authenticateRequest(req).then((user) => {
            return Franchise.find();
        }).then((franchises) => {
            res.send({ franchises: franchises });
        }).catch((err) => {
            if (!promiseHelper.hasLeftChain()) {
                res.status(400).send(err.toString());
            }
        });
    })
    // Creates a franchise
    .post((req, res) => {
        var franchise;
        authorizer.authenticateRequest(req).then((user) => {
            franchise = new Franchise(req.body.franchise);

            return franchise.save();
        }).then(() => {
            res.send({ franchise: franchise });
        }).catch((err) => {
            if (!promiseHelper.hasLeftChain()) {
                res.status(400).send(err.toString());
            }
        });
    });

router.route('/:_id')
    // Get a single franchise
    .get((req, res) => {
        authorizer.authenticateRequest(req).then((user) => {
            return Franchise.findById(req.params._id);
        }).then((franchise) => {
            if (!franchise) {
                throw new Error(logger.valueNotExistMessage(req.params._id));
            }

            res.send({ franchise: franchise });
        }).catch((err) => {
            if (!promiseHelper.hasLeftChain()) {
                res.status(400).send(err.toString());
            }
        });
    });

module.exports = router;