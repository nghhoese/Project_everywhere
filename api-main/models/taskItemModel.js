const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TaskItemSchema = new Schema({
  shortDescription: {
    type: String,
    required: true,
  },
  longDescription: {
    type: String,
    required: false,
  },
  icon: {
    type: String,
    required: false,
  },
  duration: {
    type: Number,
    required: false,
  },
  status: {
    type: String,
    required: false,
    default: "Created"
  },
  media: {
    type: String,
    required: false,
  },
  mediaType: {
    type: String,
    required: false,
    enum: ['image', 'video', 'audio', 'none'],
    default : 'none'
  },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'task' },
  progressbar: {
    type: Boolean,
    required: false,
  },
});

const TaskItemModel = mongoose.model('taskItem', TaskItemSchema);

module.exports = TaskItemModel;
