const util = require("util");
const path = require("path");
const multer = require("multer");

var storage = multer.diskStorage(
    {
    destination: (req, file, callback) => {
        callback(null, "public/uploads");
    },
    filename: (req, file, callback) => {
        if (!file.originalname.toLowerCase().match(/\.(png|jpg|jpeg|mp4|wmv|avi|mp3|wav|m4a|flac|ogg)$/)) {
            var message = `${file.originalname} is invalid. Only accept png, jpg, jpeg, mp4, wmv, avi, mp3, wav, m4a and flac.`;
            return callback(message, null);
        }
        var filename = `${Date.now()}-sok-${file.originalname}`;
        callback(null, filename);
    }
});

var uploadFiles = multer({ storage: storage }).array("multi-files", 20);
var uploadFilesMiddleware = util.promisify(uploadFiles);

module.exports = uploadFilesMiddleware