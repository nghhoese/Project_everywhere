const mongoose = require('mongoose');
const { sendMessage } = require('../controllers/deviceController');

const DayItemSchema = new mongoose.Schema({
    day: {
        type: Number,
        default: null,
    },
    time: {
        type: String,
        default: null,
    },
    active_since: {
        type: Date,
        default: null,
    },
    active_till: {
        type: Date,
        default: null,
    },
    item_removals: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "itemRemoval"
        }
    ],
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "task"
    },
    task_progress: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "taskProgress"
    }]
});


DayItemSchema.post('updateOne', async function(next) {
        // cannot be done in the begin of the file because of a circulair dependency
        const UserModel = require('./userModel');

        const {devices} = await UserModel.findOne({dayItems: this.getQuery()._id}).populate('devices');
        const device_tokens = devices.map(d => d.firebase_token);
        sendMessage(device_tokens, 'new_schedule', '');
})

const DayItemModel = mongoose.model('dayItem', DayItemSchema);

module.exports = DayItemModel;
