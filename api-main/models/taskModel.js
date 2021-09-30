const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  template: {
    type: Boolean,
    default: false,
  },
  taskItems:
    [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "taskItem"
    }]
  ,
  caregiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  needy_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  icon: {
    type: String,
    required: false,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category"
  },
});

const TaskModel = mongoose.model('task', TaskSchema);

module.exports = TaskModel;
