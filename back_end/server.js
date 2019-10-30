const express       = require('express');
const mongoose      = require('mongoose');
const app           = express();
const bodyParser    = require('body-parser');
const router        = express.Router();
const environment   = require('./environment');
const cryptoHelper 	= require('./tools/cryptoHelper');

mongoose.connect('mongodb://localhost:27017/' + environment.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Credentials", true);
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Access, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'POST, PATCH, GET, PUT, DELETE, OPTIONS');
	next();
});

// Register the routes

const authenticate	= require('./routes/authenticate/authenticate');
const favItems		= require('./routes/favItems/favItems');
const favLocations	= require('./routes/favLocations/favLocations');
const franchises	= require('./routes/franchises/franchises');
const locations 	= require('./routes/locations/locations');
const locationItems	= require('./routes/locationItems/locationItems');
const receiptItems	= require('./routes/receiptItems/receiptItems');
const receipts		= require('./routes/receipts/receipts');
const systemItems	= require('./routes/systemItems/systemItems');
const users 		= require('./routes/users/users');

app.use('/authenticate', authenticate);
app.use('/favItems', favItems);
app.use('/favLocations', favLocations);
app.use('/franchises', franchises);
app.use('/locations', locations);
app.use('/locationItems', locationItems);
app.use('/receiptItems', receiptItems);
app.use('/receipts', receipts);
app.use('/systemItems', systemItems);
app.use('/users', users);

app.listen(environment.port);
console.log('Listening on ' + environment.port);

module.exports = app;