import messaging from '@react-native-firebase/messaging';
import {FetchSchedule} from '../models/Schedule';

export function InitializeMessageHandler() {
  messaging().setBackgroundMessageHandler(async (msg) =>
    HandleMessage(msg, false),
  );
  messaging().onMessage(async (msg) => HandleMessage(msg, true));
}

async function HandleMessage(message, foreground) {
  const {data} = message;
  console.log('incoming message', data.key, foreground);

  switch (data.key) {
    case 'new_schedule':
      FetchSchedule();
      break;
  }
}
