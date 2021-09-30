const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TaskProgressSchema = new Schema({
  start_time: {
    type: Date,
    required: true,
    default: Date.now,
  },
  done_time: {
    type: Date,
    required: false,
  },
  task_step: {
    type: Number,
    default: 0,
  },
});

const TaskProgressModel = mongoose.model('taskProgress', TaskProgressSchema);

module.exports = TaskProgressModel;
