import 'react-native-gesture-handler';
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import TaskComponent from '../components/TaskComponent';

const HomeScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TaskComponent />
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.settings}
          onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.settings_icon}>⚙</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  settings: {
    padding: 5,
    borderTopLeftRadius: 5,
    fontSize: 50,
  },
  settings_icon: {
    fontSize: 20,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default HomeScreen;
