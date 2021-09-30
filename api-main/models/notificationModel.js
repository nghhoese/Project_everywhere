const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    vibrate: {
        type: Boolean,
        required: true,
        default: false
    },
    audio: {
        type: Boolean,
        required: true,
        default: false
    },
    visual: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = {NotificationSchema};