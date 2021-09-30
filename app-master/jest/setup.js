jest.useFakeTimers();

jest.mock('react-native-push-notification', () => {
  return {
    configure: jest.fn(),
    addEventListener: jest.fn(),
    requestPermissions: jest.fn(() => Promise.resolve()),
    getInitialNotification: jest.fn(() => Promise.resolve()),
    createChannel: jest.fn(() => Promise.resolve()),
  };
});

jest.mock('react-native-encrypted-storage', () => {
  return {
    getItem: jest.fn(() => Promise.resolve()),
    removeItem: jest.fn(() => Promise.resolve()),
    setItem: jest.fn(() => Promise.resolve()),
  };
});

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
jest.mock('react-native-device-info', () => {});
jest.mock('react-native-sound', () => 'Sound');
