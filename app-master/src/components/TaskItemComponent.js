import React, {useEffect, useState} from 'react';
import {Text, StyleSheet} from 'react-native';
import MediaComponent from './MediaComponent';
import TimerComponent from './TimerComponent';

const TaskItemComponent = ({task, onCompleted}) => {
  const [startTime, setStartTime] = useState(new Date());

  useEffect(() => {
    setStartTime(new Date());
  }, [task]);

  return (
    <>
      <MediaComponent media_type={task.media_type} media={task.media} />
      <Text style={styles.short_text}>{task.short_text}</Text>
      {task.duration && (
        <TimerComponent
          start_time={startTime}
          duration={task.duration}
          onFinish={onCompleted}
          reversed={task.progressbar_direction}
        />
      )}
      <Text style={styles.long_text}>{task.long_text}</Text>
    </>
  );
};

const styles = StyleSheet.create({
  short_text: {
    fontSize: 25,
    textAlign: 'center',
  },
  long_text: {
    fontSize: 18,
    textAlign: 'center',
  },
  icon: {
    width: 200,
    height: 200,
  },
});

export default TaskItemComponent;
