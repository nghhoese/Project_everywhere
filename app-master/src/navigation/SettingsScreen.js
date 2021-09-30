import 'react-native-gesture-handler';
import React, {useContext} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import UserContext from '../context/UserContext';
import {FetchSchedule} from '../models/Schedule';

const SettingsScreen = () => {
  const user_context = useContext(UserContext);
  const {user} = user_context;

  return (
    <View style={styles.container}>
      <Text style={styles.name}>
        {user.firstname} {user.lastname}
      </Text>

      <View style={styles.logoutview}>
        <Button
          onPress={FetchSchedule}
          title="Haal agenda op"
          width={200}
          style={styles.logout}
        />
      </View>

      <View style={styles.logoutview}>
        <Button
          style={styles.logout}
          onPress={user_context.logOut}
          title="Uitloggen"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  name: {
    textAlign: 'center',
    fontSize: 25,
  },
  logoutview: {
    marginTop: 40,
    flexDirection: 'column',
    alignItems: 'center',
  },
});

export default SettingsScreen;
