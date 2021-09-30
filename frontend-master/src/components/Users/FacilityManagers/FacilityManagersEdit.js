import React, {useState, useContext, useEffect} from 'react';
import {
    Button,
    Grid,
    makeStyles,
    Paper,
    TextField,
    Typography,
    IconButton,
    InputLabel,
    Select
} from "@material-ui/core";
import UserContext from '../../../context/UserContext';
import {useHistory} from "react-router-dom";
import {useLocation} from "react-router";
import moment from 'moment';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Alert from '@material-ui/lab/Alert';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {EditFacilityManager, GetUser} from "../../../data/userData";
import FormControl from "@material-ui/core/FormControl";
import {GetHealthcareFacilities} from "../../../data/healthcareFacilityData";

const EditFacilityManagerSchema = Yup.object().shape({
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

function FacilityManagersEdit() {
    const classes = useStyles();
    const user_context = useContext(UserContext);
    let token = user_context.getToken();
    const [user, setUser] = useState();
    const history = useHistory();
    const location = useLocation();
    const id = location.state.params;
    const [healthcareFacilities, setHealthcareFacilities] = useState([]);
    const [selectedFacility, setSelectedFacility] = useState("");

    const [initialValues = {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        birthday: '',
        phone: '',
    }, setInitialValues] = useState();

    useEffect(async () => {
        let facilityManager = await GetUser(token, id);
        let facilities = await GetHealthcareFacilities(token);
        if(facilityManager != null){
            setUser(facilityManager);
            setSelectedFacility(facilityManager.user.organisationId);
            const values= {
                firstname: facilityManager.user.firstname,
                lastname: facilityManager.user.lastname,
                email: facilityManager.user.email,
                birthday: moment(facilityManager.user.birthday).format('YYYY-MM-DD'),
                phone: facilityManager.user.phone,
            }
            setInitialValues(values);
        }
        else{
            console.log("Facility manager not found");
        }
        if(facilities != null){
            setHealthcareFacilities(facilities.healthcareFacilities);
        }
        else{
            console.log("Facilities not found");
        }
    }, []);

    const handleSubmit = async (values) => {
        const facilityManager =
            {
                firstname: values.firstname,
                lastname: values.lastname,
                email: values.email,
                password: values.password,
                birthday: values.birthday,
                phone: values.phone,
                password: values.password,
                organisationId: selectedFacility,
            }
        const response = await EditFacilityManager(token, facilityManager, id);
        if(response != null){
            history.push(`/facilitymanagers`)
        }
    }

    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validateOnChange: false,
        validationSchema : EditFacilityManagerSchema,
        onSubmit: values => {
            handleSubmit(values);
        },
    });

    return (
        <div>
            <Link to="/facilitymanagers" >
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
                                        <Grid item>
                                            <FormControl>
                                                <InputLabel shrink htmlFor="select-multiple-native">
                                                    Organisatie
                                                </InputLabel>
                                                <Select
                                                    native
                                                    value={selectedFacility}
                                                    onChange={e => setSelectedFacility(e.target.value)}
                                                    inputProps={{
                                                        id: 'select-native',
                                                    }}
                                                >
                                                    {healthcareFacilities && Object.values(healthcareFacilities).map((facility, i) => (
                                                        <option key={i} id={facility._id} value={facility._id}>
                                                            {facility.name}
                                                        </option>
                                                    ))}
                                                </Select>
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

export default FacilityManagersEdit;
