import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import WeekScheduler from '../components/WeekScheduler/WeekScheduler';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});


test('renders all tasks in correct day', () => {
  const tasks = [
    { title: "test task 1", day: 0, time: "10:20", group: 0, background: "#d52525"},
    { title: "test task 2", day: 3, time: "11:30", group: 0, background: "rgb(100, 181, 246)"},
  ]

  act(() => {
    ReactDOM.render(<WeekScheduler tasks={tasks} setTasks={() => tasks}/>, container);
  });

  const days = container.querySelectorAll('.task-scheduler__down__days__day');

  const task1 = days[0].querySelector('.task-scheduler__task__title')
  const task2 = days[3].querySelector('.task-scheduler__task__title')

  expect(task1.textContent).toBe('test task 1');
  expect(task2.textContent).toBe('test task 2');
});

test('renders all days in the week', () => {
  const tasks = [
    { title: "test task 1", day: 0, time: "10:20", group: 0, background: "#d52525"},
    { title: "test task 2", day: 3, time: "11:30", group: 0, background: "rgb(100, 181, 246)"},
  ]

  act(() => {
    ReactDOM.render(<WeekScheduler tasks={tasks} setTasks={() => tasks}/>, container);
  });

  const days = container.querySelectorAll('.task-scheduler__upper__days__day');

  expect(days[0].querySelector('.task-scheduler__upper__label').textContent).toBe('Maandag');
  expect(days[1].querySelector('.task-scheduler__upper__label').textContent).toBe('Dinsdag');
  expect(days[2].querySelector('.task-scheduler__upper__label').textContent).toBe('Woensdag');
  expect(days[3].querySelector('.task-scheduler__upper__label').textContent).toBe('Donderdag');
  expect(days[4].querySelector('.task-scheduler__upper__label').textContent).toBe('Vrijdag');
  expect(days[5].querySelector('.task-scheduler__upper__label').textContent).toBe('Zaterdag');
  expect(days[6].querySelector('.task-scheduler__upper__label').textContent).toBe('Zondag');
});
