const DayItemModel = require('../models/dayItemModel');
const ItemRemovalModel = require('../models/itemRemovalModel');
const UserModel = require('../models/userModel');
const DeviceController = require('./deviceController');
const ObjectsToCsv = require('objects-to-csv');
const crypto = require('crypto');
const fs = require('fs');

exports.create = (dayItem, taskId, needyUserId) => {
    const promise = DayItemModel.create({
        day: dayItem.day,
        time: dayItem.time,
        active_since: dayItem.active_since,
        active_till: dayItem.active_till,
        task: taskId,
    });

    promise.then(dayItem => {
        console.log(dayItem)
        UserModel.updateOne({ _id: needyUserId }, { $push: { dayItems: dayItem._id } })
            .then(user => {})
    })

    return promise;
}

exports.delete = (dayItemId) => {
    const promise = DayItemModel.deleteOne({ _id: dayItemId });

    return promise;
}

exports.setActiveTill = (dayItemId) => {
    const promise = DayItemModel.updateOne({ _id: dayItemId }, { active_till: new Date() });

    return promise;
}

exports.getAll = () => {
    return DayItemModel.find({})
        .populate({
            path: 'task',
            populate: {
                path: 'taskItems',
            }
        })
        .populate('item_removals')
        .populate('task_progress');
}

exports.getAllFromNeedyUser = (needyUserId) => {
    return UserModel.find({ _id: needyUserId }).select('dayItems').populate({
        path: 'dayItems',
        populate: [
            {
                path: 'task',
                populate: [{path: 'category'}, {path: 'taskItems'}]
            }, {
                path: 'item_removals'
            },
            {
                path: 'task_progress'
            }
        ]
    })
    ;
}

exports.exportHistory = async (needyUserId) => {
  let user = await UserModel.findOne({ _id: needyUserId }).populate({
      path: 'dayItems',
      populate: [
          {
              path: 'task',
              populate: [{path: 'category'}, {path: 'taskItems'}]
          }, {
              path: 'item_removals'
          },{
            path: 'task_progress'
          }
      ]
  });
    let progressObjectsList = [];
  user.dayItems.forEach((item, i) => {
    let progressObject = {
      taak: item.task.name,
      datum: "",
      voltooid: "Nee",
      voltooideStappen: 0,
      startTijd: "",
      eindTijd: ""
    }
    //check if dayItem is recurring or not
if(item.day == null){
  //check if non recurring dayitem has been completed
  if(item.task_progress.length < 1){
    progressObject.datum = new Date(item.active_since).toDateString();
    progressObjectsList.push(progressObject);
  }else if(item.task_progress[0].task_step == item.task.taskItems.length){
    progressObject.datum = new Date(item.active_since).toDateString();
    progressObject.voltooid = "Ja";
    progressObject.voltooideStappen = item.task_progress[0].task_step;
    progressObject.startTijd = new Date(item.task_progress[0].start_time).toLocaleTimeString();
    progressObject.eindTijd = new Date(item.task_progress[0].done_time).toLocaleTimeString();
    progressObjectsList.push(progressObject);
  }else{
    progressObject.datum = new Date(item.active_since).toDateString();
    progressObject.voltooid = "Nee";
    progressObject.voltooideStappen = item.task_progress[0].task_step;
    progressObject.startTijd = new Date(item.task_progress[0].start_time).toLocaleTimeString();
    progressObjectsList.push(progressObject);
  }
}else{
  let date = new Date(item.active_since);
  let d = new Date();
  //determine on what dates the dayitem should be executed
  while(date <= d || date <= item.active_till){
    let removed = false;
    let taskProgressFound = false;
    let taskProgress;
    item.task_progress.forEach((item2, i) => {
      if(date.toDateString() == new Date(item2.start_time).toDateString()){
        taskProgressFound = true;
        taskProgress = item2;
      }
    });
    //check if one of recurring tasks has been removed
    item.item_removals.forEach((item1, i) => {
      if(date.toDateString() == new Date(item1.date).toDateString()){
        removed = true;
      }
    });
    //if the recurring task was not removed it shouldve been completed
if(!removed){
  if(!taskProgressFound){
    progressObject.datum = new Date(item.active_since).toDateString();
    progressObjectsList.push(progressObject);
  }else if(taskProgress.task_step == item.task.taskItems.length){
    progressObject.datum = new Date(item.active_since).toDateString();
    progressObject.voltooid = "Ja";
    progressObject.voltooideStappen = taskProgress.task_step;
      progressObject.startTijd = new Date(taskProgress.start_time).toLocaleTimeString();
      progressObject.eindTijd = new Date(taskProgress.done_time).toLocaleTimeString();

    progressObjectsList.push(progressObject);
  }else{
    progressObject.datum = new Date(item.active_since).toDateString();
    progressObject.voltooideStappen = taskProgress.task_step;
      progressObject.startTijd = new Date(taskProgress.start_time).toLocaleTimeString();
      progressObjectsList.push(progressObject);
  }

}

    date.setDate(d.getDate() + 7);
  }



}



  });
  const csv = new ObjectsToCsv(progressObjectsList);
  let path = './public/uploads/' + user.email + '-TaskReport.csv'
  await csv.toDisk(path);
  let md5Hash = await getChecksum(path);
  let exportObject = {
    signature: md5Hash,
    path: path
  };

return exportObject;
}

function getChecksum(path) {
  return new Promise(function (resolve, reject) {
    const hash = crypto.createHash('md5');
    const input = fs.createReadStream(path);

    input.on('error', reject);

    input.on('data', function (chunk) {
      hash.update(chunk);
    });

    input.on('close', function () {
      resolve(hash.digest('hex'));
    });
  });
}

exports.findById = (dayItemId) => {
    return DayItemModel.find({ _id: dayItemId }).populate([
        {
            path: 'task',
            populate: 'category'
        }, {
            path: 'item_removals'
        }
    ]);
}

exports.updateAdditionDayItem = (dayItemId, date) => {
    const promise = DayItemModel.updateOne({
        _id: dayItemId
    }, { active_till: date, active_since: date });

    return promise;
}

exports.updateDayItem = async (dayItemId, day, time, needyUserId) => {
  const dayItem = await DayItemModel.find({ _id: dayItemId }).populate([
    {
      path: 'task',
      populate: 'category'
    }, {
      path: 'item_removals'
    }
  ]);
  console.log(dayItem)

  await DayItemModel.updateOne({ _id: dayItemId }, { active_till: new Date() });

  const newDayItem = await DayItemModel.create({
    day: day,
    time: time,
    active_since: dayItem[0].active_since,
    active_till: dayItem[0].active_till,
    task: dayItem[0].task,
  });

  await UserModel.updateOne({ _id: needyUserId }, { $push: { dayItems: newDayItem._id } })
}

exports.delete = (dayItemId, needyUserId) => {
    UserModel.updateOne({ _id: needyUserId }, { $pull: { dayItems: dayItemId } })
        .then(u => {}) // Dont delete this console.log, otherwise it breaks ¯\_(ツ)_/¯
    return DayItemModel.deleteOne({ _id: dayItemId });
}

exports.getActiveWeekDayItems = async (needyUserId) => {
    const users = await UserModel.find({ _id: needyUserId }).select('dayItems').populate({
        path: 'dayItems',
        populate: [
            {
                path: 'task',
                populate: 'category'
            },
            {
                path: 'item_removals'
            }
        ]
    });

    if (users.length < 1) {
        return [];
    }

    console.log(users[0].dayItems)

    return users[0].dayItems.filter(i => i.active_since?.toISOString() !== i.active_till?.toISOString() && i.active_till === null);
}

exports.createWeekDayItem = (dayItem, taskId) => {
    return DayItemModel.create({
        day: dayItem.day,
        time: dayItem.time,
        active_since: dayItem.active_since,
        active_till: dayItem.active_till,
        task: taskId,
    });
}

exports.addDayItemRemoval = async (dayItemId, date) => {
    const removal = await ItemRemovalModel.create({
        date: date
    });

    const dayItem = await DayItemModel.find({ _id: dayItemId });

    if (dayItem.length) {
        dayItem[0].item_removals.push(removal._id);

        await dayItem[0].save();
    }

    return removal;
}

exports.deleteRemovalItem = async (dayItemId, removalItemId) => {
    const dayItem = await DayItemModel.find({ _id: dayItemId });
    await ItemRemovalModel.deleteOne({ _id: removalItemId });

    if (dayItem.length) {
        dayItem[0].item_removals.pull({ _id: removalItemId });

        return dayItem[0].save();
    }
}
