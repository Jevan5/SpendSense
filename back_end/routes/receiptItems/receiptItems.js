const express       = require('express');
const router        = express.Router();
const Receipt       = require('../../models/receipt/receipt');
const ReceiptItem   = require('../../models/receiptItem/receiptItem');
const SystemItem    = require('../../models/systemItem/systemItem');
const LocationItem  = require('../../models/locationItem/locationItem');
const authorizer    = require('../../tools/authorizer');
const promiseHelper = require('../../tools/promiseHelper');
const logger        = require('../../tools/logger');

router.route('/')
    // Get all receipt items for the user
    .get((req, res) => {
        authorizer.authenticateRequest(req).then((user) => {
            return Receipt.find({ _userId: user._id });
        }).then((receipts) => {
            var receiptIds = []
            receipts.forEach((receipt) => {
                receiptIds.push(receipt._id);
            });

            return ReceiptItem.find({ _receiptId: { $in: receiptIds } });
        }).then((receiptItems) => {
            res.send({ receiptItems: receiptItems });
        }).catch((err) => {
            res.status(400).send(err);
        });
    })
    // Add a receipt item to a receipt
    .post((req, res) => {
        var user;
        var receiptItem;
        authorizer.authenticateRequest(req).then((u) => {
            user = u;

            return Receipt.findById(req.body.receiptItem._receiptId);
        }).then((receipt) => {
            if (!receipt) {
                throw new Error(logger.valueNotExistMessage(req.body.receiptItem._receiptId, '_receiptId'));
            }

            if (!authorizer.idMatches(receipt._userId, user._id)) {
                throw new Error(logger.valuesDontMatchMessage(receipt._userId, 'receipt._userId', user._id, 'authenticated user._id'));
            }

            receiptItem = new ReceiptItem(req.body.receiptItem);
            return receiptItem.save();
        }).then(() => {
            res.send({ receiptItem: receiptItem });
        }).catch((err) => {
            if (!promiseHelper.hasLeftChain()) {
                res.status(400).send(err.toString());
            }
        });
    });

router.route('/:_id')
    // Getting a single receipt item
    .get((req, res) => {
        var user;
        var receiptItem;
        authorizer.authenticateRequest(req).then((u) => {
            user = u;
            return ReceiptItem.findById(req.params._id);
        }).then((r) => {
            receiptItem = r;

            if (!receiptItem) {
                throw new Error(logger.valueNotExistMessage(req.params._id));
            }

            return Receipt.findById(receiptItem._receiptId);
        }).then((receipt) => {
            if (!authorizer.idMatches(receipt._userId, user._id)) {
                throw new Error(logger.valuesDontMatchMessage(receipt._userId, "receipt's _userId", user._id, "authorized user._id"));
            }

            res.send({ receiptItem: receiptItem });
        }).catch((err) => {
            if (!promiseHelper.hasLeftChain()) {
                res.status(400).send(err.toString());
            }
        });
    })
    // Updating a receipt item
    .put((req, res) => {
        var user;
        var receiptItem;
        authorizer.authenticateRequest(req).then((u) => {
            user = u;
            return ReceiptItem.findById(req.params._id);
        }).then((r) => {
            receiptItem = r;

            if (!receiptItem) {
                throw new Error(logger.valueNotExistMessage(req.params._id));
            }

            return Receipt.findById(receiptItem._receiptId);
        }).then((receipt) => {
            if (!authorizer.idMatches(receipt._userId, user._id)) {
                throw new Error(logger.valuesDontMatchMessage(recept._userId, "receipt's _userId", user._id, "authorized user._id"));
            }

            return SystemItem.findById(receiptItem._systemItemId);
        }).then((systemItem) => {
            if (!systemItem) {
                throw new Error(logger.valueNotExistMessage(receiptItem._systemId, '_systemId'));
            }

            receiptItem.systemItemId = req.body.receiptItem.systemItemId;
            receiptItem.name = req.body.receiptItem.name;
            receiptItem.price = req.body.receiptItem.price;
            receiptItem.amount = req.body.receiptItem.amount;

            return receiptItem.save();
        }).then(() => {
            res.send({ receiptItem: receiptItem });
        }).catch((err) => {
            if (!promiseHelper.hasLeftChain()) {
                res.status(400).send(err.toString());
            }
        });
    })
    // Deleting a receipt item
    .delete((req, res) => {
        var user;
        var receiptItem;
        authorizer.authenticateRequest(req).then((u) => {
            user = u;
            return ReceiptItem.findById(req.params._id);
        }).then((r) => {
            receiptItem = r;

            if (!receiptItem) {
                throw new Error(logger.valueNotExistMessage(req.params._id));
            }

            return Receipt.findById(receiptItem._receiptId);
        }).then((receipt) => {
            if (!authorizer.idMatches(receipt._userId, user._id)) {
                throw new Error(logger.valuesDontMatchMessage(recept._userId, "receipt's _userId", user._id, "authorized user._id"));
            }

            return receiptItem.remove();
        }).then(() => {
            res.send({});
        }).catch((err) => {
            if (!promiseHelper.hasLeftChain()) {
                res.status(400).send(err.toString());
            }
        });
    });

module.exports = router;