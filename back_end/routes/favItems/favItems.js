const express           = require('express');
const router            = express.Router();
const FavItem           = require('../../models/favItem');
const User              = require('../../models/user');
const cryptoHelper      = require('../../tools/cryptoHelper');
const nodemailerHelper  = require('../../tools/nodemailerHelper');
const environment       = require('../../environment');
const authorizer        = require('../../tools/authorizer');
const promiseHelper     = require('../../tools/promiseHelper');
const logger            = require('../../tools/logger');

router.route('/')
    // Get all favourite items for the authorized user
    .get((req, res) => {
        authorizer.authenticateRequest(req).then((user) => {
            return FavItem.find({ _userId: user._id });
        }).then((favItems) => {
            res.send({ favItems: favItems });
        }).catch((err) => {
            if (!promiseHelper.hasLeftChain(err)) {
                res.status(400).send(err.toString());
            }
        });
    })
    // Favourites an item for the authorized user
    .post((req, res) => {
        authorizer.authenticateRequest(req).then((user) => {
            var favItem = new FavItem(req.body.favItem);
            favItem._userId = user._id;

            return favItem.save();
        }).then(() => {
            res.send({ favItem: favItem });
        }).catch((err) => {
            if (!promiseHelper.hasLeftChain(err)) {
                res.status(400).send(err.toString());
            }
        });
    });

router.route('/:_id')
    // Gets a favourite item for the authorized user
    .get((req, res) => {
        var user;
        authorizer.authenticateRequest(req).then((u) => {
            user = u;

            return FavItem.findById(req.params._id);
        }).then((favItem) => {
            if (!favItem) {
                throw new Error(logger.valueNotExistMessage(req.params._id));
            }

            if (!authorizer.idMatches(favItem._userId, user._id)) {
                throw new Error(logger.valuesDontMatchMessage(favItem._userId, '_userId', uesr._id, 'authorized user._id'));
            }

            res.send({ favItem: favItem });
        }).catch((err) => {
            if (!promiseHelper.hasLeftChain(err)) {
                res.status(400).send(err.toString());
            }
        });
    })
    // Un-favourites a favourite item for the authorized user
    .delete((req, res) => {
        var user;
        authorizer.authenticateRequest(req).then((u) => {
            user = u;

            return FavItem.findById(req.params._id);
        }).then((favItem) => {
            if (!favItem) {
                throw new Error(logger.valueNotExistMessage(req.params._id));
            }

            if (!authorizer.idMatches(favItem._userId, user._id)) {
                throw new Error(logger.valuesDontMatchMessage(favItem._userId, '_userId', uesr._id, 'authorized user._id'));
            }

            return favItem.remove();
        }).then(() => {
            res.send({});
        }).catch((err) => {
            if (!promiseHelper.hasLeftChain(err)) {
                res.status(400).send(err.toString());
            }
        });
    });

module.exports = router;