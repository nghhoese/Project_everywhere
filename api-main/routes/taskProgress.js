const express = require('express');
const router = express.Router();

const DayItemController = require('../controllers/dayItemController');
const TaskProgressController = require('../controllers/taskProgressController');
const TaskProgressModel = require('../models/taskProgress');

router.post('/update', async (req,res) => {
    const day_item = (await DayItemController.findById(req.body.day_item_id))[0];

    if (!day_item) {
        res.status(400).json('day item not found');
        return;
    }
    
    let task_progress = await TaskProgressController.getTaskProgress(day_item, new Date(req.body.start_time));

    if (task_progress){
        task_progress.done_time = req.body.done_time;
        task_progress.task_step = req.body.step;
        await task_progress.save();
    } else {
        task_progress = new TaskProgressModel({
            start_time: req.body.start_time,
            done_time: req.body.done_time,
            task_step: req.body.step,
        });

        await task_progress.save();
        day_item.task_progress.push(task_progress);
        await day_item.save();
    }

    res.send('done')
})

module.exports = router;
