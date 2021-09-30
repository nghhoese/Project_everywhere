import moment from 'moment';
import Schedule from '../models/Schedule';
import Task from '../models/Task';
import TaskItem from '../models/TaskItem';
import {GetTaskProgress} from '../models/TaskProgress';

export default function ScheduleFactory(schedule_data) {
  return new Promise(async (resolve) => {
    if (!schedule_data) {
      console.log('no schedule');
      return resolve(new Schedule({tasks: []}));
    }
    const tasks = schedule_data.map((day_item) => handleDayItem(day_item));
    await addTaskProgress(tasks);
    resolve(new Schedule({tasks}));
  });
}

function handleDayItem(day_item) {
  const task_data = day_item.task;

  return new Task({
    id: day_item._id,
    name: task_data.name,
    task_items: task_data.taskItems.map((t, key) => handleTaskItem(t, key)),
    day: day_item.day,
    time: day_item.time ?? moment(day_item.active_since).format('HH:mm'),
    active_since: moment(day_item.active_since)
      .set({second: 0, millisecond: 0})
      .toDate(),
    active_till: day_item.active_till
      ? moment(day_item.active_till).set({second: 0, millisecond: 0}).toDate()
      : null,
    removals: day_item.item_removals.map((d) => new Date(d)),
    icon: task_data.icon,
  });
}

function handleTaskItem(data, step) {
  return new TaskItem({
    short_text: data.shortDescription,
    long_text: data.longDescription,
    duration: data.duration,
    step: step,
    media: data.media,
    media_type: data.mediaType,
    progressbar_direction: !data.progressbar,
  });
}

function addTaskProgress(tasks) {
  return new Promise(async (resolve) => {
    for (let i = 0; i < tasks.length; i++) {
      const progress = await GetTaskProgress(tasks[i]);
      tasks[i].task_progress = progress;
    }

    resolve();
  });
}
