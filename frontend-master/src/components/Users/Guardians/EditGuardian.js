import React, {useState, useContext, useEffect} from 'react';
import {Button, Grid, makeStyles, Paper, TextField, Typography, IconButton} from "@material-ui/core";
import UserContext from '../../../context/UserContext';
import {useHistory} from "react-router-dom";
import {useLocation} from "react-router";
import moment from 'moment';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Alert from '@material-ui/lab/Alert';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Multiselect } from 'multiselect-react-dropdown';
import {GetNeedyUsersFromCaregiver, EditGuardian, GetUser, GetNeedyUserGuardians} from "../../../data/userData";

const EditGuardianSchema = Yup.object().shape({
    email: Yup.string().email('Ongeldig Email Adres').required('Verplicht'),
    phone: Yup.number().typeError( "Dit is geen telefoonnumer" )
                .required( 'Telefoonnummer is verplicht!' ),
    firstname: Yup.string().required('Verplicht'),
    lastname: Yup.string().required('Verplicht'),
    birthday: Yup.string().required('Verplicht')
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

function EditGuardianPage() {
    const classes = useStyles();
    const user_context = useContext(UserContext);
    let token = user_context.getToken();
    const [user, setUser] = useState();
    const history = useHistory();
    const location = useLocation();
    const id = location.state.params;
    let [needyUsers, setNeedyUsers] = useState([]);
    let [selectedNeedyUsers, setSelectedNeedyUsers] = useState([]);
    let [startNeedyUsers, setstartNeedyUsers] = useState([]);

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
        let guardian = await GetUser(token, id);
        if(guardian != null){
            setUser(guardian);
            const values= {
                firstname: guardian.user.firstname,
                lastname: guardian.user.lastname,
                email: guardian.user.email,
                birthday: moment(guardian.user.birthday).format('YYYY-MM-DD'),
                phone: guardian.user.phone,
                vibrate: guardian.user.notifications.vibrate,
                audio: guardian.user.notifications.audio,
                visual: guardian.user.notifications.visual
            }
            setInitialValues(values);

            let needy_users = await GetNeedyUsersFromCaregiver(token);
            setNeedyUsers(needy_users);

            const selectedUsers = [];
            for(let i = 0; i < needy_users.needy_users.length; i++){
                const guardians = await GetNeedyUserGuardians(token, needy_users.needy_users[i]._id);
                if(guardians != null){
                    for(let j = 0; j < guardians.guardians.length; j++){
                        if(guardians.guardians[j].email === guardian.user.email){
                            selectedUsers.push(needy_users.needy_users[i]);
                        }
                    }
                }
            }
            setstartNeedyUsers(selectedUsers);
            setSelectedNeedyUsers(selectedUsers);
        }
        else{
            console.log("Guardian not found");
        }
    }, []);

    const handleSubmit = async (values) => {
        const guardian =
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

        selectedNeedyUsers = startNeedyUsers;
        const needy_users = selectedNeedyUsers;
        const response = await EditGuardian(token, guardian, id, needy_users);
        if(response != null){
            history.push(`/guardians`)
        }
    }

    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validateOnChange: false,
        validationSchema : EditGuardianSchema,
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
                                        {needyUsers.needy_users &&
                                            <Grid item>
                                                <label>Hulpbehoevende(n)</label>
                                                <br></br>
                                                <Multiselect
                                                    options={needyUsers.needy_users}
                                                    selectedValues={startNeedyUsers}
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

export default EditGuardianPage;
