import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { Button, Divider, Grid, InputLabel, makeStyles, Paper, TextField, Typography, Select, MenuItem } from "@material-ui/core";
import axios from "axios";
import UserContext from "../../context/UserContext";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { GetCategories } from "../../data/categoryData";
import { GetTask,EditTask,EditTaskIcon } from "../../data/taskData";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { Label } from "@material-ui/icons";
import Config from '../../config/config'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
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

function TaskEdit() {
    const [initialValues, setInitialValues] = useState({});
    const classes = useStyles();

    const history = useHistory();

    const user_context = useContext(UserContext);
    let token = user_context.getToken();

    // Main Task id from url
    const { id } = useParams();

    const [mainTask, setMainTask] = React.useState({});
    const [mainTaskText, setMainTaskText] = React.useState("");
    const [iconTaskText, setIconTaskText] = React.useState("");

    const [subTasksForms, setSubTaskForms] = useState([{}]);
    const [categories, setCategories] = useState([{}]);
    const [category, setCategory] = useState({});
    let selectItemsList = [];

    for (let i = 0; i < categories.length; i++) {
        if (categories[i]._id === mainTask.category) {
            selectItemsList.push(<MenuItem value={categories[i]._id} select>{categories[i].name}<p style={{ "color": categories[i].colour }}>●</p></MenuItem>);
        } else {
            selectItemsList.push(<MenuItem value={categories[i]._id}>{categories[i].name}<p style={{ "color": categories[i].colour }}>●</p></MenuItem>);
        }

    }

    const SubForms = () => {
        return subTasksForms.map((subTask, i) => (
            <div className={classes.root}>
                <Grid
                    container
                    direction="column"
                    justify="center"
                    spacing={2}
                    className={classes.form}
                    key={i}>
                    <Grid item>
                        <Typography component="h2" variant="h6" className={classes.subFormLabel}>
                            {`Deel taak formulier: ${i + 1}`}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Grid container spacing={2}>
                            <Grid container spacing={2} item xs={6}>
                                <TextField
                                    id={`sub-task-shortdescription=${i}`}
                                    label="Kleine omschrijving"
                                    type="text"
                                    placeholder="Kleine omschrijving"
                                    fullWidth
                                    name={`sub-task-shortdescription=${i}`}
                                    variant="outlined"
                                    autoFocus
                                    error={!!formik.errors["sub-task-shortdescription=" + i]}
                                    onChange={formik.handleChange}
                                    value={formik.values["sub-task-shortdescription=" + i]}
                                    helperText={formik.errors["sub-task-shortdescription=" + i]}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    id={`sub-task-longdescription=${i}`}
                                    label="Grote omschrijving"
                                    type="text"
                                    placeholder="Grote omschrijving"
                                    fullWidth
                                    multiline
                                    name={`sub-task-longdescription=${i}`}
                                    variant="outlined"
                                    autoFocus
                                    error={!!formik.errors["sub-task-longdescription=" + i]}
                                    onChange={formik.handleChange}
                                    value={formik.values["sub-task-longdescription=" + i]}
                                    helperText={formik.errors["sub-task-longdescription=" + i]}
                                    InputLabelProps={{ shrink: true }}
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
                                <label>Duratie in seconden (0 is geen duratie)</label>
                                <br></br>
                                <TextField
                                    className={classes.durationField}
                                    id={`sub-task-duration=${i}`}
                                    type="number"
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
                                                checked={!!formik.values["sub-task-progressbar=" + i]}
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
                        </Grid>
                        <Divider />
                    </Grid>
                </Grid>
            </div>
        ))
    }

    const setSubFormText = (e, i, inputName) => {
        let temp = [...subTasksForms]
        temp[i][inputName] = e.target.value
        setSubTaskForms(temp)
    }

    const addSubForm = () => {
        setSubTaskForms([...subTasksForms, {}])
    }

    const removeSubForm = (i) => {
        let forms = [...subTasksForms];
        forms.splice(i, 1);
        setSubTaskForms(forms);
    }

    const handleSubmit = async e => {
        let taskObject = { name: e.name, category: e.category, template: e.template, taskItems: [], multifiles: [] }
        taskObject.icon = e["taskIcon"];

        // Loop through subTaskForms
        for (let i = 0; i < subTasksForms.length; i++) {
            let tempSubFormObject = { shortDescription: "", longDescription: "", media: "", newMedia: "" }

            tempSubFormObject.shortDescription = e["sub-task-shortdescription=" + i];
            tempSubFormObject.longDescription = e["sub-task-longdescription=" + i];
            tempSubFormObject.duration = e["sub-task-duration=" + i];
            tempSubFormObject.progressbar = e["sub-task-progressbar=" + i];
            if (e["subTaskFile=" + i] != null) {
                tempSubFormObject.newMedia = true;
                taskObject.multifiles.push(e["subTaskFile=" + i]);
            } else {
                tempSubFormObject.newMedia = false;
            }
            taskObject.taskItems.push(tempSubFormObject)
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
        for (let index = 0; index < taskObject.multifiles.length; index++) {
            formData.append('multi-files', taskObject.multifiles[index]);
        }
        const task = await EditTask(id, formData, token);
        const taskIcon = await EditTaskIcon(formDataIcon, token, task._id);

        history.push(`/tasks`)
    }

    let yupObject = {
        name: Yup.string().required('Verplicht'),
    };
    for (let i = 0; i < subTasksForms.length; i++) {
        yupObject["sub-task-shortdescription=" + i] = Yup.string().required('Verplicht');
        yupObject["sub-task-duration=" + i] = Yup.string().required('Verplicht');
    }
    const EditTaskSchema = Yup.object().shape(yupObject);

    let formikObject = {
        initialValues: initialValues,
        validateOnChange: false,
        enableReinitialize: true,
        validationSchema: EditTaskSchema,
        onSubmit: values => {
            handleSubmit(values);
        },
    };
    const formik = useFormik(formikObject);
    useEffect(async () => {
        let response = await GetTask(id, token);
        setMainTask(response)
        setMainTaskText(response.name)
        setSubTaskForms(response.taskItems)

        let response2 = await GetCategories(token);
        setCategories(response2);
        let values = {};
        values.name = response.name ?? '';
        values.taskIcon = response.icon;
        values.taskIcontext = response.icon;
        values.category = response.category;
        values.template = response.template;
        for (let i = 0; i < response.taskItems.length; i++) {
            values["sub-task-shortdescription=" + i] = response.taskItems[i].shortDescription;
            values["sub-task-longdescription=" + i] = response.taskItems[i].longDescription;
            values["sub-task-duration=" + i] = response.taskItems[i].duration ?? 0;
            values["sub-task-progressbar=" + i] = response.taskItems[i].progressbar;
        }
        console.log(values)
        setInitialValues(values);
    }, []);

    return (
        <div className={classes.root}>
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
                            Pas deze taak aan
                                </Typography>
                    </Grid>
                    <Grid item>
                        <form onSubmit={formik.handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
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
                                    <Select id="category" name="category" label="Categorie"
                                        onChange={formik.handleChange}
                                        value={formik.values.category ?? ''}>
                                        <MenuItem value="">Selecteer een categorie</MenuItem>
                                        {selectItemsList}
                                    </Select>
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
                                <Grid item >
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend">Deel taak met anderen (Template)</FormLabel>
                                        <FormGroup>
                                            <FormControlLabel
                                                control={<Checkbox checked={formik.values.template ?? false}
                                                    onChange={formik.handleChange}
                                                    value={formik.values.template} name="template" />}
                                            />
                                        </FormGroup>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Button onClick={addSubForm} color="primary" variant="contained" className={classes.button}>
                                    Voeg deel taak formulier toe
                                </Button>
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
        </div >
    )
}

export default TaskEdit
