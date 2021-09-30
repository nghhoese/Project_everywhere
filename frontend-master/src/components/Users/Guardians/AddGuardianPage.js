import React, {useState, useContext, useEffect} from 'react';
import {Button, Grid, makeStyles, Paper, TextField, Typography, IconButton} from "@material-ui/core";
import UserContext from '../../../context/UserContext';
import {useHistory} from "react-router-dom";
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Multiselect } from 'multiselect-react-dropdown';
import {GetNeedyUsersFromCaregiver, AddGuardian} from "../../../data/userData";

const AddGuardianSchema = Yup.object().shape({
    email: Yup.string().email('Ongeldig Email Adres').required('Verplicht'),
    phone: Yup.number().typeError( "Dit is geen telefoonnumer" )
                .required( 'Telefoonnummer is verplicht!' ),
    firstname: Yup.string().required('Verplicht'),
    lastname: Yup.string().required('Verplicht'),
    birthday: Yup.string().required('Verplicht'),
    password: Yup.string().required('Verplicht'),
});

const useStyles = makeStyles((theme) => ({
    form: {
        justifyContent: 'center',
    },
    submitButton: {
        width: '100%',
    },
    background: {
        justifyContent: 'center',
        minHeight: '30vh',
        padding: '50px'
    },
    hidden: {
        display: "none",
    },
    importLabel: {
        color: "black",
    },
}))

function AddGuardianPage() {
    const classes = useStyles();
    const user_context = useContext(UserContext);
    let token = user_context.getToken();
    const history = useHistory();
    let [needyUsers, setNeedyUsers] = useState([]);
    let [selectedNeedyUsers, setSelectedNeedyUsers] = useState([]);

    useEffect(async () => {
        let needy_users = await GetNeedyUsersFromCaregiver(token);
        setNeedyUsers(needy_users);
    }, []);

    const handleSubmit = async (values) => {
        const user =
            {
                firstname: values.firstname,
                lastname: values.lastname,
                email: values.email,
                birthday: values.birthday,
                phone: values.phone,
                password: values.password,
                notifications: {vibrate: false, audio: false, visual: false},
            }
        const needy_users = selectedNeedyUsers;
        if(user != null){
            const response = await AddGuardian(token, user, needy_users);
            if(response != null){
                history.push(`/guardians`)
            }
        }
    }

    const formik = useFormik({
        initialValues: {
          firstname: '',
          lastname: '',
          email : '',
          birthday: '',
          phone: '',
          password: '',
        },
        validateOnChange: false,
        validationSchema : AddGuardianSchema,
        onSubmit: values => {
          handleSubmit(values);
        },
    });

    const addNeedyUser = async e => {
        setSelectedNeedyUsers([]);
        let needy_users = [];
        for(let i = 0; i < e.length; i ++){
            needy_users.push(e[i]._id);
        }
        setSelectedNeedyUsers(needy_users)
    }

    const removeNeedyUser = async e => {
        setSelectedNeedyUsers([]);
        let needy_users = [];
        for(let i = 0; i < e.length; i ++){
            needy_users.push(e[i]._id);
        }
        setSelectedNeedyUsers(needy_users)
    }

    return (
        <div>
            <Link to="/guardians" >
                <IconButton aria-label="back">
                    <ArrowBackIcon fontSize="large"/>
                </IconButton>
            </Link>
            <Grid container direction="column">
                <Grid item>
                    <Grid
                        container
                        direction="column"
                        justify="center"
                        spacing={2}
                        className={classes.form}>
                        <Paper
                            variant="elevation"
                            elevation={2}
                            className={classes.background}>
                            <Grid item>
                                <Typography component="h1" variant="h5">
                                    Voeg een mantelzorger toe
                                </Typography>
                            </Grid>
                            <Grid item>
                                <form onSubmit={formik.handleSubmit}>
                                    <Grid container direction="column" spacing={2}>
                                        <Grid item>
                                            <TextField
                                                id="outlined-multiline-static"
                                                label="Voornaam"
                                                type="text"
                                                placeholder="Voornaam"
                                                fullWidth
                                                name="firstname"
                                                variant="standard"
                                                autoFocus

                                                error={!!formik.errors.firstname}
                                                onChange={formik.handleChange}
                                                value={formik.values.firstname}
                                                helperText={formik.errors.firstname}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                id="outlined-multiline-static"
                                                label="Achternaam"
                                                type="text"
                                                placeholder="Achternaam"
                                                fullWidth
                                                multiline
                                                name="lastname"
                                                variant="standard"
                                                autoFocus

                                                error={!!formik.errors.lastname}
                                                onChange={formik.handleChange}
                                                value={formik.values.lastname}
                                                helperText={formik.errors.lastname}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                id="outlined-multiline-static"
                                                label="Email"
                                                type="text"
                                                placeholder="Email"
                                                fullWidth
                                                multiline
                                                name="email"
                                                variant="standard"
                                                autoFocus

                                                error={!!formik.errors.email}
                                                onChange={formik.handleChange}
                                                value={formik.values.email}
                                                helperText={formik.errors.email}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                id="outlined-multiline-static"
                                                label="Wachtwoord"
                                                type="text"
                                                placeholder="Wachtwoord"
                                                fullWidth
                                                multiline
                                                name="password"
                                                variant="standard"
                                                autoFocus

                                                error={!!formik.errors.password}
                                                onChange={formik.handleChange}
                                                value={formik.values.password}
                                                helperText={formik.errors.password}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <label>Geboorte datum*</label>
                                            <br></br>
                                            <TextField
                                                type="date"
                                                name="birthday"
                                                variant="standard"
                                                autoFocus

                                                error={!!formik.errors.birthday}
                                                onChange={formik.handleChange}
                                                value={formik.values.birthday}
                                                helperText={formik.errors.birthday}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                id="outlined-multiline-static"
                                                label="Telefoon nummer"
                                                type="number"
                                                placeholder="Telefoon nummer"
                                                name="phone"
                                                variant="standard"
                                                autoFocus

                                                error={!!formik.errors.phone}
                                                onChange={formik.handleChange}
                                                value={formik.values.phone}
                                                helperText={formik.errors.phone}
                                            />
                                        </Grid>
                                        {needyUsers.needy_users &&
                                            <Grid item>
                                                <label>Hulpbehoevende(n)</label>
                                                <br></br>
                                                <Multiselect
                                                    options={needyUsers.needy_users}
                                                    displayValue="fullname"
                                                    placeholder="Selecteer hulpbehoevenden"
                                                    onSelect={addNeedyUser}
                                                    onRemove={removeNeedyUser}
                                                />
                                            </Grid>
                                        }
                                        <Grid item>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                type="submit"
                                                disabled={selectedNeedyUsers.length == 0}
                                                className={classes.submitButton}>
                                                Submit
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}

export default AddGuardianPage;
