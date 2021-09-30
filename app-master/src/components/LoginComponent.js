import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View, TextInput, Button, Alert} from 'react-native';
import UserContext from '../context/UserContext';
import axios from 'axios';
import {useForm} from 'react-hook-form';
import messaging from '@react-native-firebase/messaging';
import {getDeviceName} from 'react-native-device-info';
import {API_URL} from '../config/config';

const LoginComponent = () => {
  const user_context = useContext(UserContext);
  const [deviceName, setDeviceName] = useState();
  const [deviceToken, setDeviceToken] = useState();

  const {register, handleSubmit, setValue} = useForm();

  useEffect(() => {
    register('username');
    register('password');
  }, [register]);

  useEffect(() => {
    messaging().getToken().then(setDeviceToken).catch(console.error);
    getDeviceName().then(setDeviceName).catch(console.error);
  }, []);

  const login = async ({username, password}) => {
    const device = {
      firebase_token: deviceToken,
      name: deviceName,
    };

    axios
      .post(`${API_URL}/users/login`, {
        email: username,
        password,
        from: 'app',
        device,
      })
      .then((res) => {
        user_context.setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
        Alert.alert('Inloggen is mislukt', 'Probeer het opnieuw', [
          {text: 'OK'},
        ]);
      });
  };

  if (user_context.autoLoginLoading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View>
        <TextInput
          style={styles.input}
          textContentType="username"
          onChangeText={(text) => setValue('username', text)}
          placeholder="Gebruikersnaam"
        />

        <TextInput
          style={styles.input}
          textContentType="password"
          onChangeText={(text) => setValue('password', text)}
          placeholder="Wachtwoord"
          secureTextEntry={true}
        />

        <Button
          title="Login"
          onPress={handleSubmit(login)}
          disabled={!deviceToken || !deviceName}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: 200,
  },
});

export default LoginComponent;
