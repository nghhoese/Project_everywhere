import React, {useContext, useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import {
    Button,
    Card,
    CardActions,
    CardHeader, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Grid,
    IconButton,
    makeStyles, Popover, Typography,
} from "@material-ui/core";
import GetAppIcon from '@material-ui/icons/GetApp';
import EditIcon from '@material-ui/icons/Edit';
import UserContext from "../../context/UserContext";
import {addSharedTask, DeleteTask, GetMainTasks} from "../../data/taskData";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import {Multiselect} from "multiselect-react-dropdown";
import {GetNeedyUsersFromCaregiver} from "../../data/userData";
import AlertContext from '../../context/AlertContext';

const useStyles = makeStyles((theme) => ({
    card: {
        maxWidth: 335,
        marginRight: theme.spacing(3),
        marginBottom: theme.spacing(3),
    },
    typography: {
        padding: theme.spacing(2),
    },
    share: {
        marginLeft: 'auto'
    }
}))

function TaskOverview() {
    const classes = useStyles();

    const user_context = useContext(UserContext);
    let token = user_context.getToken();

    const {alert} = useContext(AlertContext);
    const [mainTasks, setMainTasks] = React.useState([]);
    let [needyUsers, setNeedyUsers] = React.useState([]);
    let [selectedNeedyUsers, setSelectedNeedyUsers] = useState([]);

    useEffect(async () => {
        let response = await GetMainTasks(token, null, true);
        let response2 = await GetNeedyUsersFromCaregiver(token)
        setMainTasks(response);
        setNeedyUsers(response2.needy_users)
    }, []);

    const CardHeaderEditIcon = (task) =>
    {
        if(task.caregiver === user_context.user._id) {
            return (
                <Link to={`/tasks/edit/${task._id}`}>
                    <IconButton aria-label="edit task">
                        <EditIcon/>
                    </IconButton>
                </Link>
            )
        }
    }

    // Delete task
    const [anchorEl, setAnchorEl] = React.useState(null);

    const [deleteTaskId, setDeleteTaskId] = React.useState("");

    const handleDeleteClick = (id, event) => {
        setDeleteTaskId(id)
        setAnchorEl(event.currentTarget);
    };

    const handleDeleteClose = () => {
        setAnchorEl(null);
    };

    const handleDeleteTask = async e => {
        await DeleteTask(deleteTaskId, token)
        let newMainTasks = mainTasks.filter((task) => task._id !== deleteTaskId);
        setMainTasks(newMainTasks)
        handleDeleteClose()
    };

    const openDelete = Boolean(anchorEl);
    const deleteId = openDelete ? 'simple-popover' : undefined;

    //share task
    const [open, setOpen] = React.useState(false);
    const [shareTaskId, setShareTaskId] = React.useState("");

    const handleShareClick = (id, event) => {
        setShareTaskId(id)
        setOpen(true);
    };

    const handleShareClose = () => {
        setOpen(false);
    };

    const handleShareTask = async () => {
        if(selectedNeedyUsers.length > 0) {
            await addSharedTask(token, shareTaskId, selectedNeedyUsers)
        }
        else {
            alert({title: 'Geen Hulpbehoevenden geselecteerd, taak is niet toegevoegd', severity: 'warning'})
        }
        handleShareClose()
    };

    const addNeedyUser = async e => {
        setSelectedNeedyUsers([]);
        let needy_users = [];
        for(let i = 0; i < e.length; i ++){
            needy_users.push(e[i]._id);
        }
        setSelectedNeedyUsers(needy_users)
    }


    const descriptionElementRef = React.useRef(null);

    if (open) {
        const { current: descriptionElement } = descriptionElementRef;
        if (descriptionElement !== null) {
            descriptionElement.focus();
        }
    }

    return (
        <div>
            {
                needyUsers.length <= 0 &&
                <div>
                    <Typography className={classes.typography}>U heeft nog geen hulpbehoevende om een gedeelde taak aan toe te voegen</Typography>
                </div>
            }
            <Grid container>
                {
                    mainTasks.length ?
                    mainTasks.map((task, i) =>
                        <Card className={classes.card} key={i}>
                            <CardHeader
                                action={
                                    CardHeaderEditIcon(task)
                                }
                                title={task.name}
                            />
                            <CardActions disableSpacing>
                                { task.caregiver === user_context.user._id &&
                                    <IconButton aria-label="delete task"
                                                onClick={(event) => handleDeleteClick(task._id, event)}>
                                        <DeleteForeverIcon/>
                                    </IconButton>
                                }
                                {
                                    needyUsers.length > 0 &&
                                    <IconButton aria-label="share task" className={classes.share}
                                                onClick={(event) => handleShareClick(task._id, event)}>
                                        <GetAppIcon/>
                                    </IconButton>
                                }
                            </CardActions>
                        </Card>
                    )
                    :
                    <div>
                        <Typography className={classes.typography}>Er zijn nog geen gedeelde taken om uit te kiezen</Typography>
                    </div>
                }
            </Grid>
            <Popover
                id={deleteId}
                open={openDelete}
                anchorEl={anchorEl}
                onClose={handleDeleteClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Typography className={classes.typography}>Weet je zeker dat je deze taak wilt verwijderen?</Typography>
                <Button onClick={handleDeleteTask} color="primary" variant="contained" autoFocus>
                    Ja
                </Button>
                <Button onClick={handleDeleteClose} color="secondary" variant="contained">
                    Nee
                </Button>
            </Popover>
            <Dialog
                open={open}
                onClose={handleShareClose}
                scroll={'paper'}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">Voeg gedeelde taak toe aan hulpbehoevenden</DialogTitle>
                <DialogContent dividers={true} style={{height:'250px'}}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                    >
                        {needyUsers &&
                        <Multiselect
                            options={needyUsers}
                            displayValue="fullname"
                            placeholder="Selecteer hulpbehoevenden"
                            onSelect={addNeedyUser}
                        />
                        }
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleShareClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleShareTask} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default TaskOverview