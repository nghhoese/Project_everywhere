import {useContext, useState, useEffect} from 'react';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import TaskPage from './TasksPage';
import WeekPage from './WeekPage';
import ExportPage from './ExportPage';
import selectedUser from '../../context/SelectedUserContext';
import { getTasks } from '../../data/schedulerData';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import SearchIcon from '@material-ui/icons/Search';


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`scrollable-force-tabpanel-${index}`}
        aria-labelledby={`scrollable-force-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            {children}
          </Box>
        )}
      </div>
    );
}

let taskArray = [];

export default function DisabledTabs() {

  const [value, setValue] = useState(0);
  const selectedUserContext = useContext(selectedUser);
  const [tasks, setTasks] = useState([]);
  const [searchText, setSearchText] = useState("");
  

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchTasks = async () => {
    try {
        const result = await getTasks(selectedUserContext.selectedNeedyUser);
        if(result?.data) {
          setTasks(result.data);
          taskArray = result.data;
        }
    } catch(error) {
        console.log(error);
    }
  }

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
    setTasks(
      taskArray.filter(t => {
        const name = t.name.toUpperCase();
        const search = event.target.value.toUpperCase();
        return name.includes(search);
      })
    );
  }

  useEffect(() => {
    fetchTasks();
  }, [selectedUserContext.selectedNeedyUser]);

  return (
    <>
      {
        Boolean(selectedUserContext.selectedNeedyUser) ?
        <div style={{display: "flex"}}>
          <Paper square style={{marginRight: "10px", padding: "10px", maxHeight: "1000px", overflowY: "auto"}}>

            <FormControl style={{display: "block", marginBottom: "10px"}}>
              <InputLabel htmlFor="input-with-icon-adornment">Zoeken</InputLabel>
              <Input
                type="search"
                id="input-with-icon-adornment"
                value={searchText}
                onChange={handleSearchTextChange}
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                }
              />
            </FormControl>
            {
              tasks.length ? 
              tasks.map((t, i) => 
                <Card style={{padding: "10px", marginBottom: "5px", cursor: "grab"}} key={i} draggable="true" onDragStart={(e) => {e.dataTransfer.setData("taskId", t._id); e.dataTransfer.setData("type", "newItem");}}>
                  <Typography variant="caption" gutterBottom>
                  {t.name}
                  </Typography>
                    
                </Card>
              ) :
              <Typography variant="caption" gutterBottom>
                Geen taken gevonden
              </Typography>
            }
          </Paper>
          <Paper square style={{flex: "1"}}>
            <Tabs
              value={value}
              indicatorColor="primary"
              textColor="primary"
              onChange={handleChange}
              aria-label="disabled tabs example"
              >
              <Tab label="Agenda" />
              <Tab label="Week schema" />
              <Tab label="Exporteer Geschiedenis" />
            </Tabs>
            <TabPanel value={value} index={0}>
              <TaskPage tasks={tasks}/>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <WeekPage tasks={tasks}/>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <ExportPage />
            </TabPanel>
          </Paper>
        </div> :
        <div style={{display: "flex", alignItems: "flex-end"}}>
          <img style={{width: "200px", opacity: 0.3, marginLeft: "50px", padding: "0px 10px 15px 0px"}} src="./assets/arrow.png"></img>
          <p style={{fontFamily: "'Indie Flower', cursive", fontSize: "30px", color: "gray", margin: "0"}}>Selecteer hulpbehoevende</p>
        </div>
      }
    </>
  );
}
