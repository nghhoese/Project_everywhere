import {IsSameDate, SetTime} from '../helpers/DateHelper';
import TaskProgress from './TaskProgress';

export default class Task {
  constructor({
    name,
    task_items,
    day,
    time,
    active_since,
    active_till,
    removals,
    task_progress,
    id,
    icon,
  }) {
    this.id = id;
    this.name = name;
    this.task_items = task_items || [];
    this.day = day;
    this.time = time;
    this.active_since = active_since;
    this.active_till = active_till;
    this.removals = removals || [];
    this.task_progress = task_progress || [];
    this.icon = icon;
  }

  isDone() {
    return this.getTaskProgress().done;
  }

  getTaskProgress() {
    const task_progress = this.task_progress.find((tp) => {
      return tp.start_time.toDateString() === new Date().toDateString();
    });

    if (task_progress) {
      return task_progress;
    }

    const new_task_progress = new TaskProgress({
      task: this,
    });
    this.task_progress.push(new_task_progress);

    return new_task_progress;
  }

  getNextActiveDate() {
    if (!this.isRecurring()) {
      if (this.active_since >= new Date()) {
        return this.active_since;
      }

      // There will be no next date
      return null;
    }

    const resultDate = new Date();
    resultDate.setDate(
      resultDate.getDate() + ((7 + this.day - resultDate.getDay()) % 7),
    );

    if (this.time) {
      SetTime(resultDate, this.time);
    }

    // If date is same date but time has already passed
    if (resultDate < new Date()) {
      return new Date(resultDate.getTime() + 604800000);
    }

    if (!this.isActive(resultDate)) {
      return null;
    }

    return resultDate;
  }

  isRecurring() {
    if (!this.active_till) {
      return true;
    }
    return this.active_since.toISOString() !== this.active_till.toISOString();
  }

  isActive(date) {
    if (this.active_since >= date) {
      return false;
    }

    if (this.isRecurring() && this.active_till && this.active_till <= date) {
      return false;
    }

    if (this.isRecurring() && date.getDay() !== this.day) {
      return false;
    } else if (!this.isRecurring() && !IsSameDate(this.active_since, date)) {
      return false;
    }

    const inRemoval = this.removals.some(
      (removal_date) => removal_date.toDateString() === date.toDateString(),
    );

    if (inRemoval) {
      return false;
    }

    return true;
  }
}
