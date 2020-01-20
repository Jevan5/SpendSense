const express = require('express');
const router = express.Router();
const authorizer = require('../../tools/authorizer');
const promiseHelper = require('../../tools/promiseHelper');
const logger = require('../../tools/logger');

var fs = require('file-system');

// vision api
//const vision = require('@google-cloud/vision');


/*
User -> Login
[auth]
call POST w/ auth: {
    backend calls google API -> API returns json
    post returns JSON
}
*/
async function quickstart(filename) {
    // Imports the Google Cloud client library
    const vision = require('@google-cloud/vision');

    // Creates a client
    const client = new vision.ImageAnnotatorClient();

    // Performs label detection on the image file
    const [result] = await client.textDetection(filename);
    const detections = result.textAnnotations;
    //console.log('Text:');
    //detections.forEach(text => console.log(text));

    return detections;
}

router.route('/')
    .get((req, res) => {
        res.status(400).send(`GET not supported for endpoint: scanReceipt.`);
    })
    .post((req, res) => {

        if (req.busboy) {
            try {
                req.pipe(req.busboy); // Pipe it trough busboy

            } catch (err) {
                console.log(err);
                res.status(400).send(`Invalid post request; body must contain a valid image file.`);
                return;
            }

            var fileName = '';
            req.busboy.on('file', (fieldname, file, filename) => {
                console.log(`Scan of '${filename}' started`);
                dir = `./logs/scans/`
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }

                fileName = `${dir}${filename}`;
                file.pipe(fs.createWriteStream(fileName))


                // const visClient = new vision.ImageAnnotatorClient();

                // const [result] = visClient.textDetection(`./${filename}`);
                // const detections = result.textAnnotations;
                // console.log('Text:');

                // detections.forEach(text => console.log(text));

                //res.status(200).send(file);
                //console.log(`File: ${file}.`)
            });
            req.busboy.on('finish', function () {
                quickstart(fileName).then(result => {
                    console.log('done');
                    res.status(200).send(result);
                });
            });
        } else {
            console.log('Invalid post request made to scanReceipt endpoint.');
            res.status(400).send(`Invalid post request; body must contain a valid image file.`);
            return;
        }
        // console.log(err)
        // res.status(400).send(`Invalid post request; body must contain a valid image file`).
    });

module.exports = router;