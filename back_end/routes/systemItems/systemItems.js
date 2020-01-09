const express           = require('express');
const router            = express.Router();
const Receipt           = require('../../models/receipt/receipt');
const SystemItem        = require('../../models/systemItem/systemItem');
const cryptoHelper      = require('../../tools/cryptoHelper');
const nodemailerHelper  = require('../../tools/nodemailerHelper');
const environment       = require('../../environment');
const authorizer        = require('../../tools/authorizer');
const promiseHelper     = require('../../tools/promiseHelper');
const logger            = require('../../tools/logger');

router.route('/')
    // Get all system items
    .get((req, res) => {
        authorizer.authenticateRequest(req).then((user) => {
            return SystemItem.find();
        }).then((systemItems) => {
            res.send({ systemItems: systemItems });
        }).catch((err) => {
            if (!promiseHelper.hasLeftChain()) {
                res.status(400).send(err.toString());
            }
        });
    })
    // Create a new system item
    .post((req, res) => {
        var systemItem;
        authorizer.authenticateRequest(req).then((user) => {
            systemItem = new SystemItem(req.body.systemItem);

            return systemItem.save();
        }).then(() => {
            res.send({ systemItem: systemItem });
        }).catch((err) => {
            if (!promiseHelper.hasLeftChain()) {
                res.status(400).send(err.toString());
            }
        });
    });

router.route('/:_id')
    // Get a single system item
    .get((req, res) => {
        authorizer.authenticateRequest(req).then((user) => {
            return SystemItem.findById(req.params._id);
        }).then((systemItem) => {
            if (!systemItem) {
                throw new Error(logger.valueNotExistMessage(req.params._id));
            }

            res.send({ systemItem: systemItem });
        }).catch((err) => {
            if (!promiseHelper.hasLeftChain()) {
                res.status(400).send(err.toString());
            }
        });
    });

module.exports = router;