import {useContext, useState} from 'react';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import TaskPage from './TasksPage';
import WeekPage from './WeekPage';
import selectedUser from '../../context/SelectedUserContext';

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

export default function DisabledTabs() {
  const [value, setValue] = useState(0);
  const selectedUserContext = useContext(selectedUser);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      {
        Boolean(selectedUserContext.selectedNeedyUser) ?
        <Paper square>
          <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleChange}
            aria-label="disabled tabs example"
          >
            <Tab label="Agenda" />
            <Tab label="Week schema" />
          </Tabs>
          <TabPanel value={value} index={0}>
            <TaskPage/>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <WeekPage />
          </TabPanel>
        </Paper> :
        <div style={{display: "flex", alignItems: "flex-end"}}>
          <img style={{width: "200px", opacity: 0.3, marginLeft: "50px", padding: "0px 10px 15px 0px"}} src="./assets/arrow.png"></img>
          <p style={{fontFamily: "'Indie Flower', cursive", fontSize: "30px", color: "gray", margin: "0"}}>Selecteer hulpbehoevende</p>
        </div>
      }
    </>
  );
}