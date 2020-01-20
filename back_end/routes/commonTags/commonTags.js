const express           = require('express');
const router            = express.Router();
const CommonTag         = require('../../models/commonTag/commonTag');
const authorizer        = require('../../tools/authorizer');
const promiseHelper     = require('../../tools/promiseHelper');
const logger            = require('../../tools/logger');

router.route('/')
    // Get all common tags
    .get((req, res) => {
        authorizer.authenticateRequest(req).then((user) => {
            return CommonTag.find();
        }).then((commonTags) => {
            res.send({ commonTags: commonTags });
        }).catch((err) => {
            if (!promiseHelper.hasLeftChain()) {
                res.status(400).send(err.toString());
            }
        });
    });

module.exports = router;