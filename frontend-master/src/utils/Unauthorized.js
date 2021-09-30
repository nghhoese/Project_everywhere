import axios from 'axios';

export function UnauthorizedHandler(alert, redirect, logout) {
    axios.interceptors.response.use(function (response) {
        return response;
    }, function (error) {
        if(error.response.status === 401) {
            alert({title: 'Je token is verlopen', severity: 'warning'});
            redirect('/');
            logout();
        }
        return Promise.reject(error);
    });
}