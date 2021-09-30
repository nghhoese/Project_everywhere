import axios from "axios";

export function GetMainTasks(token, selectedNeedyUserId, template) {
    return new Promise((resolve, reject) => {
        axios.get(`/tasks`, {
            params: {
                selectedNeedyUserId: selectedNeedyUserId,
                template: template
            }
        })
            .then((response) => {
                resolve(response.data);
            }).catch(error => {
                console.log(error);
            });
    });
}

export function AddTask(taskData) {
    return new Promise((resolve, reject) => {
        axios.post(`/tasks`, taskData)
            .then((response) => {
                resolve(response.data);
            }).catch(error => {
                console.log(error);
            });
    });
}

export function AddTaskIcon(taskData, token, id) {
    return new Promise((resolve, reject) => {
        axios.put(`/tasks/${id}/icon`, taskData)
            .then((response) => {
                resolve(response.data);
            }).catch(error => {
                console.log(error);
            });
    });
}

export function DeleteTask(id) {
    return new Promise((resolve, reject) => {
        axios.delete(`/tasks/${id}`)
            .then((response) => {
                resolve(response.data);
            }).catch(error => {
                console.log(error);
            });
    });
}

export function addSharedTask(token, shareTaskId, selectedNeedyUsers) {
    return new Promise((resolve, reject) => {
        axios.post(`/tasks/template`, selectedNeedyUsers, {
            params: {
                shareTaskId: shareTaskId,
            }
        })
            .then((response) => {
                resolve(response.data);
            }).catch(error => {
            console.log(error);
        });
    });
}
export function GetTask(id) {
    return new Promise((resolve, reject) => {
        axios.get(`/tasks/${id}`)
            .then((response) => {
                resolve(response.data);
            }).catch(error => {
                console.log(error);
            });
    });
}
export function EditTask(id, taskData) {
    return new Promise((resolve, reject) => {
        axios.put(`/tasks/${id}`, taskData)
            .then((response) => {
                resolve(response.data);
            }).catch(error => {
                console.log(error);
            });
    });
}

export function EditTaskIcon(taskData, token, id) {

    return new Promise((resolve, reject) => {
        axios.put('/tasks/' + id + '/icon', taskData)
            .then((response) => {
                resolve(response.data);
            }).catch(error => {
                console.log(error);
            });
    });
}
