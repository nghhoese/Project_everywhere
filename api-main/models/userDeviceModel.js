const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserDeviceSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    firebase_token: {
        type: String,
        required: true,
    },
});

const UserDeviceModel = mongoose.model('user_device', UserDeviceSchema);

module.exports = UserDeviceModel;