const util = require("util");
const path = require("path");
const multer = require("multer");

var storage = multer.diskStorage(
    {
    destination: (req, file, callback) => {
        callback(null, "public/uploads");
    },
    filename: (req, file, callback) => {
        if (!file.originalname.toLowerCase().match(/\.(png|jpg|jpeg)$/)) {
            var message = `${file.originalname} is invalid. Only accept png, jpg and jpeg`;
            return callback(message, null);
        }
        var filename = `${Date.now()}-sok-${file.originalname}`;
        callback(null, filename);
    }
});

var uploadIcon = multer({ storage: storage }).single('taskIcon');
var uploadIconMiddleware = util.promisify(uploadIcon);

module.exports = uploadIconMiddleware