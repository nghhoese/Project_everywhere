import axios from "axios";

export function GetCategories() {
    return new Promise((resolve, reject) => {
        axios.get(`/categories`)
            .then((response) => {
                resolve(response.data);
            }).catch(error => {
                console.log(error);
            });
    });
}
export function AddCategory(token, category) {
    return new Promise((resolve, reject) => {
        axios.post(`/categories/`, category).then(res => {
            resolve(res.data);
        }).catch(error => {
            console.log(error);
        });
    });
}
export function GetCategory(id){
    return new Promise((resolve, reject) => {
        axios.get(`/categories/${id}`)
            .then((response) => {
                resolve(response.data);
            }).catch(error => {
            console.log(error);
        });
    });
}

export function EditCategory(id, categoryData){
    return new Promise((resolve, reject) => {
        axios.put(`/categories/${id}`, categoryData)
            .then((response) => {
                resolve(response.data);
            }).catch(error => {
            console.log(error);
        });
    });
}
export function DeleteCategory(id){
    return new Promise((resolve, reject) => {
        axios.delete(`/categories/${id}`)
            .then((response) => {
                resolve(response.data);
            }).catch(error => {
            console.log(error);
        });
    });
}
