import UserFactory from '../factories/UserFactory';
import {GetStorageItem, SetStorageItem, StorageKeys} from '../helpers/Storage';
import BackgroundJob from 'react-native-background-job';
import axios from 'axios';
import {API_URL} from '../config/config';

export default class User {
  constructor({firstname, lastname, phone, notifications, birthday, id}) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.phone = phone;
    this.notifications = notifications;
    this.birthday = birthday;
    this.token = null;
  }
}

export function GetLoggedInUser() {
  return new Promise(async (resolve, reject) => {
    const user_data = await GetStorageItem(StorageKeys.user);
    const user = UserFactory(user_data);
    user.token = await GetStorageItem(StorageKeys.user_token);
    resolve(user);
  });
}

export function SetUserTokenBackgroundJob() {
  const jobKey = 'user_token_job';
  const period = 240 * 60000; // minutes * ...

  const job = async () => {
    try {
      console.log('start user token job');
      const token = await GetStorageItem(StorageKeys.user_token);
      if (!token) {
        return;
      }
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      const {data} = await axios.post(`${API_URL}/users/loginByToken`);
      SetStorageItem(StorageKeys.user_token, data.token);
      console.log('done user token job');
    } catch (e) {
      console.log('error', e);
    }
  };

  job();

  BackgroundJob.register({jobKey, job});
  BackgroundJob.schedule({jobKey, period});
}
