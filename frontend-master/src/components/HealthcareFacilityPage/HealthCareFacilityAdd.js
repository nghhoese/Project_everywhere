import React, {useContext} from 'react';
import {Button, Grid, makeStyles, Paper, TextField, Typography} from "@material-ui/core";
import UserContext from '../../context/UserContext';
import {useHistory} from "react-router-dom";
import { AddHealthcareFacility } from '../../data/healthcareFacilityData'
import * as Yup from "yup";
import {useFormik} from "formik";

const AddHealthcareFacilitySchema = Yup.object().shape({
    name: Yup.string().required('Verplicht'),
    kvkNumber: Yup.number().typeError( "Dit is geen KvK nummer" )
        .required( 'KvK nummer is verplicht!' ),
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

function HealthCareFacilityAdd() {
    const classes = useStyles();
    const user_context = useContext(UserContext);
    let token = user_context.getToken();
    const history = useHistory();

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
        const response = await AddHealthcareFacility(token, healthcareFacility);
        if(response != null){
            history.push(`/healthcarefacilities`)
        }
    }

    const formik = useFormik({
        initialValues: {
            name: '',
            kvkNumber: '',
            establishment: '',
            locationName: '',
            postalCode: '',
            houseNumber: '',
            place: '',
        },
        validateOnChange: false,
        validationSchema : AddHealthcareFacilitySchema,
        onSubmit: values => {
            handleSubmit(values);
        },
    });

    return (
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
                                    Voeg een organisatie toe
                                </Typography>
                            </Grid>
                            <Grid item>
                                <form onSubmit={formik.handleSubmit}>
                                    <Grid container direction="column" spacing={2}>
                                        <Grid item>
                                            <TextField
                                                id="outlined-multiline-static"
                                                label="Naam"
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
                                            <TextField
                                                id="outlined-multiline-static"
                                                label="KvK nummer"
                                                type="number"
                                                placeholder="KvK nummer"
                                                name="kvkNumber"
                                                variant="standard"
                                                autoFocus
                                                error={!!formik.errors.kvkNumber}
                                                onChange={formik.handleChange}
                                                value={formik.values.kvkNumber}
                                                helperText={formik.errors.kvkNumber}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                id="outlined-multiline-static"
                                                label="Vestiging"
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
                                            <TextField
                                                id="outlined-multiline-static"
                                                label="Locatie naam"
                                                type="text"
                                                placeholder="Locatie naam"
                                                fullWidth
                                                multiline
                                                name="locationName"
                                                variant="standard"
                                                autoFocus
                                                error={!!formik.errors.locationName}
                                                onChange={formik.handleChange}
                                                value={formik.values.locationName}
                                                helperText={formik.errors.locationName}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                id="outlined-multiline-static"
                                                label="Postcode"
                                                type="text"
                                                placeholder="Postcode"
                                                multiline
                                                name="postalCode"
                                                variant="standard"
                                                autoFocus
                                                error={!!formik.errors.postalCode}
                                                onChange={formik.handleChange}
                                                value={formik.values.postalCode}
                                                helperText={formik.errors.postalCode}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                id="outlined-multiline-static"
                                                label="Huisnummer"
                                                type="text"
                                                placeholder="Huisnummer"
                                                name="houseNumber"
                                                variant="standard"
                                                autoFocus
                                                error={!!formik.errors.houseNumber}
                                                onChange={formik.handleChange}
                                                value={formik.values.houseNumber}
                                                helperText={formik.errors.houseNumber}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                id="outlined-multiline-static"
                                                label="Plaats"
                                                type="text"
                                                placeholder="Plaats"
                                                fullWidth
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

export default HealthCareFacilityAdd;
