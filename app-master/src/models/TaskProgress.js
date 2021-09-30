import axios from 'axios';
import {API_URL} from '../config/config';
import {
  GetStorageItem,
  SetStorageItem,
  StorageKeys,
  RemoveStorageItem,
} from '../helpers/Storage';
// RemoveStorageItem(StorageKeys.task_progress);

export default class TaskProgress {
  constructor({start_time, done_time, step, done, task}) {
    this.start_time = start_time || new Date();
    this.done_time = done_time;
    this.step = step || 0;
    this.done = done || false;
    this.task = task;
  }

  finishStep(step) {
    this.step = step;
    this.done = step === this.task.task_items.length;
    if (this.done) {
      this.done_time = new Date();
    }
    this.save();
  }

  save() {
    return Promise.all([this.saveApi(), this.saveLocal()]);
  }

  saveApi() {
    return axios.post(`${API_URL}/taskprogress/update`, {
      step: this.step,
      start_time: this.start_time,
      done_time: this.done_time,
      done: this.done,
      day_item_id: this.task.id,
    });
  }

  saveLocal() {
    return new Promise(async (resolve, reject) => {
      GetStorageItem(StorageKeys.task_progress)
        .then(async (task_progress = {}) => {
          if (!task_progress[this.task.id]) {
            task_progress[this.task.id] = [];
          }

          const tp = task_progress[this.task.id].find(
            (t) =>
              new Date(t.start_time).toDateString() ===
              this.start_time.toDateString(),
          );

          if (tp) {
            tp.done = this.done;
            tp.step = this.step;
            tp.start_time = this.start_time;
            tp.done_time = this.done_time;
          } else {
            task_progress[this.task.id].push({
              done: this.done,
              step: this.step,
              start_time: new Date(this.start_time),
              done_time: new Date(this.done_time),
            });
          }

          await SetStorageItem(StorageKeys.task_progress, task_progress);
          resolve();
        })
        .catch(reject);
    });
  }
}

export function GetTaskProgress(task) {
  return new Promise(async (resolve, reject) => {
    GetStorageItem(StorageKeys.task_progress)
      .then((task_progress) => {
        if (!task_progress[task.id]) {
          resolve([]);
        }

        const progress = task_progress[task.id].map(
          (tp) =>
            new TaskProgress({
              ...tp,
              task: task,
              start_time: tp.start_time && new Date(tp.start_time),
              done_time: tp.done_time && new Date(tp.done_time),
            }),
        );
        resolve(progress);
      })
      .catch(() => resolve([]));
  });
}
