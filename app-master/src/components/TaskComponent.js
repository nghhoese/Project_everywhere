import 'react-native-gesture-handler';
import React, {useContext, useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import TaskItemComponent from './TaskItemComponent';
import ScheduleContext from '../context/ScheduleContext';

const TaskComponent = () => {
  const {currentTask, finishTaskStep} = useContext(ScheduleContext);
  const [currentTaskItem, setCurrentTaskItem] = useState(0);

  const taskItemCompleted = () => {
    finishTaskStep(currentTaskItem + 1);
    setCurrentTaskItem(currentTaskItem + 1);
  };

  useEffect(() => {
    if (currentTask) {
      setCurrentTaskItem(currentTask.getTaskProgress().step || 0);
    }
  }, [currentTask]);

  return (
    <View style={styles.container}>
      {currentTask && currentTask.task_items[currentTaskItem] ? (
        <>
          <TaskItemComponent
            task={currentTask.task_items[currentTaskItem]}
            onCompleted={taskItemCompleted}
          />
          <TouchableOpacity onPress={taskItemCompleted} style={styles.button}>
            <Text>
              {currentTaskItem < currentTask.task_items.length - 1
                ? 'Volgende'
                : 'Sluiten'}
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.no_task}>Geen taak</Text>
      )}
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
  no_task: {
    fontSize: 25,
  },
  button: {
    marginTop: 50,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
});

export default TaskComponent;
