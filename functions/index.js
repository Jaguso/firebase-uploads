const functions = require('firebase-functions');
const os = require('os');
const path = require('path');

const cors = require('cors')({origin: true});
const Busboy = require('busboy');
const fs = require('fs');

const gcconfig = {
    projectId: "upload-594e2",
    keyFilename: "upload-594e2-firebase-adminsdk-1nesi-85fa7963cc.json"
}

const gcs = require('@google-cloud/storage', gcconfig);


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//


exports.uploadFile = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        if (req.method !== 'POST') {
            return res.status(500).json({
                message: 'Not allowed'
            })
        }
        const busboy = new Busboy({headers: req.headers});
        let uploadData = null;

        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            const filepath = path.join(os.tmpdir(), filename);
            uploadData = {file: filepath, type: mimetype};
            file.pipe(fs.createWriteStream(filepath));
        });

        busboy.on('finish', () => {
            const bucket = gcs.bucket('upload-594e2.appspot.com');
            bucket.upload(uploadData.file, {
                uploadType: 'media',
                metadata: {
                    metadata: {
                        contentType: uploadData.type
                    }
                }
            }).then(() => {
                res.status(200).json({
                    message: 'It worked!'
                });
                return null;
            }).catch(err => {
                res.status(500).json({
                    error: err
                });
            });
        });
        busboy.end(req.rawBody);
    })
});


