import { useState, useEffect, useContext } from 'react';
import WeekScheduler from './WeekScheduler/WeekScheduler';
import EditingTask from './WeekScheduler/EditingTask';
import UserContext from '../../context/UserContext';
import moment from 'moment';
import { postNewDayItem, updateDayItem, getActiveWeekItems, deleteAdditionDayItem, getTasks } from '../../data/schedulerData';
import selectedUser from '../../context/SelectedUserContext';

export default function WeekPage({tasks}) {
    const [dayItems, setDayItems] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [addComponentDate, setAddComponentDate] = useState();
    const selectedUserContext = useContext(selectedUser);

    const addNewTask = async (task, day, time) => {
        try {
            let formatedDate = moment().toDate();

            let dayItem = {
                day,
                time,
                active_since: formatedDate,
                active_till: null,
                item_removals: [],
                task: task._id
            }

            const result = await postNewDayItem(dayItem, selectedUserContext.selectedNeedyUser)
            setDayItems([...dayItems, {...result.data, group: 0}]);
        } catch(error) {
            console.log(error)
        }
    }

    const editTask = (task) => {
        setEditingTask(task);
    }

    const changeTask = async (day, time) => {
        setEditingTask(null);
        
        try {
            await updateDayItem(editingTask._id, day, time, selectedUserContext.selectedNeedyUser)
            setDayItems([...dayItems.filter(t => t._id !== editingTask._id), {...editingTask, day, time, group: 0}]);
        } catch(error) {
            console.log(error)
        }

        setEditingTask(null);
    }

    const getDayItems = async () => {
        // If no needy user is selected
        if(!Boolean(selectedUserContext.selectedNeedyUser)) {
            setDayItems([]);
            return;
        }

        try {
            const result = await getActiveWeekItems(selectedUserContext.selectedNeedyUser);

            result.data = result.data.map(item => { return {...item, group: 0, background: "#d52525"}})
            setDayItems(result.data)
        } catch (error) {
            console.log(error);
        }
    }

    const deleteDayItemUrl = async (_id) => {
        try {
            await deleteAdditionDayItem(_id, selectedUserContext.selectedNeedyUser);
            setDayItems([...dayItems.filter(t => t._id !== _id)]);
        } catch(error) {
            console.log(error);
        }
    }
    
    const openAddTask = (day, time) => {
        setAddComponentDate({day, time});
    }

    useEffect(() => {
        getDayItems();
    }, [selectedUserContext.selectedNeedyUser]);

    return (
        <div>
            <EditingTask editingTask={editingTask} setEditingTask={setEditingTask} changeTask={changeTask} />
            <WeekScheduler 
                dayItems={dayItems}
                setDayItems={setDayItems}
                tasks={tasks}
                editTask={editTask}
                deleteTaskUrl={deleteDayItemUrl}
                addNewTask={addNewTask}
                updateDayItem={updateDayItem}/>
        </div>
    )
}