const functions = require('firebase-functions');
const gcs = require('@google-cloud/storage');
const os = require('os');
const path = require('path');

const cors = require('cors')({origin: true});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//


exports.uploadFile = functions.https.onRequest((req, res) => {
    cors(req, res, (request, response) => {
        if (req.method !== 'POST') {
            return response.status(500).json({
                message: 'Not allowed'
            })
        }
        response.status(200).json({
            message: 'It worked!'
        });

    })
});


