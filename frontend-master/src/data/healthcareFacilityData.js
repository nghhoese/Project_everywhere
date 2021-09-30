import axios from "axios";

export function GetHealthcareFacilities(){
    return new Promise((resolve, reject) => {
        axios.get(`/healthcarefacilities`)
            .then((response) => {
                resolve(response.data);
            }).catch(error => {
            console.log(error);
        });
    });
}

export function DeleteHealthcareFacility(token, id){
    return new Promise((resolve, reject) => {
        axios.delete(`/healthcarefacilities/${id}`)
            .then((response) => {
                resolve(response.data);
            }).catch(error => {
            console.log(error);
        });
    });
}

export function AddHealthcareFacility(token, data) {
    return new Promise((resolve, reject) => {
        axios.post(`/healthcarefacilities`, {data}).then(res => {
            resolve(res.data);
        }).catch(error => {
            console.log(error);
        });
    });
}

export function EditHealthcareFacility(token, data, id) {
    return new Promise((resolve, reject) => {
        axios.put(`/healthcarefacilities/${id}`, {data}).then(res => {
            resolve(res.data);
        }).catch(error => {
            console.log(error);
        });
    });
}

export function GetHealthcareFacility(token, id){
    return new Promise((resolve, reject) => {
        axios.get(`/healthcarefacilities/${id}`)
            .then((response) => {
                resolve(response.data);
            }).catch(error => {
            console.log(error);
        });
    });
}