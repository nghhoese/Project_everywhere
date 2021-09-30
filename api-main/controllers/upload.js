const mime = require('mime');
var fs = require('fs');
const util = require("util");
const path = require("path");
const upload = require("../routes/middleware/upload");

const multipleUpload = async (req, res, next) => {
    try {
        await upload(req, res, next);
        console.log(req);

        if (req.files == null) {
            console.log(`No files to upload`);
        }
        next();
    } catch (error) {
        console.log(error);
        if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.send("Too many files to upload.");
        }
        return res.send(`Error when trying upload many files: ${error}`);
    }
};

module.exports = {
    multipleUpload: multipleUpload
};
