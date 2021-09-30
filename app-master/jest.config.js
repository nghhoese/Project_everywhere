module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['./jest/setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|react-navigation|@react-navigation/.*|@react-native-community|@react-native-firebase/messaging|@react-native-firebase/app)',
  ],
  moduleNameMapper: {
    '^react-native$': 'react-native',
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/src/components/',
    '/src/context/',
    '/src/navigation/',
    '/src/helpers/Storage.js',
  ],
  modulePathIgnorePatterns: ['Schedule-test-data.js'],
};
