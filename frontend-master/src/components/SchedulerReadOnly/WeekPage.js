import { useState, useEffect, useContext } from 'react';
import WeekScheduler from './WeekScheduler/WeekScheduler';
import AddTask from './WeekScheduler/AddTaskWeekschedule';
import EditingTask from './WeekScheduler/EditingTask';
import UserContext from '../../context/UserContext';
import moment from 'moment';
import { postNewDayItem, updateDayItem, getActiveWeekItems, deleteAdditionDayItem } from '../../data/schedulerData';
import selectedUser from '../../context/SelectedUserContext';

export default function WeekPage() {
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [addComponentDate, setAddComponentDate] = useState();
    const selectedUserContext = useContext(selectedUser);

    const getDayItems = async () => {
        // If no needy user is selected
        if(!Boolean(selectedUserContext.selectedNeedyUser)) {
            setTasks([]);
            return;
        }

        try {
            const result = await getActiveWeekItems(selectedUserContext.selectedNeedyUser);

            result.data = result.data.map(item => { return {...item, group: 0, background: "#d52525"}})
            setTasks(result.data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getDayItems();
    }, [selectedUserContext.selectedNeedyUser]);

    return (
        <div>
            <WeekScheduler tasks={tasks} setTasks={setTasks} />
        </div>
    )
}