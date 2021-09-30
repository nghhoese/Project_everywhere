import axios from 'axios';

export function getDayItems(needyUser) {
    return axios.get(`/day_items/needy_user/${needyUser._id}`);
}

export function postNewDayItem (dayItem, needyUser) {
    return axios.post(`/day_items/needy_user/${needyUser._id}`, { dayItem });
}

export function updateDayItem(_id, day, time, needyUser) {
    return axios.patch(`/day_items/update/${needyUser.id}`, { _id, day, time });
}

export function deleteDayItem(_id) {
    return axios.delete(`/day_items/${_id}`, { _id });
}

export function updateAdditionDayItem(_id, date, needyUser) {
    console.log(needyUser)
    return axios.patch("/day_items/update_addition", { _id, date, selectedNeedyUserId: needyUser._id });
}

export function deleteAdditionDayItem(_id, needyUser) {
    return axios.delete(`/day_items/${_id}/needy_user/${needyUser._id}`, { _id });
}
export function getHistoryDayitems(selectedNeedyUser) {
  return axios.get(`/day_items/needy_user/history/${selectedNeedyUser._id}`)
}

export function deleteWeekItem(_id, date) {
    return axios.post(`/day_items/${_id}/removal`, { date });
}

export function restoreDayItem(_id, removedItemId) {
    return axios.delete(`/day_items/${_id}/removals/${removedItemId}`);
}

export function getTasks(selectedNeedyUser) {
    return axios.get("/tasks", {
        params: {
            selectedNeedyUserId: selectedNeedyUser._id,
            template: false
        }
    });
}

export function getActiveWeekItems(needyUser) {
    return axios.get(`/day_items/get_active_week_day_items/needy_user/${needyUser._id}`);
}
