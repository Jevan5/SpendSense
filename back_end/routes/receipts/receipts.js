const express       = require('express');
const router        = express.Router();
const Receipt       = require('../../models/receipt');
const ReceiptItem   = require('../../models/receiptItem');
const LocationItem  = require('../../models/locationItem');
const authorizer    = require('../../tools/authorizer');
const promiseHelper = require('../../tools/promiseHelper');
const logger        = require('../../tools/logger');

router.route('/')
    // Get all your receipts
    .get((req, res) => {
        authorizer.authenticateRequest(req).then((user) => {
            return Receipt.find({ _userId: user._id });
        }).then((receipts) => {
            res.send({ receipts: receipts });
        }).catch((err) => {
            if (!promiseHelper.hasLeftChain(err)) {
                res.status(400).send(err.toString());
            }
        })
    })
    // Create a new receipt
    .post((req, res) => {
        var receipt;
        authorizer.authenticateRequest(req).then((user) => {
            if (!authorizer.idMatches(req.body.receipt._userId, user._id)) {
                throw new Error(logger.valuesDontMatchMessage(req.body.receipt._userId, 'receipt._userId', user._id, "authenticated user._id"));
            }

            receipt = new Receipt(req.body.receipt);
            
            return receipt.save();
        }).then(() => {
            receipt.send({ receipt: receipt });
        }).catch((err) => {
            if (!promiseHelper.hasLeftChain(err)) {
                res.status(400).send(err.toString());
            }
        });
    });

router.route('/:_id')
    // Get a single receipt
    .get((req, res) => {
        var user;
        authorizer.authenticateRequest(req).then((u) => {
            user = u;
            return Receipt.findById(req.params._id);
        }).then((receipt) => {
            if (!receipt) {
                throw new Error(logger.valueNotExistMessage(req.params._id));
            }

            if (!authorizer.idMatches(receipt._userId, user._id)) {
                throw new Error(logger.valuesDontMatchMessage(receipt._userId, "receipt.user_id", user._id, "authenticated user._id"));
            }

            res.send({ receipt: receipt });
        }).catch((err) => {
            if (!promiseHelper.hasLeftChain()) {
                res.status(400).send(err);
            }
        });
    })
    .put((req, res) => {
        var user;
        var receipt;
        authorizer.authenticateRequest(req).then((u) => {
            user = u;
            return Receipt.findById(req.params._id);
        }).then((r) => {
            receipt = r;
            if (!receipt) {
                throw new Error(logger.valueNotExistMessage(req.params._id));
            }

            if (!authorizer.idMatches(receipt._userId, user._id)) {
                throw new Error(logger.valuesDontMatchMessage(receipt._userId, "receipt.user_id", user._id, "authenticated user._id"));
            }

            receipt.date = req.body.receipt.date;
            
            return receipt.save();
        }).then(() => {
            res.send({ receipt: receipt });
        }).catch((err) => {
            if (!promiseHelper.hasLeftChain()) {
                res.status(400).send(err.toString());
            }
        });
    })
    .delete((req, res) => {
        var user;
        var receipt;
        var receiptItems;
        authorizer.authenticateRequest(req).then((u) => {
            user = u;
            return Receipt.findById(req.params._id);
        }).then((r) => {
            receipt = r;
            if (!receipt) {
                throw new Error(logger.valueNotExistMessage(req.params._id));
            }

            if (!authorizer.idMatches(receipt._userId, user._id)) {
                throw new Error(logger.valuesDontMatchMessage(receipt._userId, "receipt.user_id", user._id, "authenticated user._id"));
            }

            return receipt.remove();
        }).then(() => {
            res.send({});
        }).catch((err) => {
            if (!promiseHelper.hasLeftChain()) {
                res.status(400).send(err.toString());
            }
        });
    });

module.exports = router;