import 'react-native';
import {getSchedule} from './Schedule-test-data';

it('Task to be null', () => {
  const schedule = getSchedule();

  const mockDate = new Date(2021, 5, 15, 7, 15);
  const spy = jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
  const task = schedule.getCurrentTask();

  expect(task).toBeNull();

  spy.mockRestore();
});

it('Task to be task on the exact minute ', () => {
  const schedule = getSchedule();

  const mockDate = new Date(2021, 5, 15, 8, 0);
  const spy = jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
  const task = schedule.getCurrentTask();

  expect(task.id).toBe('test1');

  spy.mockRestore();
});

it('Task to be latest task', () => {
  const schedule = getSchedule();

  const mockDate = new Date(2021, 5, 15, 9, 0);
  const spy = jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
  const task = schedule.getCurrentTask();

  expect(task.id).toBe('test2');

  spy.mockRestore();
});
