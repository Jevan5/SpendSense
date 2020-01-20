const express       		= require('express');
const mongoose      		= require('mongoose');
const app           		= express();
const bodyParser    		= require('body-parser');
const environment   		= require('./environment');
const UpdateLocationItems	= require('./jobs/updateLocationItems');
const UpdateCommonTags		= require('./jobs/updateCommonTags');

if (environment.db != 'test') {
	mongoose.connect('mongodb://localhost:27017/' + environment.db, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
}

var busboy = require('connect-busboy');
app.use(busboy());

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
const commonTags    = require('./routes/commonTags/commonTags');
const favItems		= require('./routes/favItems/favItems');
const favLocations	= require('./routes/favLocations/favLocations');
const franchises	= require('./routes/franchises/franchises');
const locations 	= require('./routes/locations/locations');
const locationItems	= require('./routes/locationItems/locationItems');
const receiptItems	= require('./routes/receiptItems/receiptItems');
const receipts		= require('./routes/receipts/receipts');
const systemItems	= require('./routes/systemItems/systemItems');
const users 		= require('./routes/users/users');
const scanRecept 	= require('./routes/scanReceipt/scanReceipt');

app.use('/authenticate', authenticate);
app.use('/commonTags', commonTags);
app.use('/favItems', favItems);
app.use('/favLocations', favLocations);
app.use('/franchises', franchises);
app.use('/locations', locations);
app.use('/locationItems', locationItems);
app.use('/receiptItems', receiptItems);
app.use('/receipts', receipts);
app.use('/systemItems', systemItems);
app.use('/users', users);
app.use('/scanReceipt', scanRecept);

// Run jobs
if (environment.db != 'test') {
	UpdateLocationItems.startJob(1000 * 60 * 60 * 24);
	UpdateCommonTags.startJob(1000 * 60 * 60 * 24);
}

app.listen(environment.port);
console.log('Listening on ' + environment.port);

module.exports = app;