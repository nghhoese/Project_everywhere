import ScheduleFactory from '../factories/ScheduleFactory';
import {TimeIsLaterThenDateTime} from '../helpers/DateHelper';
import {GetStorageItem, SetStorageItem, StorageKeys} from '../helpers/Storage';
import {ResetNotifications} from '../notification/Notification';
import axios from 'axios';
import {API_URL} from '../config/config';
import {GetLoggedInUser} from './User';

export default class Schedule {
  constructor({tasks}) {
    this.tasks = tasks || [];
  }

  getCurrentTask() {
    const tasks = this.tasks
      .filter((t) => t.isActive(new Date()))
      .sort((t, t2) => t.time < t2.time);

    if (!tasks.length) {
      return null;
    }

    const task = tasks.reduce((p, v) => {
      return p.time > v.time ? p : v;
    });

    if (task.isDone()) {
      return null;
    }

    if (task.time && TimeIsLaterThenDateTime(task.time, new Date())) {
      return null;
    }

    return task;
  }
}

export function GetCurrentSchedule() {
  return new Promise(async (resolve, reject) => {
    try {
      const schedule_data = await GetStorageItem(StorageKeys.schedule_storage);
      const schedule = await ScheduleFactory(schedule_data);
      resolve(schedule);
    } catch (error) {
      reject(error);
    }
  });
}

export async function FetchSchedule() {
  const user = await GetLoggedInUser();
  const {data} = await axios.get(`${API_URL}/day_items/needy_user/${user.id}`);
  HandleNewSchedule(data);
}

export async function HandleNewSchedule(schedule_data) {
  const schedule = await ScheduleFactory(schedule_data);
  ResetNotifications(schedule);
  SetStorageItem(StorageKeys.schedule_storage, schedule_data);
  console.log('set new schedule');
}
