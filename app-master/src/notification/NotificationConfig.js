import PushNotification from 'react-native-push-notification';

export default {
  onRegister: function (token) {
    // console.log('TOKEN:', token);
  },
  onNotification: function (notification) {
    // console.log('NOTIFICATION:', notification);
  },
  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function (notification) {
    // console.log('ACTION:', notification.action);
    // console.log('NOTIFICATION:', notification);
  },
  onRegistrationError: function (err) {
    console.error(err.message, err);
  },
  popInitialNotification: true,
  requestPermissions: true,
};

const notification_channels = {
  tasks: {
    channelId: 'tasks',
    channelName: 'Task channel',
  },
};

export {notification_channels};

for (const channel_key in notification_channels) {
  const channel = notification_channels[channel_key];
  PushNotification.createChannel({
    channelId: channel.channelId, // (required)
    channelName: channel.channelName, // (required)
  });
}
