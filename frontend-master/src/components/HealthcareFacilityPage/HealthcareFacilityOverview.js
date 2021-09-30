import React, {useState, useContext, useEffect} from 'react';
import {IconButton, Divider, Box, Popover, Typography, Button} from "@material-ui/core";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import UserContext from '../../context/UserContext';
import {Link} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {useHistory} from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import {GetHealthcareFacilities, DeleteHealthcareFacility} from '../../data/healthcareFacilityData'

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
    paginator: {
        justifyContent: "center",
        padding: "10px"
    },
    typography: {
        padding: theme.spacing(2),
    },
}));

function HealthcareFacilityOverview() {
    const user_context = useContext(UserContext);
    let token = user_context.getToken();

    const [healthcareFacilities, setHealthcareFacilities] = useState();
    const classes = useStyles();
    const history = useHistory();

    // pagination
    const itemsPerPage = 5;
    const [page, setPage] = useState(1);
    const [noOfPages, setNoOfPages] = useState(1);

    useEffect(async () => {
        let data = await GetHealthcareFacilities(token);
        if (data != null) {
            setHealthcareFacilities(data.healthcareFacilities)
            if ((data.healthcareFacilities.length / 5) >= 1) {
                setNoOfPages(Math.ceil(data.healthcareFacilities.length / 5));
            } else {
                setNoOfPages(1);
            }
        } else {
            console.log("Something went wrong")
        }
    }, []);

    const handleEdit = async (id) => {
        history.push(`/healthcarefacilities/${id}`, {params: id});
    }

    const handlePagination = (event, value) => {
        setPage(value);
    };

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

    const handleDelete = async () => {
        await DeleteHealthcareFacility(token, deleteTaskId);
        let data = await GetHealthcareFacilities(token);
        setHealthcareFacilities(data.healthcareFacilities);
        handleDeleteClose();
    }

    const openDelete = Boolean(anchorEl);
    const deleteId = openDelete ? 'simple-popover' : undefined;

    return (
        <div>
            <Link to="/healthcarefacilities/add">
                <IconButton aria-label="add user">
                    <AddCircleIcon fontSize="large"/>
                </IconButton>
            </Link>
            <Link to="/facilitymanagers">
                <IconButton aria-label="add facility manager">
                    <SupervisedUserCircleIcon fontSize="large"/>
                </IconButton>
            </Link>
            <div>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left"><strong>Naam&nbsp;</strong></TableCell>
                                <TableCell align="left"><strong>KvK Nummer&nbsp;</strong></TableCell>
                                <TableCell align="left"><strong>Vestiging&nbsp;</strong></TableCell>
                                <TableCell align="left"><strong>Locatie naam&nbsp;</strong></TableCell>
                                <TableCell align="left"><strong>Postcode&nbsp;</strong></TableCell>
                                <TableCell align="left"><strong>Huisnummer&nbsp;</strong></TableCell>
                                <TableCell align="left"><strong>Plaats&nbsp;</strong></TableCell>
                                <TableCell align="left"><strong>Acties&nbsp;</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {healthcareFacilities && Object.values(healthcareFacilities).slice((page - 1) * itemsPerPage, page * itemsPerPage).map(healthcareFacility => (
                                <TableRow key={healthcareFacility._id}>
                                    <TableCell component="th" scope="row">
                                        {healthcareFacility.name}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {healthcareFacility.kvkNumber}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {healthcareFacility.establishment}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {healthcareFacility.locationName}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {healthcareFacility.postalCode}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {healthcareFacility.houseNumber}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {healthcareFacility.place}
                                    </TableCell>
                                    <TableCell align="left">
                                        <IconButton aria-label="edit user"
                                                    onClick={() => handleEdit(healthcareFacility._id)}>
                                            <CreateIcon fontSize="small"/>
                                        </IconButton>
                                        <IconButton aria-label="delete user"
                                                    onClick={(event) => handleDeleteClick(healthcareFacility._id, event)}>
                                            <DeleteIcon fontSize="small"/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Divider/>
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
                            classes={{ul: classes.paginator}}
                        />
                    </Box>
                </TableContainer>
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
                    <Typography variant="h6" component="h6" className={classes.typography}>Weet je zeker dat je deze organisatie wilt verwijderen?</Typography>
                    <Typography className={classes.typography}>Alle gebruikers die onder deze organisatie vallen zullen ook verwijderd worden</Typography>
                    <Button onClick={handleDelete} color="primary" variant="contained" autoFocus>
                        Ja
                    </Button>
                    <Button onClick={handleDeleteClose} color="secondary" variant="contained">
                        Nee
                    </Button>
                </Popover>
            </div>

        </div>
    );
}

export default HealthcareFacilityOverview;