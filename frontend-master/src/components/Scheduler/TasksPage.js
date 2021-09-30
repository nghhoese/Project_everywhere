import { useEffect, useState, useContext } from 'react';
import TaskScheduler from './TaskScheduler/TaskScheduler';
import moment from 'moment';
import EditTask from './TaskScheduler/EditTask';
import UserContext from '../../context/UserContext';
import { postNewDayItem, updateAdditionDayItem, deleteDayItem, getDayItems, deleteWeekItem, restoreDayItem, getTasks } from '../../data/schedulerData';
import selectedUser from '../../context/SelectedUserContext';

export default function TasksPage({tasks}) {

    const [dayItems, setDayItems] = useState([]);

    const [editingTask, setEditingTask] = useState(null);
    const [standardDate, setStandardDate] = useState(null);
    const user_context = useContext(UserContext);
    const selectedUserContext = useContext(selectedUser);

    const addNewTask = async (task, date, time) => {
        let dayItemsArray = [...dayItems];
        let day = moment(date).day();
        let [hour, minute] = time.split(':');
        let formatedDate = moment(date).set({ "hour": hour, "minute": minute }).toDate();
        
        let dayItem = {
            day: task.day,
            time: task.time,
            active_since: formatedDate,
            active_till: formatedDate,
            item_removals: [],
            task: task._id
        }

        try {
            const result = await postNewDayItem(dayItem, selectedUserContext.selectedNeedyUser)
            dayItemsArray.push({...result.data, group: 0});
            setDayItems(dayItemsArray);
        } catch(error) {
            console.log(error)
        }
    }

    const editTask = (task) => {
        setEditingTask(task);
    }

    const changeTask = async (selectedDate, time) => {
        const [hour, minutes] = time.split(':');
        const date = moment(selectedDate).set('hour', hour).set('minute', minutes).set('second', 0);

        try {
            await updateAdditionDayItem(editingTask._id, date, selectedUserContext.selectedNeedyUser)
            setDayItems([...dayItems.filter(i => i._id !== editingTask._id), {...editingTask, active_since: date, active_till: date, group: 0}]);
        } catch(error) {
            console.log(error)
        }

        setEditingTask(null);
    }

    const deleteDayItemFunc = async (_id) => {
        try {
            await deleteDayItem(_id);
            setDayItems([...dayItems.filter(t => t._id !== _id)]);
        } catch(error) {
            console.log(error);
        }
    }

    const openAddTask = (date) => {
        setStandardDate(date);
    }

    const fetchDayItems = async () => {
        // If no needy user is selected
        if(!Boolean(selectedUserContext.selectedNeedyUser)) {
            setDayItems([]);
            return;
        }

        try {
            const result = await getDayItems(selectedUserContext.selectedNeedyUser);

            result.data = result.data.map(item => { return {...item, group: 0}});
            setDayItems(result.data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchDayItems();
    }, [selectedUserContext.selectedNeedyUser]);

    return (
        <div>
            <EditTask
                changeTask={changeTask}
                editingTask={editingTask}
                setEditingTask={setEditingTask}
            />
            <TaskScheduler
                dayItems={dayItems}
                setDayItems={setDayItems}
                editTask={editTask}
                openAddTask={openAddTask}
                deleteDayItem={deleteDayItemFunc}
                deleteWeekItem={deleteWeekItem}
                restoreDayItem={restoreDayItem}
                tasks={tasks}
                addNewTask={addNewTask}
                updateAdditionDayItem={updateAdditionDayItem}
            />
        </div>
    )
}