const DayItemModel = require("../models/dayItemModel");

exports.getTaskProgress = (day_item, starttime) => {
    return new Promise(async (resolve, reject) => {
        day_item = await DayItemModel.findOne({_id: day_item._id}).populate('task_progress');
        day_item.task_progress.forEach(tp => {
            if(new Date(tp.start_time).toDateString() === starttime.toDateString()) {
                return resolve(tp);
            }
        });

        resolve();
    });
}