const mime = require('mime');
var fs = require('fs');
const util = require("util");
const path = require("path");
const upload = require("../routes/middleware/uploadIcon");

const singleUpload = async (req, res, next) => {
    try {
        await upload(req, res, next);
        if (req.files == null) {
            console.log(`No files to upload`);
        }
        next();
    } catch (error) {
        console.log(req);
        return res.send(`Error when trying upload a file: ${error}`);
    }
};

module.exports = {
    singleUpload: singleUpload
};
