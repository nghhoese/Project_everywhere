/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {SetNotificationBackgroundJob} from './src/notification/Notification';
import {InitializeMessageHandler} from './src/helpers/MessageHandler';
import {SetUserTokenBackgroundJob} from './src/models/User';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler,
} from 'react-native-exception-handler';

setJSExceptionHandler((error, isFatal) => {
  console.log('An js error accurd', isFatal, error);
  console.log('error above');
}, true);

setNativeExceptionHandler((errorString) => {
  console.log('An native error accurd', errorString);
  console.log('error above');
});

InitializeMessageHandler();
SetNotificationBackgroundJob();
SetUserTokenBackgroundJob();

AppRegistry.registerComponent(appName, () => App);
