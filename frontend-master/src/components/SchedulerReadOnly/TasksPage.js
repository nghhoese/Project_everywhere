import { useEffect, useState, useContext } from 'react';
import TaskScheduler from './TaskScheduler/TaskScheduler';
import AddTask from './TaskScheduler/AddTask';
import moment from 'moment';
import EditTask from './TaskScheduler/EditTask';
import UserContext from '../../context/UserContext';
import { postNewDayItem, updateAdditionDayItem, deleteAdditionDayItem, getDayItems, deleteWeekItem, restoreDayItem } from '../../data/schedulerData';
import selectedUser from '../../context/SelectedUserContext';

export default function TasksPage() {

    const [dayItems, setDayItems] = useState([]);

    const [editingTask, setEditingTask] = useState(null);
    const [standardDate, setStandardDate] = useState(null);
    const user_context = useContext(UserContext);
    const selectedUserContext = useContext(selectedUser);

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
            <TaskScheduler
                dayItems={dayItems}
                setDayItems={setDayItems}
            />
        </div>
    )
}