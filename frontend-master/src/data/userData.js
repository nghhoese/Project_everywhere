import axios from "axios";

export function GetUser(token, userId) {
    return new Promise((resolve, reject) => {
        axios.get(`/users/${userId}`).then(res => {
            resolve(res.data);
        }).catch(error => {

            console.log(error);
        });
    });
}

export function getUsers(){
    return new Promise((resolve, reject) => {
        axios.get(`/users`)
            .then((response) => {
                resolve(response.data);
            }).catch(error => {
            console.log(error);
        });
    });
}

export function getUsersByRole(role){
    return new Promise((resolve, reject) => {
        axios.get(`/users?role=${role}`)
            .then((response) => {
                resolve(response.data);
            }).catch(error => {
            console.log(error);
        });
    });
}

export function DeleteUser(token, userId){
    return new Promise((resolve, reject) => {
        axios.delete(`/users/${userId}`)
            .then((response) => {
                resolve(response.data);
            }).catch(error => {
            console.log(error);
        });
    });
}

export function AddFacilityManager(token, user) {
    return new Promise((resolve, reject) => {
        axios.post(`/facilitymanagers/`, {user: user}).then(res => {
            resolve(res.data);
        }).catch(error => {
            console.log(error);
        });
    });
}

export function EditFacilityManager(token, user, id) {
    return new Promise((resolve, reject) => {
        axios.put(`/facilitymanagers/${id}`, {user: user}).then(res => {
            resolve(res.data);
        }).catch(error => {
            console.log(error);
        });
    });
}

export function GetNeedyUsersFromCaregiver() {
    return new Promise((resolve, reject) => {
        axios.get(`/caregivers/needyusers`).then(res => {
            resolve(res.data);
        }).catch(error => {
            console.log(error);
        });
    });
}

export function GetGuardiansFromCaregiver() {
    return new Promise((resolve, reject) => {
        axios.get(`/caregivers/guardians`).then(res => {
            resolve(res.data);
        }).catch(error => {
            console.log(error);
        });
    });
}

export function getGuardians(){
    return new Promise((resolve, reject) => {
        axios.get(`/users?role=guardian`)
        .then((response) => {
            resolve(response.data);
        }).catch(error => {
            console.log(error);
        });
    });
}

export function AddGuardian(token, user, needy_users) {
    return new Promise((resolve, reject) => {
        axios.post(`/guardians/`, {user: user, needy_users: needy_users}).then(res => {
            resolve(res.data);
        }).catch(error => {
            console.log(error);
        });
    });
}

export function EditGuardian(token, user, id, needy_users) {
    return new Promise((resolve, reject) => {
        axios.put(`/guardians/${id}`, {user: user, needy_users: needy_users}).then(res => {
            resolve(res.data);
        }).catch(error => {
            console.log(error);
        });
    });
}

export function GetNeedyUserGuardians(token, id){
    return new Promise((resolve, reject) => {
        axios.get(`/needyusers/${id}/guardians`).then(res => {
            resolve(res.data);
        }).catch(error => {
            console.log(error);
        });
    });
}

export function GetNeedyUsersFromGuardian(){
    return new Promise((resolve, reject) => {
        axios.get(`/guardians/needyusers`).then(res => {
            resolve(res.data);
        }).catch(error => {
            console.log(error);
        });
    });
}

export function getNeedyUsers(){
    return new Promise((resolve, reject) => {
        axios.get(`/users?role=needy_user`)
        .then((response) => {
            resolve(response.data);
        }).catch(error => {
            console.log(error);
        });
    });
}

export function AddNeedyUser(token, user) {
    return new Promise((resolve, reject) => {
        axios.post(`/needyusers/`, {user: user}).then(res => {
            resolve(res.data);
        }).catch(error => {
            console.log(error);
        });
    });
}

export function EditNeedyUser(token, user, id) {
    return new Promise((resolve, reject) => {
        axios.put(`/needyusers/${id}`, {user: user}).then(res => {
            resolve(res.data);
        }).catch(error => {
            console.log(error);
        });
    });
}

export function getCaregivers(){
    return new Promise((resolve, reject) => {
        axios.get(`/caregivers`)
        .then((response) => {
            resolve(response.data);
        }).catch(error => {
            console.log(error);
        });
    });
}

export function AddCaregiver(token, user) {
    return new Promise((resolve, reject) => {
        axios.post(`/caregivers/`, {user: user}).then(res => {
            resolve(res.data);
        }).catch(error => {
            console.log(error);
        });
    });
}

export function EditCaregiver(token, user, id) {
    return new Promise((resolve, reject) => {
        axios.put(`/caregivers/${id}`, {user: user}).then(res => {
            resolve(res.data);
        }).catch(error => {
            console.log(error);
        });
    });
}

export function GetProfile() {
    return new Promise((resolve, reject) => {
        axios.get(`/users/profile`).then(res => {
            resolve(res.data);
        }).catch(error => {
            console.log(error);
        });
    });
}

export function GetUsersCount() {
    return new Promise((resolve, reject) => {
        axios.get(`/users/count`).then(res => {
            resolve(res.data);
        }).catch(error => {
            console.log(error);
        });
    });
}

export function GetUncoupledUsers(){
    return new Promise((resolve, reject) => {
        axios.get(`/needyusers/uncoupled`).then(res => {
            resolve(res.data);
        }).catch(error => {
            console.log(error);
        });
    });
}

export function ConnectNeedyUser(token, needyUser, caregiver){
    return new Promise((resolve, reject) => {
        axios.post(`/needyusers/connect`, {needyUser: needyUser, caregiver: caregiver}).then(res => {
            resolve(res.data);
        }).catch(error => {
            console.log(error);
        });
    });
}