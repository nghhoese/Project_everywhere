import EncryptedStorage from 'react-native-encrypted-storage';

export function SetStorageItem(key, data) {
  return new Promise(async (resolve) => {
    await EncryptedStorage.setItem(key, JSON.stringify(data));
    resolve();
  });
}

export function GetStorageItem(key) {
  return new Promise(async (resolve, reject) => {
    EncryptedStorage.getItem(key)
      .then((data) => (data ? resolve(JSON.parse(data)) : resolve()))
      .catch(resolve);
  });
}

export function RemoveStorageItem(key) {
  return new Promise(async (resolve) => {
    await EncryptedStorage.removeItem(key);
    resolve();
  });
}

export const StorageKeys = {
  user: 'user',
  user_token: 'user_token',
  schedule_storage: 'schedule_data',
  task_progress: 'task_progress',
};
