const express       = require('express');
const router        = express.Router();
const Receipt       = require('../../models/receipt');
const ReceiptItem   = require('../../models/receiptItem');
const LocationItem  = require('../../models/locationItem');
const authorizer    = require('../../tools/authorizer');
const promiseHelper = require('../../tools/promiseHelper');
const logger        = require('../../tools/logger');

/*
User -> Login
[auth]
call POST w/ auth: {
    backend calls google API -> API returns json
    post returns JSON
}
*/