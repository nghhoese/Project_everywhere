import 'react-native';
import {SetTime, TimeIsLaterThenDateTime} from '../src/helpers/DateHelper';

it('Time is later than now', () => {
  const d = new Date('2021-05-20T20:01:00.000Z');
  const d2 = new Date('2021-05-20T20:00:00.000Z');
  const time = `${d.getHours()}:${d.getMinutes()}`;
  expect(TimeIsLaterThenDateTime(time, d2)).toBe(true);
});

it('Time is later than now, with same time', () => {
  const d = new Date('2021-05-20T20:00:00.000Z');
  const d2 = new Date('2021-05-20T20:00:00.000Z');
  const time = `${d.getHours()}:${d.getMinutes()}`;
  expect(TimeIsLaterThenDateTime(time, d2)).toBe(false);
});

it('Time is later than now, with earlier time', () => {
  const d = new Date('2021-05-20T20:00:00.000Z');
  const d2 = new Date('2021-05-20T20:01:00.000Z');
  const time = `${d.getHours()}:${d.getMinutes()}`;
  expect(TimeIsLaterThenDateTime(time, d2)).toBe(false);
});

it('Time of datetime is given time', () => {
  const time = '12:30';
  const datetime = SetTime(new Date(), time);
  expect(datetime.getHours()).toBe(12);
  expect(datetime.getMinutes()).toBe(30);
});
