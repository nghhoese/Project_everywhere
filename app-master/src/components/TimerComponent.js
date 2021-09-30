import 'react-native-gesture-handler';
import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Animated, Text} from 'react-native';

const TimerComponent = ({duration, start_time, reversed, onFinish}) => {
  const [text, setText] = useState('');
  const animation = useRef(new Animated.Value(0));

  const progress = animation.current.interpolate({
    inputRange: [0, 100],
    outputRange: reversed ? ['100%', '0%'] : ['0%', '100%'],
    extrapolate: 'clamp',
  });

  const get_text = () => {
    const end_date = new Date(start_time.getTime() + duration * 1000);
    const seconds_to_go = (end_date.getTime() - new Date().getTime()) / 1000;

    if (seconds_to_go < 0) {
      if (onFinish) {
        onFinish();
      }
      return 'Klaar';
    }

    if (seconds_to_go <= 60) {
      return `${Math.round(seconds_to_go)} seconden`;
    }

    return `${Math.round(seconds_to_go / 60)} minuten`;
  };

  useEffect(() => {
    setText(get_text());
    Animated.timing(animation.current, {
      toValue: 0,
      duration: 0,
      useNativeDriver: false,
    }).start();

    Animated.timing(animation.current, {
      toValue: 100,
      duration: duration * 1000,
      useNativeDriver: false,
    }).start();

    const interval = setInterval(() => {
      setText(get_text());
    }, 500);

    return () => clearInterval(interval);
  }, [duration, start_time]);

  return (
    <View style={styles.progressBar}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {backgroundColor: '#8BED4F', width: progress},
        ]}
      />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  progressBar: {
    backgroundColor: 'white',
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 5,
    width: 200,
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    paddingVertical: 5,
  },
});

export default TimerComponent;
