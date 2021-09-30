import { useEffect, useState, useReducer, useContext } from 'react';
import '../../../css/taskScheduler.css';
import moment from 'moment';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@material-ui/icons/ArrowForwardIosRounded';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import RepeatIcon from '@material-ui/icons/Repeat';

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  },
}));

function TaskScheduler({ dayItems, setDayItems }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [clickedTask, setClickedTask] = useState(null);
  const [activeDate, setActiveDate] = useState(moment());
  
  const dayNames = [
    "Zondag",
    "Maandag",
    "Dinsdag",
    "Woensdag",
    "Donderdag",
    "Vrijdag",
    "Zaterdag",
  ];

  const monthNames = [
    "jan",
    "feb",
    "mrt",
    "apr",
    "mei",
    "jun",
    "jul",
    "aug",
    "sep",
    "okt",
    "nov",
    "dec"
  ]

  let startTime = 0;
  let endTime = 24;
  let currentGroup = 0;
  let currentMonth = null;

  let weekitemColor = "#d52525";
  let itemAdditionColor = "rgb(100, 181, 246)";

  let relevantTaskArray = [];

  const getDayFromTask = (task) => {
    if (isItemAddition(task)) {
      return moment(task.active_since).day();
    } else {
      return task.day;
    }
  }

  const getWeek = (date) => {
    let current = Object.assign(date.toDate());
    var week = [];
    // Starting Sunday
    current.setDate((current.getDate() - current.getDay()));
    for (var i = 0; i < 7; i++) {
      week.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return week;
  }

  let activeWeek = getWeek(activeDate);

  const isTaskInActiveWeek = (task) => {
    if (isItemAddition(task)) {
      let beginWeek = moment(activeWeek[0]).set({ "hour": 0, "minute": 0 });
      let endWeek = moment(activeWeek[activeWeek.length - 1]).set({ "hour": 23, "minute": 59 });
      return moment(task.active_since).isBetween(beginWeek, endWeek);
    } else {
      return true;
    }
  }

  const isItemAddition = (task) => {
    if (!task.active_till || !task.active_since) return false;
    return task.active_till === task.active_since;
  }

  const isTaskActiveInActiveWeek = (task) => {

    if (isItemAddition(task)) {
      let startDate = moment(activeWeek[0]).set({ "hour": 0, "minute": 0 });
      let endDate = moment(activeWeek[activeWeek.length - 1]).set({ "hour": 23, "minute": 59 });
      return moment(task.active_till).isBetween(startDate, endDate);
    } else {
      let activeSince;
      let activeTill;

      // If not set, set to max or min value
      if (task.active_since) {
        activeSince = moment(task.active_since);
      } else {
        activeSince = new Date(-8640000000000000);
      }

      if (task.active_till) {
        activeTill = moment(task.active_till)
      } else {
        activeTill = new Date(8640000000000000);
      }

      const [hour, minutes] = task.time.split(':');
      let date = moment(activeWeek[task.day])
        .set('hour', hour)
        .set('minute', minutes)
        .set('second', 0);

      return moment(date).isBetween(activeSince, activeTill);
    }
  }

  const getRelevantTaskArray = () => {
    let dayItemsArray = dayItems.filter(t => isTaskActiveInActiveWeek(t));
    let arr = dayItemsArray.filter(t => isTaskInActiveWeek(t));
    return arr;
  }

  relevantTaskArray = getRelevantTaskArray();

  const forceUpdate = useReducer(() => ({}))[1];

  const calcAmountToPushTaskDown = (task) => {

    let schedulerStartTime = null;
    let schedulerEndTime = null;
    let taskTime = null;

    if (isItemAddition(task)) {
      let startingTime = moment(task.active_since).set('hour', startTime).set('minute', 0);
      let endingTime = moment(task.active_since).set('hour', endTime).set('minute', 0);

      schedulerStartTime = moment.duration(startingTime).asHours();
      schedulerEndTime = moment.duration(endingTime).asHours();
      taskTime = moment.duration(moment(task.active_since)).asHours();
    } else {
      schedulerStartTime = moment.duration(moment.utc(startTime, "HH")).asHours();
      schedulerEndTime = moment.duration(moment.utc(endTime, "HH")).asHours();
      taskTime = moment.duration(moment.utc(task.time, "HH:mm")).asHours();
    }

    schedulerEndTime = schedulerEndTime - schedulerStartTime;
    taskTime = taskTime - schedulerStartTime;

    return (taskTime / schedulerEndTime) * 100;
  }

  const areTasksInSameDay = (task, otherTask) => getDayFromTask(task) === getDayFromTask(otherTask);

  const tasksTouchEachother = (task, otherTask) => {
    if (task === otherTask) return false;
    if (!areTasksInSameDay(task, otherTask)) return false;

    const amountPushDown = calcAmountToPushTaskDown(task);
    const amountPushDownOtherTask = calcAmountToPushTaskDown(otherTask);

    if (Math.abs(amountPushDown - amountPushDownOtherTask) < 5) return true;

    return false;
  }

  const calcTaskStyle = (task) => {
    let gap = 1;
    let tasksInSameDay = relevantTaskArray.filter(t => areTasksInSameDay(task, t));

    let sameGroup = tasksInSameDay.filter(t => t.group === task.group);
    let width = (100 - (gap * (sameGroup.length - 1))) / sameGroup.length;
    let position = 0;

    for (let i = 0; i < sameGroup.length; i++) {
      if (sameGroup[i]._id === task._id) {
        position = i;
      }
    }

    let left = (position * width) + (gap * position);

    if (task.group === 0) {
      width = 100;
      left = 0;
    }

    // let background = isItemAddition(task) ? itemAdditionColor : weekitemColor;

    return { top: calcAmountToPushTaskDown(task) + "%", width: width + "%", left: left + "%" };
  }

  const handlePopoverClick = (event, task, day) => {
    event.stopPropagation();
    if (isItemAddition(task)) {
      task.time = moment(task.active_since).format('H:mm')
    }

    task.clickedDay = day;

    setClickedTask(task);
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const groupTasks = () => {
    let dayItemsArray = [...dayItems];

    // Doest work
    dayItemsArray.sort((a, b) => new Date(b.active_since) - new Date(a.active_since))

    currentGroup = Math.max(...dayItemsArray.map(t => t.group));

    let hasChanged = false;

    for (let i = 0; i < dayItemsArray.length; i++) {

      for (let j = 0; j < dayItemsArray.length; j++) {
        if (tasksTouchEachother(dayItemsArray[i], dayItemsArray[j])) {
          if (dayItemsArray[i].group === 0) {
            hasChanged = true;
            currentGroup++;
            dayItemsArray[i].group = currentGroup;
            dayItemsArray[j].group = currentGroup;
          } else {
            if (dayItemsArray[j].group !== dayItemsArray[i].group) {
              hasChanged = true;
              dayItemsArray[j].group = dayItemsArray[i].group;
            }
          }
        }
      }

    }

    if (hasChanged) {
      setDayItems(dayItemsArray)
    }
  }

  const toNextWeek = () => {
    setActiveDate(activeDate.add(7, 'days'))
    forceUpdate();
  }

  const toPreviousWeek = () => {
    setActiveDate(activeDate.subtract(7, 'days'))
    forceUpdate();
  }

  useEffect(() => {
    activeWeek = getWeek(activeDate);
  }, [activeDate]);

  useEffect(() => {
    groupTasks();
  }, [dayItems, activeDate])

  const isCurrentDay = (day) => {
    return moment(day).isSame(new Date(), "day");
  }

  const isSameDate = (date, otherDate) => {
    let moment_date = moment(date);
    let moment_otherDate = moment(otherDate);
    return moment_date.format("YYYY-MM-DD") === moment_otherDate.format("YYYY-MM-DD")
  }

  const isInRemovedTasks = (task, date) => {
    if (!task) return false;
    for (let i = 0; i < task.item_removals.length; i++) {
      if (isSameDate(date, task.item_removals[i].date)) {
        return true;
      }
    }
    return false;
  }

  return (
    <div className="task-scheduler">
      <IconButton aria-label="left" onClick={toPreviousWeek}>
        <ArrowBackIosRoundedIcon />
      </IconButton>
      <IconButton aria-label="right" onClick={toNextWeek}>
        <ArrowForwardIosRoundedIcon />
      </IconButton>
      <div className="task-scheduler__year">{moment(getWeek(activeDate)[0]).format('YYYY')}</div>
      <div className="task-scheduler__upper">

        <div className="task-scheduler__upper__time">
          <div className="task-scheduler__upper__label">
          </div>
        </div>
        <div className="task-scheduler__upper__days">
          {
            getWeek(activeDate).map((day, i) => {
              if (day.getMonth() !== currentMonth) {
                currentMonth = day.getMonth();
                return (
                  <div className="task-scheduler__upper__days__day" key={i}>
                    <div className="task-scheduler__upper__label">
                      <div className="task-scheduler__upper__label__month">{monthNames[currentMonth]}</div>
                      <div className="task-scheduler__upper__label__day--container">
                        <div className="task-scheduler__upper__label__day">{dayNames[day.getDay()]}</div>
                        <div className={`task-scheduler__upper__label__day--number ${isCurrentDay(day) ? 'currentDay' : null}`}>{day.getDate()}</div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div className="task-scheduler__upper__days__day" key={i}>
                  <div className="task-scheduler__upper__label">
                    <div className="task-scheduler__upper__label__month"></div>
                    <div className="task-scheduler__upper__label__day--container">
                      <div className="task-scheduler__upper__label__day">{dayNames[day.getDay()]}</div>
                      <div className={`task-scheduler__upper__label__day--number ${isCurrentDay(day) ? 'currentDay' : null}`}>{day.getDate()}</div>
                    </div>
                  </div>
                </div>
              )
            }
            )
          }

        </div>
      </div>

      <div className="task-scheduler__down">
        <div className="task-scheduler__down__time">
          {
            [...Array(endTime - startTime)].map((x, i, arr) =>
              <div className="task-scheduler__down__time__timezone" key={i}>
                {
                  i !== (arr.length - 1) ?
                    <span className="task-scheduler__down__time__timezone__time">{i + startTime + 1}:00</span>
                    : null
                }
              </div>
            )
          }
        </div>
        <div className="task-scheduler__down__days">
          {
            getWeek(activeDate).map((day, dayIndex) =>
              <div className="task-scheduler__down__days__day" key={dayIndex}>
                {
                  relevantTaskArray
                    .filter(t => {
                      return getDayFromTask(t) === dayIndex
                    })
                    .map((task, i) => {
                      if (isItemAddition(task)) {
                        return (
                          <div className="task-scheduler__task" key={i} style={calcTaskStyle(task)} onClick={(e) => handlePopoverClick(e, task, activeWeek[dayIndex])} title={task.task?.name} >
                            <span className="task-scheduler__task__head">
                              <span className="task-scheduler__task__time">{moment(task.active_since).format('H:mm')}</span>
                              <span className="task-scheduler__task__catagory" style={{background: task?.task?.category?.colour }}></span>
                            </span>
                            <h5 className="task-scheduler__task__title">{task.task?.name}</h5>
                          </div>
                        )
                      } else {
                        let isRemoved = isInRemovedTasks(task, activeWeek[dayIndex]);
                        return (
                          <div className={`task-scheduler__task ${isRemoved ? 'isRemoved' : ''}`} key={i} style={calcTaskStyle(task)} onClick={(e) => handlePopoverClick(e, task, activeWeek[dayIndex])} title={task.task?.name} >
                            <span className="task-scheduler__task__head">
                              <span className="task-scheduler__task__time">{task.time}</span>
                              <span style={{display: 'flex', alignItems: 'center'}}>
                                <RepeatIcon style={{fontSize: '12px'}}/>
                                <span className="task-scheduler__task__catagory" style={{background: task?.task?.category?.colour }}></span>
                              </span>
                            </span>
                            <h5 className="task-scheduler__task__title">{task.task?.name}</h5>
                          </div>
                        )
                      }
                    })
                }
              </div>
            )
          }
        </div>
      </div>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {
          // moet nog date bij komen
          isInRemovedTasks(clickedTask, clickedTask?.clickedDay) ?
            <div className={classes.typography}>
              <Typography variant="body2">{clickedTask?.time || ""}</Typography>
              <Typography >{clickedTask?.task?.name || ""}</Typography>
            </div>
            :
            <div className={classes.typography}>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Typography variant="body2">{clickedTask?.time || ""}</Typography>
                <span className="category--color" style={{background: clickedTask?.task?.category?.colour}}>{clickedTask?.task?.category?.name}</span>
              </div>
              <Typography >{clickedTask?.task?.name || ""}</Typography>
            </div>
        }
      </Popover>

    </div>
  )
}

TaskScheduler.propTypes = {
  dayItems: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      day: PropTypes.number,
      time: PropTypes.string,
      group: PropTypes.number.isRequired,
      active_since: PropTypes.string,
      active_till: PropTypes.string,
      item_removals: PropTypes.arrayOf(PropTypes.object),
    }).isRequired,
  ),
  setDayItems: PropTypes.func.isRequired,
  editTask: PropTypes.func.isRequired,
  openAddTask: PropTypes.func.isRequired,
}

export default TaskScheduler;