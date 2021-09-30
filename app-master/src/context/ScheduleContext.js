import React, {useState, useEffect} from 'react';
import {GetCurrentSchedule} from '../models/Schedule';
import {AppState} from 'react-native';

const ScheduleContext = React.createContext();

export function ScheduleProvider(props) {
  const [currentTask, setCurrentTask] = useState();

  useEffect(() => {
    let refresh_timeout;

    const check_new_schedule = async () => {
      let schedule = await GetCurrentSchedule();
      const cntask = await schedule.getCurrentTask();
      setCurrentTask(cntask);
    };

    const set_timeout = async () => {
      refresh_timeout = setTimeout(() => {
        check_new_schedule();
        set_timeout();
      }, (60 - new Date().getSeconds()) * 1000);
    };

    check_new_schedule();
    set_timeout();

    AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        check_new_schedule();
      }
    });

    return () => {
      clearTimeout(refresh_timeout);
    };
  }, []);

  return (
    <ScheduleContext.Provider
      value={{
        currentTask,
        finishTaskStep: async (step) => {
          currentTask.getTaskProgress().finishStep(step);
          let schedule = await GetCurrentSchedule();
          setCurrentTask(await schedule.getCurrentTask());
        },
      }}>
      {props.children}
    </ScheduleContext.Provider>
  );
}

export default ScheduleContext;
