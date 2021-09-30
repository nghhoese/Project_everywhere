let Task = require('../models/taskModel');
let TaskItem = require('../models/taskItemModel');
const mongoose = require("../database/database");

exports.findOne = async (id) => {
    const task = await Task
        .findById(id)
        .populate('taskItems');
    if (task == null) {
        throw new Error('404');
    }
    return task;
};

exports.create = async (taskBody, caregiverId) => {
    let newTask = new Task({
        name: taskBody.name,
        template: taskBody.template,
        caregiver: caregiverId,
        needy_user: taskBody.selectedNeedyUser,
        category: taskBody.category
    });
    return await newTask.save(newTask);
};

exports.getAll = async (filterOptions) => {
    query = {
        name: filterOptions.name ?? {$ne: null}
    };
    query.needy_user = filterOptions.selectedNeedyUserId ?? {$ne: null};
    query.template = filterOptions.template ?? {$ne: false};
    const tasks = await Task
        .find(query);
    if (tasks == null) {
        throw new Error('404');
    }
    return tasks;
};
exports.getAllTaskItems = async (taskId) => {
    const taskItems = await TaskItem
        .find({task: taskId});
    if (tasksItems == null) {
        throw new Error('404');
    }
    return taskItems;
};

exports.delete = async (id) => {
    await TaskItem.deleteMany({task: id});
    let result = await Task.deleteOne({_id: id});
    if (result == null) {
        throw new Error('404');
    }
    return result;
};
exports.edit = async (id, body) => {
    let task = await Task.findById(id);

    if (task == null) {
        throw new Error('404');
    }
    task.name = body.name ?? task.name;
    task.taskItems = body.taskItems ?? task.taskItems;
    task.template = body.template ?? task.template;
    task.icon = body.icon ?? task.icon;
    task.category = body.category ?? task.category;

    return await task.save();
};
exports.createTaskItem = async (taskId, taskItemBody) => {
    let task = await Task.findById(taskId);
    if (task == null) {
        throw new Error('404');
    }
    let newTaskItem = new TaskItem({
        shortDescription: taskItemBody.shortDescription,
        longDescription: taskItemBody.longDescription,
        task: taskId,
        duration: taskItemBody.duration <= 0 ? null : taskItemBody.duration,
        media: taskItemBody.media || "",
        mediaType: taskItemBody.mediaType,
        status: taskItemBody.status,
        icon: taskItemBody.icon,
        progressbar: taskItemBody.progressbar,
    });

    let result = await newTaskItem.save(newTaskItem);
    task.taskItems.push(result);
    let result1 = await task.save(task);
    return result;
};
exports.deleteTaskItem = async (taskItemId) => {
    let result = await TaskItem.deleteOne({_id: taskItemId});
    let task = await Task.findOne({taskItems: taskItemId});
    if (task != null) {
        const index = task.taskItems.indexOf(taskItemId);
        task.taskItems.splice(index, 1);
        await task.save();
    }
    return result;
};
exports.addSelectedTemplate = async (taskId, selectedNeedyUsers, careGiverId) => {
    let task = await this.findOne(taskId);
    if(task != null) {
        if(selectedNeedyUsers.length > 0){
            for(let i = 0; i < selectedNeedyUsers.length; i++){
                task._doc._id = mongoose.Types.ObjectId();
                for(let i = 0; i < task.taskItems.length; i++) {
                    task.taskItems[i]._doc._id = mongoose.Types.ObjectId();
                    task.taskItems[i].isNew = true
                    await task.taskItems[i].save()
                }
                task.template = false;
                task.caregiver = careGiverId
                task.needy_user = selectedNeedyUsers[i]
                task.isNew = true;
                await task.save();
            }
        }
        else {
            throw new Error('404');
        }
    }
    else {
        throw new Error('404');
    }
};