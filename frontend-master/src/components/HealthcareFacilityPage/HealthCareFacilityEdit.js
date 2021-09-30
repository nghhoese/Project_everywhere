import React, {useState, useContext, useEffect} from 'react';
import {Button, Grid, makeStyles, Paper, TextField, Typography, IconButton, Input} from "@material-ui/core";
import UserContext from '../../context/UserContext';
import {useHistory} from "react-router-dom";
import {useLocation} from "react-router";
import {Link} from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Alert from '@material-ui/lab/Alert';
import {EditHealthcareFacility, GetHealthcareFacility} from "../../data/healthcareFacilityData";
import * as Yup from "yup";
import {useFormik} from "formik";

const EditHealthcareFacilitySchema = Yup.object().shape({
    name: Yup.string().required('Verplicht'),
    kvkNumber: Yup.number().typeError("Dit is geen KvK nummer")
        .required('KvK nummer is verplicht!'),
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

function HealthCareFacilityEdit() {
    const classes = useStyles();
    const user_context = useContext(UserContext);
    let token = user_context.getToken();
    const [healthcareFacility, setHealthcareFacility] = useState();
    const history = useHistory();
    const location = useLocation();
    const id = location.state.params;

    const [initialValues = {
        name: '',
        kvkNumber: '',
        establishment: '',
        locationName: '',
        postalCode: '',
        houseNumber: '',
        place: '',
    }, setInitialValues] = useState();

    useEffect(async () => {
        let healthcareFacility = await GetHealthcareFacility(token, id);
        if (healthcareFacility != null) {
            setHealthcareFacility(healthcareFacility.healthcareFacility);

            const values = {
                name: healthcareFacility.healthcareFacility.name,
                kvkNumber: healthcareFacility.healthcareFacility.kvkNumber,
                establishment: healthcareFacility.healthcareFacility.establishment,
                locationName: healthcareFacility.healthcareFacility.locationName,
                postalCode: healthcareFacility.healthcareFacility.postalCode,
                houseNumber: healthcareFacility.healthcareFacility.houseNumber,
                place: healthcareFacility.healthcareFacility.place,
            }
            setInitialValues(values);
        } else {
            console.log("Healthcare facility not found");
        }
    }, []);

    const handleSubmit = async (values) => {
        const healthcareFacility = {
            name: values.name,
            kvkNumber: values.kvkNumber,
            establishment: values.establishment,
            locationName: values.locationName,
            postalCode: values.postalCode,
            houseNumber: values.houseNumber,
            place: values.place,
        }
        const response = await EditHealthcareFacility(token, healthcareFacility, id);
        if (response != null) {
            history.push(`/healthcarefacilities`)
        }

    }

    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validateOnChange: false,
        validationSchema: EditHealthcareFacilitySchema,
        onSubmit: values => {
            handleSubmit(values);
        },
    });

    return (
        <div>
            <Link to="/healthcarefacilities">
                <IconButton aria-label="back">
                    <ArrowBackIcon fontSize="large"/>
                </IconButton>
            </Link>
            {healthcareFacility &&
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
                                        Wijzig <strong>{healthcareFacility.name}</strong>
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <form onSubmit={formik.handleSubmit}>
                                        <Grid container direction="column" spacing={2}>
                                            <Grid item>
                                                <label>Naam*</label>
                                                <br></br>
                                                <TextField
                                                    type="text"
                                                    placeholder="Naam"
                                                    fullWidth
                                                    name="name"
                                                    variant="standard"
                                                    autoFocus
                                                    error={!!formik.errors.name}
                                                    onChange={formik.handleChange}
                                                    value={formik.values.name}
                                                    helperText={formik.errors.name}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <label>KvK Nummer*</label>
                                                <br></br>
                                                <Input
                                                    id="outlined-multiline-static"
                                                    type="number"
                                                    placeholder="KvK Nummer"
                                                    name="kvkNumber"
                                                    autoFocus
                                                    error={!!formik.errors.kvkNumber}
                                                    onChange={formik.handleChange}
                                                    value={formik.values.kvkNumber}
                                                    helperText={formik.errors.kvkNumber}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <label>Vestiging</label>
                                                <br></br>
                                                <TextField
                                                    type="text"
                                                    placeholder="Vestiging"
                                                    fullWidth
                                                    multiline
                                                    name="establishment"
                                                    variant="standard"
                                                    autoFocus
                                                    error={!!formik.errors.establishment}
                                                    onChange={formik.handleChange}
                                                    value={formik.values.establishment}
                                                    helperText={formik.errors.establishment}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <label>Locatie naam</label>
                                                <br></br>
                                                <TextField
                                                    type="text"
                                                    name="locationName"
                                                    variant="standard"
                                                    fullWidth
                                                    multiline
                                                    autoFocus
                                                    error={!!formik.errors.locationName}
                                                    onChange={formik.handleChange}
                                                    value={formik.values.locationName}
                                                    helperText={formik.errors.locationName}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <label>Postcode</label>
                                                <br></br>
                                                <TextField
                                                    type="text"
                                                    name="postalCode"
                                                    variant="standard"
                                                    fullWidth
                                                    multiline
                                                    autoFocus
                                                    error={!!formik.errors.postalCode}
                                                    onChange={formik.handleChange}
                                                    value={formik.values.postalCode}
                                                    helperText={formik.errors.postalCode}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <label>Huisnummer</label>
                                                <br></br>
                                                <TextField
                                                    type="text"
                                                    name="houseNumber"
                                                    variant="standard"
                                                    multiline
                                                    autoFocus
                                                    error={!!formik.errors.houseNumber}
                                                    onChange={formik.handleChange}
                                                    value={formik.values.houseNumber}
                                                    helperText={formik.errors.houseNumber}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <label>Plaats</label>
                                                <br></br>
                                                <TextField
                                                    type="text"
                                                    placeholder="Plaats"
                                                    name="place"
                                                    variant="standard"
                                                    autoFocus
                                                    error={!!formik.errors.place}
                                                    onChange={formik.handleChange}
                                                    value={formik.values.place}
                                                    helperText={formik.errors.place}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    type="submit"
                                                    className={classes.submitButton}
                                                >
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
            {!healthcareFacility &&
            <Alert severity="error">Er is iets mis gegaan bij het ophalen van de organisatie!</Alert>
            }
        </div>
    );
}

export default HealthCareFacilityEdit;
