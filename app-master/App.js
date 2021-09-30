/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React from 'react';
import Context from './src/context/Context';
import Navigation from './src/navigation/Navigation';

const App = () => {
  return (
    <Context>
      <Navigation />
    </Context>
  );
};

export default App;
