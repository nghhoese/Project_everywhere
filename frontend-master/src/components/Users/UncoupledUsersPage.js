import React, {useState, useContext, useEffect} from 'react';
import UserContext from '../../context/UserContext';
import {GetUncoupledUsers, getCaregivers, ConnectNeedyUser} from "../../data/userData";
import Pagination from "@material-ui/lab/Pagination";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { IconButton, Divider, Box } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import {Button,Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@material-ui/core";
import {Multiselect} from "multiselect-react-dropdown";

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
    paginator: {
        justifyContent: "center",
        padding: "10px"
    },
});


function UncoupledUsersPage() {
    const classes = useStyles();
    const user_context = useContext(UserContext);
    let token = user_context.getToken();
    let [users, setUsers] = useState();
    let [caregivers, setCaregivers] = useState();
    let [selectedCaregiver, setSelectedCaregiver] = useState([]);
    let [selectedNeedyUser, setSelectedNeedyUser] = useState([]);

    // pagination
    const itemsPerPage = 5;
    const [page, setPage] = useState(1);
    const [noOfPages, setNoOfPages] = useState(1);

    useEffect(async () => {
        let users = await GetUncoupledUsers(token);
        let caregivers = await getCaregivers(token);
        setUsers(users);
        setCaregivers(caregivers);
        if((users.uncoupledNeedyUsers.length / 5) >= 1){
            setNoOfPages(Math.ceil(users.uncoupledNeedyUsers.length/5));
        }
        else{
            setNoOfPages(1);
        }
    }, []);

    const handlePagination = (event, value) => {
        setPage(value);
    };

    //share task
    const [open, setOpen] = React.useState(false);
    const [addUserId, setAddUserId] = React.useState("");

    const handleAddClick = (id, user, event) => {
        setAddUserId(id)
        setSelectedNeedyUser(user);
        setOpen(true);
    };

    const handleAddClose = () => {
        setOpen(false);
    };

    const handleAddTask = async () => {
        if(selectedCaregiver.length > 0) {
            await ConnectNeedyUser(token, addUserId, selectedCaregiver)
            let users = await GetUncoupledUsers(token);
            setUsers(users);
        }
        else {
            alert({title: 'Geen hulpverlener geselecteerd, hulpbehoevende is niet toegevoegd', severity: 'warning'})
        }
        handleAddClose()
    };

    const addCaregiver = async e => {
        setSelectedCaregiver([]);
        let caregivers = [];
        for(let i = 0; i < e.length; i ++){
            caregivers.push(e[i]._id);
        }
        setSelectedCaregiver(caregivers)
    }

    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    return (
        <div>
            <h1>Losgekoppelde hulpbehoevenden</h1>

            <div>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left"><strong>Naam&nbsp;</strong></TableCell>
                                <TableCell align="left"><strong>Email&nbsp;</strong></TableCell>
                                <TableCell align="left"><strong>Rol&nbsp;</strong></TableCell>
                                <TableCell align="left"><strong>Acties&nbsp;</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users && Object.values(users.uncoupledNeedyUsers).slice((page - 1) * itemsPerPage, page * itemsPerPage).map(user => (
                                <TableRow key={user._id}>
                                    <TableCell component="th" scope="row">
                                        {user.fullname}
                                    </TableCell>
                                    <TableCell align="left">{user.email}</TableCell>
                                    <TableCell align="left">
                                        {user.roles[0].name === "needy_user" &&
                                            'Hulpbehoevende'
                                        }
                                        {user.roles[0].name === "caregiver" &&
                                            'Hulpverlener'
                                        }
                                        {user.roles[0].name === "guardian" &&
                                            'Mantelzorger'
                                        }
                                        </TableCell>
                                    <TableCell align="left">
                                        <IconButton aria-label="edit user" className={classes.share} onClick={(event) => handleAddClick(user._id, user, event)}>
                                            <AddCircleIcon fontSize="default"/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Divider />
                    <Box component="span">
                        <Pagination
                            count={noOfPages}
                            page={page}
                            onChange={handlePagination}
                            defaultPage={1}
                            color="primary"
                            size="large"
                            showFirstButton
                            showLastButton
                            classes={{ ul: classes.paginator }}
                        />
                    </Box>
                </TableContainer>
                <Dialog
                    open={open}
                    onClose={handleAddClose}
                    scroll={'paper'}
                    aria-labelledby="scroll-dialog-title"
                    aria-describedby="scroll-dialog-description"
                    >
                    <DialogTitle id="scroll-dialog-title">Voeg Hulpbehoevende toe aan een hulpverlener</DialogTitle>
                    <DialogContent dividers={true} style={{height:'250px'}}>
                        <DialogContentText
                            id="scroll-dialog-description"
                            ref={descriptionElementRef}
                            tabIndex={-1}
                        >
                            {caregivers &&
                            <Multiselect
                                options={caregivers.users}
                                displayValue="fullname"
                                placeholder="Selecteer hulpverlener"
                                singleSelect="true"
                                onSelect={addCaregiver}
                            />
                            }
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleAddClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleAddTask} color="primary">
                            Submit
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>

        </div>
    );
}

export default UncoupledUsersPage;