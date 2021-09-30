import PushNotification from 'react-native-push-notification';
import config, {notification_channels} from './NotificationConfig';
import BackgroundJob from 'react-native-background-job';
import {GetLoggedInUser} from '../models/User';
import {GetCurrentSchedule} from '../models/Schedule';
import {API_URL} from '../config/config';

PushNotification.configure(config);

export async function ResetNotifications(schedule) {
  PushNotification.cancelAllLocalNotifications();
  const user = await GetLoggedInUser();

  if (!user) {
    return;
  }

  schedule.tasks.forEach((task) => {
    const date = task.getNextActiveDate();

    if (date) {
      date.setSeconds(0);
      PushNotification.localNotificationSchedule({
        channelId: notification_channels.tasks.channelId,
        title: task.name,
        message: task.task_items[0].short_text,
        largeIconUrl: task.icon ? `${API_URL}/${task.icon}` : undefined,
        date: date,
        vibrate: user.notifications.vibrate,
        playSound: user.notifications.audio,
      });
    }
  });
}

export function SetNotificationBackgroundJob() {
  const jobKey = 'notification_job';
  const period = 600 * 60000; // minutes * ...

  const job = async () => {
    try {
      console.log('start notification background job');
      const schedule = await GetCurrentSchedule();
      ResetNotifications(schedule);
      console.log('done notification background job');
    } catch (e) {
      console.log('error', e);
    }
  };

  job();

  BackgroundJob.register({jobKey, job});
  BackgroundJob.schedule({jobKey, period});
}
