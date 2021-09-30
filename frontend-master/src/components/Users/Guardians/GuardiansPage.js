import React, {useState, useContext, useEffect} from 'react';
import { IconButton, Divider, Box } from "@material-ui/core";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import UserContext from '../../../context/UserContext';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {useHistory} from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import {DeleteUser, getGuardians, GetGuardiansFromCaregiver} from "../../../data/userData";

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
    paginator: {
        justifyContent: "center",
        padding: "10px"
    },
  });

function GuardiansPage() {
    const user_context = useContext(UserContext);
    let token = user_context.getToken();
    const [users, setUsers] = useState();
    const classes = useStyles();
    const history = useHistory();

    // pagination
    const itemsPerPage = 5;
    const [page, setPage] = useState(1);
    const [noOfPages, setNoOfPages] = useState(1);

    useEffect(async () => {
        let data = await GetGuardiansFromCaregiver(token);
        if(data != null){
            setUsers(data)
            if((data.guardians.length / 5) >= 1){
                setNoOfPages(Math.ceil(data.users.length/5));
            }
            else{
                setNoOfPages(1);
            }
        }
        else{
            console.log("Something went wrong")
        }
    }, []);

    const handleDelete = async (userId) => {
        const response = await DeleteUser(token, userId);
        if(response.error == null){
            let data = await GetGuardiansFromCaregiver(token);
            setUsers(data)
        }
        else{
            console.log("Something went wrong")
        }
    }

    const handleEdit = async (userId) => {
        history.push(`/guardians/${userId}`, {params: userId});
    }

    const handlePagination = (event, value) => {
        setPage(value);
    };

    return (
        <div>
            <Link to="/guardians/add" >
                <IconButton aria-label="add user">
                    <AddCircleIcon fontSize="large"/>
                </IconButton>
            </Link>
            
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
                            {users && Object.values(users.guardians).slice((page - 1) * itemsPerPage, page * itemsPerPage).map(user => (
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
                                        <IconButton aria-label="edit user" disabled={user.roles[0].name != "guardian"} onClick={() => handleEdit(user._id)}>
                                            <CreateIcon fontSize="small"/>
                                        </IconButton>
                                        <IconButton aria-label="delete user" disabled={user.roles[0].name != "guardian"} onClick={() => handleDelete(user._id)}>
                                            <DeleteIcon fontSize="small"/>
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
            </div>

        </div>
    );
}

export default GuardiansPage;