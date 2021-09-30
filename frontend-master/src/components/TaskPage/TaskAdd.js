import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import {
    Button,
    Divider,
    Grid,
    makeStyles,
    Paper,
    TextField,
    Typography,
    MenuItem, Select
} from "@material-ui/core";
import UserContext from "../../context/UserContext";
import axios from "axios";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { GetCategories } from "../../data/categoryData";
import SelectedUserContext from "../../context/SelectedUserContext";
import { AddTask } from "../../data/taskData";
import { AddTaskIcon } from "../../data/taskData";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Config from '../../config/config'

const useStyles = makeStyles((theme) => ({
    form: {
        justifyContent: 'center',
    },
    submitButton: {
        marginTop: theme.spacing(2),
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
    button: {
        marginBottom: theme.spacing(2),
    },
    subFormLabel: {
        marginTop: theme.spacing(2),
    },
    durationField: {
        width: "300px",
    }
}))

function TaskAdd() {
    const classes = useStyles();

    const history = useHistory();

    const user_context = useContext(UserContext);
    const selectedUser_context = useContext(SelectedUserContext)
    let token = user_context.getToken();
    const [categories, setCategories] = useState([{}])

    const [subTasksForms, setSubTaskForms] = useState([{}])
    useEffect(async () => {
        let response = await GetCategories(token);
        setCategories(response);

    }, []);
    let selectItemsList = [];
    categories.forEach((item, i) => {
        selectItemsList.push(<MenuItem value={item._id}>{item.name}<p style={{ "color": item.colour }}>●</p></MenuItem>)
    });

    if (!selectedUser_context.selectedNeedyUser) {
        history.push(`/tasks`)
    }

    const SubForms = () => {
        return subTasksForms.map((subTask, i) => (
            <Grid container direction="column" spacing={2} key={i}>
                <Grid item>
                    <Typography component="h2" variant="h6" className={classes.subFormLabel}>
                        {`Deel taak formulier: ${i + 1}`}
                    </Typography>
                </Grid>
                <Grid item>
                    <TextField
                        id={`sub-task-shortdescription=${i}`}
                        label="Kleine omschrijving"
                        type="text"
                        placeholder="Kleine omschrijving"
                        fullWidth
                        multiline
                        name={`sub-task-shortdescription=${i}`}
                        variant="outlined"
                        error={!!formik.errors["sub-task-shortdescription=" + i]}
                        onChange={formik.handleChange}
                        value={formik.values["sub-task-shortdescription=" + i]}
                        helperText={formik.errors["sub-task-shortdescription=" + i]}
                        autoFocus
                    />
                </Grid>
                <Grid item>
                    <TextField
                        id={`sub-task-longdescription=${i}`}
                        label="Grote omschrijving"
                        type="text"
                        placeholder="Grote omschrijving"
                        fullWidth
                        multiline
                        name={`sub-task-longdescription=${i}`}
                        variant="outlined"
                        error={!!formik.errors["sub-task-longdescription=" + i]}
                        onChange={formik.handleChange}
                        value={formik.values["sub-task-longdescription=" + i]}
                        helperText={formik.errors["sub-task-longdescription=" + i]}
                        autoFocus
                    />
                </Grid>
                <Grid item xs={6}>
                    Media:
                       <div>
                        <iframe src={`${Config.apiurl}/${subTask.media}`}
                            frameborder='0'
                            allowfullscreen
                            id={"mediaIframe" + i}
                            title='media'
                            style={{display: !!subTask.media ?"block": 'none'}} />
                    </div>
                    <input
                        accept="image/*,video/*,audio/*"
                        className={classes.input}
                        id={`contained-button-file=${i}`}
                        name={`contained-button-file=${i}`}
                        multiple
                        type="file"
                        onChange={(event) => {
                            formik.setFieldValue("subTaskFile=" + i, event.currentTarget.files[0]);
                            if (event.target.files && event.target.files[0]) {
                                document.querySelector("#mediaIframe" + i).src = URL.createObjectURL(event.target.files[0]);
                                document.querySelector("#mediaIframe" + i).style.display="block";
                            }

                        }}
                    />
                </Grid>
                <Grid item>
                    <TextField
                        className={classes.durationField}
                        id={`sub-task-duration=${i}`}
                        label="Duratie in seconden (0 is geen duratie)"
                        type="number"
                        placeholder="Duratie (in seconden)"
                        name={`sub-task-duration=${i}`}
                        InputProps={{
                            inputProps: {
                                min: 0
                            }
                        }}
                        error={!!formik.errors["sub-task-duration=" + i]}
                        onChange={formik.handleChange}
                        value={formik.values["sub-task-duration=" + i]}
                        helperText={formik.errors["sub-task-duration=" + i]}
                        autoFocus
                    />
                </Grid>
                <Grid item>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Progressbar oplopend</FormLabel>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox 
                                        onChange={formik.handleChange} 
                                        value={formik.values["sub-task-progressbar=" + i]} 
                                        name={`sub-task-progressbar=${i}`} />
                                }
                            />
                        </FormGroup>
                    </FormControl>
                </Grid>
                <Grid item>
                    <Button onClick={() => removeSubForm(i)} color="secondary" variant="contained" className={classes.button}>
                        Verwijder Deel taak formulier
                    </Button>
                </Grid>
                <Divider />
            </Grid>
        ))
    }

    const addSubForm = () => {
        setSubTaskForms([...subTasksForms, {}])
    }

    const removeSubForm = (i) => {
        let forms = [...subTasksForms];
        forms.splice(i, 1);
        setSubTaskForms(forms);
    }

    const handleSubmit = async values => {
        let taskObject = { name: values.name, category: values.category, template: values.template, taskItems: [], multifiles: [] }
        taskObject.icon = values["taskIcon"];
        // Loop through subTaskForms
        for (let i = 0; i < subTasksForms.length; i++) {
            let tempSubFormObject = { shortDescription: "", longDescription: "", media: "", duration: 0 }
            tempSubFormObject.shortDescription = values["sub-task-shortdescription=" + i];
            tempSubFormObject.longDescription = values["sub-task-longdescription=" + i];
            tempSubFormObject.duration = values["sub-task-duration=" + i];
            tempSubFormObject.progressbar = values["sub-task-progressbar=" + i] || false;
            if (values["subTaskFile=" + i] != null) {
                tempSubFormObject.media = true;
                taskObject.multifiles.push(values["subTaskFile=" + i]);
            }
            taskObject.taskItems.push(tempSubFormObject);
        }
        let formData = new FormData();
        let formDataIcon = new FormData();

        formData.append('name', taskObject.name);
        formDataIcon.append("taskIcon", taskObject.icon);

        if (taskObject.category) {
            formData.append("category", taskObject.category);
        }
        formData.append("template", taskObject.template);
        formData.append('taskItems', JSON.stringify(taskObject.taskItems));
        formData.append('selectedNeedyUser', selectedUser_context.selectedNeedyUser._id)

        for (let index = 0; index < taskObject.multifiles.length; index++) {
            formData.append('multi-files', taskObject.multifiles[index]);
        }

        const task = await AddTask(formData, token);
        const taskIcon = await AddTaskIcon(formDataIcon, token, task._id);
        history.push(`/tasks`)
    }
    let yupObject = {
        name: Yup.string().required('Verplicht'),
    };
    subTasksForms.forEach((item, i) => {
        yupObject["sub-task-shortdescription=" + i] = Yup.string().required('Verplicht');
        yupObject["sub-task-duration=" + i] = Yup.string().required('Verplicht');
    });

    const AddTaskSchema = Yup.object().shape(yupObject);
    let formikObject = {
        initialValues: {
            name: '',
            category: '',
            template: false,
        },
        validateOnChange: false,
        validationSchema: AddTaskSchema,
        onSubmit: values => {
            handleSubmit(values);
        },
    };
    subTasksForms.forEach((item, i) => {
        formikObject.initialValues["sub-task-shortdescription=" + i] = '';
        formikObject.initialValues["sub-task-longdescription=" + i] = '';
        formikObject.initialValues["sub-task-duration=" + i] = 0;
    });
    const formik = useFormik(formikObject);
    return (
        <div>
            <Grid direction="row">
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
                                    Maak een taak
                                </Typography>
                            </Grid>
                            <Grid item>
                                <form onSubmit={formik.handleSubmit}>
                                    <Grid container direction="column" spacing={2}>
                                        <Grid item>
                                            <TextField
                                                id="name"
                                                type="text"
                                                placeholder="Naam"
                                                fullWidth
                                                name="name"
                                                variant="outlined"
                                                error={!!formik.errors.name}
                                                onChange={formik.handleChange}
                                                value={formik.values.name}
                                                helperText={formik.errors.name}
                                                autoFocus
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            Icoon:
                                            <div>
                                                <iframe src={`${Config.apiurl}/${formik.values.taskIcontext}`}
                                                    frameborder='0'
                                                    allowfullscreen
                                                    id="iconIframe"
                                                    title="icon"
                                                    style={{display: !!formik.values.taskIcontext ?"block": 'none'}} />
                                            </div>
                                            <input
                                                accept="image/*"
                                                className={classes.input}
                                                id={`taskIcon`}
                                                name={`taskIcon`}
                                                single
                                                type="file"
                                                onChange={(event) => {
                                                    formik.setFieldValue("taskIcon", event.currentTarget.files[0]);
                                                    if (event.target.files && event.target.files[0]) {
                                                        document.querySelector("#iconIframe").src = URL.createObjectURL(event.target.files[0]);
                                                        document.querySelector("#iconIframe").style.display="block";
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Typography>
                                                Categorie
                                            </Typography>
                                            <Select id="category" name="category" label="Categorie"
                                                onChange={formik.handleChange}
                                                value={formik.values.category ?? ""}
                                                select>
                                                <MenuItem value="">Selecteer een categorie</MenuItem>
                                                {selectItemsList}
                                            </Select>
                                        </Grid>
                                        <Grid item >
                                            <FormControl component="fieldset">
                                                <FormLabel component="legend">Deel taak met anderen (Template)</FormLabel>
                                                <FormGroup>
                                                    <FormControlLabel
                                                        control={<Checkbox onChange={formik.handleChange}
                                                        value={formik.values.template} name="template" />}
                                                    />
                                                </FormGroup>
                                            </FormControl>
                                        </Grid>
                                        <Grid item>
                                            <Button onClick={addSubForm} color="primary" variant="contained" className={classes.button}>
                                                Voeg deel taak formulier toe
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    <Divider />
                                    {SubForms()}
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            type="submit"
                                            className={classes.submitButton}>
                                            Submit
                                        </Button>
                                    </Grid>
                                </form>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}

export default TaskAdd
