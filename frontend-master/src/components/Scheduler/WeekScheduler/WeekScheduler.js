import { useEffect, useState, useContext } from 'react';
import '../../../css/taskScheduler.css';
import moment from 'moment';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import selectedUser from '../../../context/SelectedUserContext';

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  },
}));

function WeekScheduler({ dayItems, setDayItems, tasks, editTask, deleteTaskUrl, addNewTask, updateDayItem }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [clickedTask, setClickedTask] = useState(null);
  const selectedUserContext = useContext(selectedUser);

  

  const days = [
    "Zondag",
    "Maandag",
    "Dinsdag",
    "Woensdag",
    "Donderdag",
    "Vrijdag",
    "Zaterdag",
  ]

  let startTime = 0;
  let endTime = 24;
  let currentGroup = 0;

  const calcAmountToPushTaskDown = (task) => {
    let schedulerStartTime = moment.duration(moment.utc(startTime, "HH")).asHours();
    let schedulerEndTime = moment.duration(moment.utc(endTime, "HH")).asHours();
    let taskTime = moment.duration(moment.utc(task.time, "HH:mm")).asHours();

    schedulerEndTime = schedulerEndTime - schedulerStartTime;
    taskTime = taskTime - schedulerStartTime;

    return (taskTime / schedulerEndTime) * 100;
  }

  const tasksTouchEachother = (task, otherTask) => {
    if (task === otherTask) return false;
    if (task.day !== otherTask.day) return false;
    
    const amountPushDown = calcAmountToPushTaskDown(task);
    const amountPushDownOtherTask = calcAmountToPushTaskDown(otherTask);

    if (Math.abs(amountPushDown - amountPushDownOtherTask) < 5) return true;

    return false;
  }

  const calcTaskStyle = (task) => {
    let gap = 1;
    let tasksInSameDay = dayItems.filter(t => t.day === task.day);
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

    return { top: calcAmountToPushTaskDown(task) + "%", width: width + "%", left: left + "%" }
  }

  const handlePopoverClick = (event, task) => {
    event.stopPropagation();
    setClickedTask(task);
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const deleteTask = () => {
    setAnchorEl(null);
    deleteTaskUrl(clickedTask._id)
    setClickedTask(null);
  }

  const groupTasks = () => {
    let dayItemArray = [...dayItems];

    dayItemArray = dayItemArray.sort((a, b) => {
      let [hourA] = a.time.split(':');
      let [hourB] = b.time.split(':');
      return parseInt(hourA) - parseInt(hourB);
    });

    currentGroup = Math.max(...dayItemArray.map(t => t.group));

    let hasChanged = false;

    for (let i = 0; i < dayItemArray.length; i++) {

      for (let j = 0; j < dayItemArray.length; j++) {
        if (tasksTouchEachother(dayItemArray[i], dayItemArray[j])) {
          if (dayItemArray[i].group === 0) {
            hasChanged = true;
            currentGroup++;
            dayItemArray[i].group = currentGroup;
            dayItemArray[j].group = currentGroup;
          } else {
            if (dayItemArray[j].group !== dayItemArray[i].group) {
              hasChanged = true;
              dayItemArray[j].group = dayItemArray[i].group;
            }
          }
        }
      }

    }
    if (hasChanged) setDayItems(dayItemArray);
  }

  useEffect(groupTasks, [dayItems]);

  // const clickedOnDay = (event, dayIndex) => {
  //   const mouseHeightInElement = event.nativeEvent.offsetY;
  //   const elementHeight = event.nativeEvent.srcElement.clientHeight;
  //   const rational = mouseHeightInElement / elementHeight;
  //   const minutesInDay = (endTime - startTime) * 60;
  //   const minuteOfDay = minutesInDay * rational;
    
  //   let date = moment()
  //     .set('hour', 0)
  //     .set('minute', 0)
  //     .set('second', 0)
  //     .add(minuteOfDay, 'minutes')
    
  //   const time = date.format("HH:mm")
  //   openAddTask(dayIndex, time)
  // }

  const onDrop = (event, dayIndex) => {
    const type = event.dataTransfer.getData("type");
    let element = event.target;

    while(!element.classList.contains("task-scheduler__down__days__day")) {
      element = element.parentElement;
    }

    const elementBoundingClientRect = element.getBoundingClientRect();
    const mouseHeightInElement = event.clientY - elementBoundingClientRect.top;

    // const mouseHeightInElement = event.nativeEvent.offsetY;
    const elementHeight = elementBoundingClientRect.height;
    const rational = mouseHeightInElement / elementHeight;
    const minutesInDay = (endTime - startTime) * 60;
    const minuteOfDay = minutesInDay * rational;
    
    let date = moment()
      .set('hour', 0)
      .set('minute', 0)
      .set('second', 0)
      .add(minuteOfDay, 'minutes')

    const taskId = event.dataTransfer.getData("taskId");
    const time = date.format("HH:mm");

    if(type == "newItem") {
      const task = tasks.find(t => t._id == taskId);
  
      addNewTask(task, dayIndex, time);

    } else if(type == "edit") {
      const dayItem = dayItems.find(t => t._id == taskId);
      updateDayItem(dayItem._id, dayIndex, time, selectedUserContext.selectedNeedyUser)
        .then(i => {
          setDayItems([...dayItems.filter(t => t._id !== dayItem._id), {...dayItem, day: dayIndex, time, group: 0}]);
      }).catch(e => console.log(e))
    }

  }

  return (
    <div className="task-scheduler">
      <div className="task-scheduler__upper">
        <div className="task-scheduler__upper__time">
          <div className="task-scheduler__upper__label">
          </div>
        </div>
        <div className="task-scheduler__upper__days">
          {
            days.map((day, i) =>
                <div key={i} className="task-scheduler__upper__days__day">
                  <div className="task-scheduler__upper__label day">{day}</div>
                </div>
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
            [...Array(7)].map((day, dayIndex) =>
              <div className="task-scheduler__down__days__day" key={dayIndex} onDrop={(e) => onDrop(e, dayIndex)} onDragOver={(e) => {e.preventDefault();}}>
                {
                  dayItems.map((task, i) =>
                    dayIndex === task.day ?
                      <div className="task-scheduler__task" key={i} style={calcTaskStyle(task)} onClick={(e) => handlePopoverClick(e, task)} title={task.task?.name} draggable onDragStart={(e) => {e.dataTransfer.setData("type", "edit");e.dataTransfer.setData("taskId", task._id);}}>
                        <span className="task-scheduler__task__head">
                          <span className="task-scheduler__task__time">{task.time}</span>
                          <span className="task-scheduler__task__catagory" style={{background: task?.task?.category?.colour }}></span>
                        </span>
                        <h5 className="task-scheduler__task__title">{task.task?.name}</h5>
                      </div>
                    : null
                  )
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
        <div className={classes.typography}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Typography >{clickedTask?.task?.name || ""}</Typography>
            <Typography variant="body2">{clickedTask?.task?.time || ""}</Typography>
            <span className="category--color" style={{background: clickedTask?.task?.category?.colour}}>{clickedTask?.task?.category?.name}</span>
          </div>
          <IconButton aria-label="edit" onClick={() => { editTask(clickedTask); handlePopoverClose(); }}>
            <EditIcon />
          </IconButton>
          <IconButton aria-label="delete" onClick={() => deleteTask()}>
            <DeleteIcon />
          </IconButton>
        </div>
      </Popover>

    </div>
  )
}

WeekScheduler.propTypes = {
  dayItems: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      day: PropTypes.number.isRequired,
      time: PropTypes.string.isRequired,
      group: PropTypes.number.isRequired,
    }).isRequired,
  ),
  setDayItems: PropTypes.func.isRequired,
}

export default WeekScheduler;