export function SetTime(date, time) {
  const [hours, minutes] = time.split(':');
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);

  return date;
}

export function TimeIsLaterThenDateTime(time, date) {
  // time = 21:59
  let [hours, minutes] = time.split(':');
  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);

  if (hours > date.getHours()) {
    return true;
  }

  if (hours === date.getHours() && minutes > date.getMinutes()) {
    return true;
  }

  return false;
}

export function IsSameDate(date1, date2) {
  return date1.toDateString() === date2.toDateString();
}
