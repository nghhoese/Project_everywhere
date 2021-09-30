import React, {useContext, useEffect} from 'react';
import {Button, Grid, makeStyles, Paper, TextField, Typography} from "@material-ui/core";
import UserContext from '../../context/UserContext';
import {useHistory} from "react-router-dom";
import {useFormik} from 'formik';
import {useParams} from 'react-router-dom';
import * as Yup from 'yup';
import {SketchPicker} from 'react-color'
import {GetCategory, EditCategory} from "../../data/categoryData";

const AddCategorySchema = Yup.object().shape({
    color: Yup.string().required('Verplicht'),
    name: Yup.string().required('Verplicht'),
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

function EditCategoryPage() {
    const classes = useStyles();
    const user_context = useContext(UserContext);
    let token = user_context.getToken();
    const history = useHistory();
    const {id} = useParams();
    const handleSubmit = async (values) => {
        const category =
            {
                name: values.name,
                colour: values.color
            }
        let response = await EditCategory(id, category, token);
        if (response != null) {
            history.push(`/categories`)
        }
    }

    const formik = useFormik({
        initialValues: {
            name: "",
            color: "",
        },
        validateOnChange: false,
        validationSchema: AddCategorySchema,
        onSubmit: values => {
            handleSubmit(values);
        },
    });
    useEffect(async () => {
        let response = await GetCategory(id, token);
        formik.setFieldValue('name', response.name);
        formik.setFieldValue('color', response.colour);
    }, []);
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
                                    Voeg een categorie toe
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
                                            <label htmlFor="color">Kleur</label>
                                            <SketchPicker
                                                name="color"
                                                label="kleur"
                                                error={!!formik.errors.color}
                                                onChange={color => formik.setFieldValue('color', color.hex)}
                                                helperText={formik.errors.color}
                                                color={formik.values.color}
                                                value={formik.values.color}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                type="submit"
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

export default EditCategoryPage;
