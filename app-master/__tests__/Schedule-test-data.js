import Schedule from '../src/models/Schedule';
import Task from '../src/models/Task';

export function getSchedule() {
  return new Schedule({
    tasks: [
      new Task({
        id: 'test1',
        name: 'test1',
        task_items: [],
        day: null,
        time: null,
        active_since: new Date(2021, 5, 15, 8, 0),
        active_till: new Date(2021, 5, 15, 8, 0),
        removals: [],
        task_progress: [],
      }),

      new Task({
        id: 'test2',
        name: 'test2',
        task_items: [],
        day: null,
        time: null,
        active_since: new Date(2021, 5, 15, 8, 15),
        active_till: new Date(2021, 5, 15, 8, 15),
        removals: [],
        task_progress: [],
      }),
    ],
  });
}
