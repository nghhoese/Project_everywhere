/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React, {useContext} from 'react';
import LoginComponent from '../components/LoginComponent';
import UserContext from '../context/UserContext';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import SettingsScreen from './SettingsScreen';

const Stack = createStackNavigator();

const Navigation = () => {
  const user_context = useContext(UserContext);

  return (
    <NavigationContainer>
      {!user_context.user ? (
        <LoginComponent />
      ) : (
        <Stack.Navigator headerMode="none">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default Navigation;
