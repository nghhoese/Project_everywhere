import { useState, useEffect, useContext } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import UserContext from '../../../context/UserContext';
import { getTasks } from '../../../data/schedulerData';
import selectedUser from '../../../context/SelectedUserContext';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 100,
  },
}));

export default function AddTask({ addNewTask, standardDate }) {

  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = useStyles();
  const [time, setTime] = useState("13:00");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const selectedUserContext = useContext(selectedUser);

  const user_context = useContext(UserContext);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const fetchTasks = async () => {
    const result = await getTasks(selectedUserContext.selectedNeedyUser).catch(error => {
      console.log(error);
    });

    if(result?.data) {
      setTasks(result.data);
    }
  }

  useEffect(() => {
    if (standardDate !== null) {
      setOpen(true);
      setTime(standardDate.format("HH:mm"));
      setSelectedDate(standardDate);
    }
  }, [standardDate])

  useEffect(() => fetchTasks(), [])

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Voeg Taak Toe
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">Voeg een nieuwe taak toe
          <form noValidate>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="dd/MM/yyyy"
                id="date-picker-inline"
                label="Date picker inline"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
            <TextField
              id="time"
              label="Tijd"
              type="time"
              value={time}
              className={classes.textField}
              onChange={(e) => setTime(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 min
              }}
            />
          </form>
        </DialogTitle>
        <DialogContent>
          <List>
            {
              tasks.length > 0 ?
              tasks.map((task, i) =>
                <ListItem button key={i} onClick={() => { addNewTask(task, selectedDate, time); handleClose(); }}>
                  <ListItemText primary={task.name} secondary="" />
                </ListItem>
              ) :
              "Er zijn geen taken beschikbaar."
            }
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Annuleer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}