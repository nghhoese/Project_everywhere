import React, {useContext, useEffect} from 'react';
import { Link } from 'react-router-dom';
import {
    Button,
    Card,
    CardActions,
    CardHeader,
    Grid,
    IconButton,
    makeStyles, Popover,
    Typography,
} from "@material-ui/core";

import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ShareIcon from '@material-ui/icons/Share';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import UserContext from "../../context/UserContext";
import {DeleteTask, GetMainTasks} from "../../data/taskData";
import SelectedUserContext from "../../context/SelectedUserContext";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";

const useStyles = makeStyles((theme) => ({
    card: {
        maxWidth: 335,
        marginRight: theme.spacing(3),
        marginBottom: theme.spacing(3),
    },
    typography: {
        padding: theme.spacing(2),
    },
}))

function TaskOverview() {
    const classes = useStyles();

    const user_context = useContext(UserContext);
    const selectedUser_context = useContext(SelectedUserContext)
    let token = user_context.getToken();

    const [mainTasks, setMainTasks] = React.useState([]);

    useEffect(async () => {
        if (selectedUser_context.selectedNeedyUser) {
            let response = await GetMainTasks(token, selectedUser_context.selectedNeedyUser._id, false);
            setMainTasks(response);
        } else {
            setMainTasks([]);
            console.log("No needy user selected")
        }
    }, [selectedUser_context.selectedNeedyUser]);

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

    return (
        <div>
            {
                Boolean(selectedUser_context.selectedNeedyUser) ?
                    <div>
                        <Link to="/tasks/add">
                            <IconButton aria-label="add task">
                                <AddCircleIcon fontSize="large"/>
                            </IconButton>
                        </Link>
                        <Link to="/tasks/templates" >
                            <IconButton aria-label="templates overview">
                                <AssignmentTurnedInIcon fontSize="large"/>
                            </IconButton>
                        </Link>
                    </div>
                    :
                    <div style={{display: "flex", alignItems: "flex-end"}}>
                        <img style={{width: "200px", opacity: 0.3, marginLeft: "50px", padding: "0px 10px 15px 0px"}} src="./assets/arrow.png"></img>
                        <p style={{fontFamily: "'Indie Flower', cursive", fontSize: "30px", color: "gray", margin: "0"}}>Selecteer hulpbehoevende</p>
                    </div>
            }
            <Grid container>
                {
                    mainTasks.map((task, i) =>
                        <Card className={classes.card} key={i}>
                            <CardHeader
                                action={
                                    <Link to={`/tasks/edit/${task._id}`}>
                                        <IconButton aria-label="edit task">
                                            <EditIcon/>
                                        </IconButton>
                                    </Link>
                                }
                                title={task.name}
                            />
                            <CardActions disableSpacing>
                                <IconButton aria-label="delete task"
                                            onClick={(event) => handleDeleteClick(task._id, event)}>
                                    <DeleteForeverIcon/>
                                </IconButton>
                            </CardActions>
                        </Card>
                    )
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
        </div>
    )
}

export default TaskOverview