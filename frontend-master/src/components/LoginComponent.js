import React, {useState, useContext, useEffect} from 'react';
import { Button, TextField, Grid, Paper, Typography } from "@material-ui/core";
import '../css/loginComponent.css';
import axios from 'axios';
import UserContext from '../context/UserContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import SelectedUserContext from "../context/SelectedUserContext";
import AlertContext from '../context/AlertContext';

 const SignInSchema = Yup.object().shape({
  password: Yup.string().required('Verplicht'),
  username: Yup.string().email('Ongeldig Email Adres').required('Verplicht'),
});

function loginUser(email, password, alert){
    return new Promise((resolve, reject) => {
        axios.post(`/users/login`, {email, password})
        .then((res) => {
            resolve(res.data);
            alert({title: `Welkom ${res.data.user.firstname}`, severity: 'success'})
        }).catch(error => {
            console.log(error);
            console.log(error.response)
            if(error.response.status === 404) {
                alert({title: 'Email en wachtwoord combinatie niet gevonden', severity: 'warning'})
            }
        });
    });
}

function LoginByToken(token) {
    return new Promise((resolve, reject) => {
        axios.post(`/users/loginByToken`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            resolve(res.data);
        }).catch(reject)
    });
}

function Login() {
    const user_context = useContext(UserContext);
    const {alert} = useContext(AlertContext);
    const selectedUser_context = useContext(SelectedUserContext);
    const [autologinInProgess, setAutologinInProgess] = useState(false);
    const handleSubmit = async (values) => {
        const {user, token, needyUsers} = await loginUser(values.username, values.password, alert);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        user_context.setUser(user);
        selectedUser_context.setNeedyUsers(needyUsers)
        user_context.saveToken(token);
    }
    const formik = useFormik({
      initialValues: {
      password: '',
      username: '',
      },
      validateOnChange: false,
      validationSchema : SignInSchema,
      onSubmit: values => {
        handleSubmit(values);
      },
    });
    useEffect(async () => {
        const token = user_context.getToken();

        if(token) {
            setAutologinInProgess(true)
            LoginByToken(token).then(({user, needyUsers}) => {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                user_context.setUser(user);
                selectedUser_context.setNeedyUsers(needyUsers)
            }).finally(() => {
                setAutologinInProgess(false)
            });
        }
    }, []);

    if (autologinInProgess) return null;

    return (
        <div>
            <Grid container spacing={0} justify="center" direction="row">
                <Grid item>
                    <Grid
                        container
                        direction="column"
                        justify="center"
                        spacing={2}
                        className="login-form">
                        <Paper
                            variant="elevation"
                            elevation={2}
                            className="login-background">
                            <Grid item>
                                <Typography component="h1" variant="h5">
                                    Log in
                                </Typography>
                            </Grid>
                            <Grid item>
                                <form onSubmit={formik.handleSubmit}>
                                    <Grid container direction="column" spacing={2}>
                                        <Grid item>
                                            <TextField
                                                //type="email"
                                                placeholder="Email"
                                                fullWidth
                                                name="username"
                                                variant="outlined"
                                                autoFocus
                                                error={!!formik.errors.username}
                                                onChange={formik.handleChange}
                                                value={formik.values.username}
                                                helperText={formik.errors.username}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                type="password"
                                                placeholder="Password"
                                                fullWidth
                                               error={!!formik.errors.password}
                                                name="password"
                                                variant="outlined"
                                                onChange={formik.handleChange}
                                                value={formik.values.password}
                                                helperText={formik.errors.password}
                                            />
                                        </Grid>

                                        <Grid item>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                type="submit"
                                                className="button-block">
                                                Inloggen
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

export default Login;
