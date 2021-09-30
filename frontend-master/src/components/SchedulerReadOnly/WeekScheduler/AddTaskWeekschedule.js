import { useState, useContext, useEffect } from 'react';

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

export default function AddTask({ addNewTask, addComponentDate }) {

  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = useStyles();
  const [day, setDay] = useState(0);
  const [time, setTime] = useState("13:00");
  const [tasks, setTasks] = useState([]);
  const user_context = useContext(UserContext);
  const selectedUserContext = useContext(selectedUser);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setDay(event.target.value);
  };

  const fetchTasks = async () => {
    const result = await getTasks(selectedUserContext.selectedNeedyUser).catch(error => {
      console.log(error);
    });

    if(result?.data) {
      setTasks(result.data);
    }
  }

  useEffect(() => fetchTasks(), []);

  useEffect(() => {
    if(addComponentDate?.day || addComponentDate?.day === 0) {
      setTime(addComponentDate.time);
      setDay(addComponentDate.day);
      setOpen(true);
    }
  }, [addComponentDate])

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
          <form className={classes.container} noValidate>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={day}
              onChange={handleChange}
            >
              <MenuItem value={0}>Zondag</MenuItem>
              <MenuItem value={1}>Maandag</MenuItem>
              <MenuItem value={2}>Dinsdag</MenuItem>
              <MenuItem value={3}>Woensdag</MenuItem>
              <MenuItem value={4}>Donderdag</MenuItem>
              <MenuItem value={5}>Vrijdag</MenuItem>
              <MenuItem value={6}>Zaterdag</MenuItem>
            </Select>
            <TextField
              id="time"
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
                <ListItem button key={i} onClick={() => { addNewTask(task, day, time); handleClose(); }}>
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