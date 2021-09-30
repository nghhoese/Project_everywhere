import { useState, useEffect } from 'react';

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

export default function EditingTask({ editingTask, setEditingTask, changeTask }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = useStyles();
  const [day, setDay] = useState(0);
  const [time, setTime] = useState("00:00");

  const handleClose = () => {
    setEditingTask(null);
  };

  const handleChange = (event) => {
    setDay(event.target.value);
  };

  const formatTime = (time) => {
    if(!time) return;
    let [hour, mimutes] = time.split(':');
    if(hour.length < 2) return `0${hour}:${mimutes}`;
    return `${hour}:${mimutes}`;
  }

  const editTask = () => {
    changeTask(day, time);
  }

  useEffect(() => {
    if(editingTask) {
      setDay(editingTask.day);
      setTime(formatTime(editingTask.time));
    }
  }, [editingTask])

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={Boolean(editingTask)}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">Wijzig taak
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
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Annuleer
          </Button>
          <Button onClick={() => editTask()} color="primary">
            Wijzig
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}