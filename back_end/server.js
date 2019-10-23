const express       = require('express');
const mongoose      = require('mongoose');
const app           = express();
const bodyParser    = require('body-parser');
const router        = express.Router();
const environment   = require('./environment');

mongoose.connect('mongodb://localhost:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.static('public'));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Credentials", true);
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, security_id, hashPass', 'Access');
	res.setHeader('Access-Control-Allow-Methods', 'POST, PATCH, GET, PUT, DELETE, OPTIONS');
	next();
});

app.listen(environment.port);
console.log('Listening on ' + environment.port);