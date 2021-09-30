import React, {useState, useContext, useEffect} from 'react';
import {Button, Grid, makeStyles, Paper, TextField, Typography, IconButton} from "@material-ui/core";
import axios from 'axios';
import UserContext from '../../../context/UserContext';
import Checkbox from '@material-ui/core/Checkbox';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {useHistory} from "react-router-dom";
import {useLocation} from "react-router";
import moment from 'moment';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Alert from '@material-ui/lab/Alert';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {GetUser, EditNeedyUser} from "../../../data/userData";

const EditNeedyUserSchema = Yup.object().shape({
    email: Yup.string().email('Ongeldig Email Adres').required('Verplicht'),
    phone: Yup.number().typeError( "Dit is geen telefoonnumer" )
                .required( 'Telefoonnummer is verplicht!' ),
    firstname: Yup.string().required('Verplicht'),
    lastname: Yup.string().required('Verplicht'),
    birthday: Yup.string().required('Verplicht'),
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

function EditUserPage() {
    const classes = useStyles();
    const user_context = useContext(UserContext);
    let token = user_context.getToken();
    const [user, setUser] = useState();
    const history = useHistory();
    const location = useLocation();
    const id = location.state.params;

    const [initialValues = {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        birthday: '',
        phone: '',
        vibrate: false,
        audio: false,
        visual: false
    }, setInitialValues] = useState();

    useEffect(async () => {
        let needyUser = await GetUser(token, id);
        if(needyUser != null){
            setUser(needyUser);

            const values= {
                firstname: needyUser.user.firstname,
                lastname: needyUser.user.lastname,
                email: needyUser.user.email,
                birthday: moment(needyUser.user.birthday).format('YYYY-MM-DD'),
                phone: needyUser.user.phone,
                vibrate: needyUser.user.notifications.vibrate,
                audio: needyUser.user.notifications.audio,
                visual: needyUser.user.notifications.visual
            }
            setInitialValues(values);
        }
        else{
            console.log("Needy user not found");
        }
    }, []);

    const handleSubmit = async (values) => {
        const needyUser =
            {
                firstname: values.firstname,
                lastname: values.lastname,
                email: values.email,
                password: values.password,
                birthday: values.birthday,
                phone: values.phone,
                password: values.password,
                notifications: {vibrate: values.vibrate, audio: values.audio, visual: values.visual},
            }
        if(needyUser != null){
            const response = await EditNeedyUser(token, needyUser, id);
            if(response != null){
                history.push(`/needyusers`)
            }
        }
    }

    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validateOnChange: false,
        validationSchema : EditNeedyUserSchema,
        onSubmit: values => {
            handleSubmit(values);
        },
    });

    console.log(user);

    return (
        <div>
            <Link to="/needyusers" >
                <IconButton aria-label="back">
                    <ArrowBackIcon fontSize="large"/>
                </IconButton>
            </Link>
        { user &&
            <div>
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
                                    Wijzig <strong>{user.user.fullname}</strong>
                                </Typography>
                            </Grid>
                            <Grid item>
                                <form onSubmit={formik.handleSubmit}>
                                    <Grid container direction="column" spacing={2}>
                                        <Grid item>
                                            <label>Voornaam*</label>
                                            <br></br>
                                            <TextField
                                                type="text"
                                                placeholder="Voornaam"
                                                fullWidth
                                                name="firstname"
                                                variant="standard"
                                                autoFocus

                                                value={formik.values.firstname}
                                                error={!!formik.errors.firstname}
                                                onChange={formik.handleChange}
                                                helperText={formik.errors.firstname}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <label>Achternaam*</label>
                                            <br></br>
                                            <TextField
                                                type="text"
                                                placeholder="Achternaam"
                                                fullWidth
                                                multiline
                                                name="lastname"
                                                variant="standard"
                                                autoFocus

                                                value={formik.values.lastname}
                                                error={!!formik.errors.lastname}
                                                onChange={formik.handleChange}
                                                helperText={formik.errors.lastname}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <label>Email*</label>
                                            <br></br>
                                            <TextField
                                                type="text"
                                                placeholder="Email"
                                                fullWidth
                                                multiline
                                                name="email"
                                                variant="standard"
                                                autoFocus

                                                value={formik.values.email}
                                                error={!!formik.errors.email}
                                                onChange={formik.handleChange}
                                                helperText={formik.errors.email}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <label>Wachtwoord</label>
                                            <br></br>
                                            <TextField
                                                type="text"
                                                placeholder="Wachtwoord"
                                                fullWidth
                                                multiline
                                                name="password"
                                                variant="standard"
                                                autoFocus

                                                value={formik.values.password}
                                                onChange={formik.handleChange}
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

                                                value={formik.values.birthday}
                                                error={!!formik.errors.birthday}
                                                onChange={formik.handleChange}
                                                helperText={formik.errors.birthday}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <label>Telefoon nummer*</label>
                                            <br></br>
                                            <TextField
                                                type="number"
                                                placeholder="Telefoon nummer"
                                                name="phone"
                                                variant="standard"
                                                
                                                autoFocus

                                                value={formik.values.phone}
                                                error={!!formik.errors.phone}
                                                onChange={formik.handleChange}
                                                helperText={formik.errors.phone}
                                            />
                                        </Grid>
                                        <Grid item >
                                            <FormControl required component="fieldset">
                                                <FormLabel component="legend">Notificatie soort(en)</FormLabel>
                                                    <FormGroup>
                                                        <FormControlLabel
                                                            control={<Checkbox checked={formik.values.vibrate}
                                                            value={formik.values.vibrate}
                                                            onChange={formik.handleChange}
                                                            name="vibrate" />}
                                                            label="Trillen"
                                                        />
                                                        <FormControlLabel
                                                            control={<Checkbox checked={formik.values.audio}
                                                            value={formik.values.audio}
                                                            onChange={formik.handleChange}
                                                            name="audio" />}
                                                            label="Audio"
                                                        />
                                                        <FormControlLabel
                                                            control={<Checkbox checked={formik.values.visual}
                                                            value={formik.values.visual}
                                                            onChange={formik.handleChange}
                                                            name="visual" />}
                                                            label="Visueel"
                                                        />
                                                    </FormGroup>
                                            </FormControl>
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                type="submit"
                                                className={classes.submitButton}>
                                                Update
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
        }
        { !user &&
            <Alert severity="error">Er is iets mis gegaan bij het ophalen van de gebruiker!</Alert>
        }
        </div>
    );
}

export default EditUserPage;
