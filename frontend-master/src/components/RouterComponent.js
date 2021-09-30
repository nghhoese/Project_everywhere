import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from './Navbar';
import TaskOverview from "./TaskPage/TaskOverview";
import { makeStyles } from "@material-ui/core";
import TaskAdd from "./TaskPage/TaskAdd";
import CategoryOverview from "./Categories/CategoriesOverview";
import CategoryAdd from "./Categories/CategoryAdd";
import CategoryEdit from "./Categories/CategoryEdit";
import TaskEdit from "./TaskPage/TaskEdit";
import Login from './LoginComponent'
import UserContext from '../context/UserContext';
import NeedyUserPage from './Users/NeedyUsers/NeedyUsersPage';
import AddUserPage from './Users/NeedyUsers/AddNeedyUserPage';
import EditUserPage from './Users/NeedyUsers/EditNeedyUserPage';
import CaregiversPage from './Users/Caregivers/CaregiversPage';
import AddCaregiversPage from './Users/Caregivers/AddCaregiverPage';
import EditCaregiversPage from './Users/Caregivers/EditCaregiver';
import GuardiansPage from './Users/Guardians/GuardiansPage';
import AddGuardiansPage from './Users/Guardians/AddGuardianPage';
import EditGuardiansPage from './Users/Guardians/EditGuardian';
import Scheduler from './Scheduler/Scheduler';
import HealthcareFacilityOverview from "./HealthcareFacilityPage/HealthcareFacilityOverview";
import HealthCareFacilityAdd from "./HealthcareFacilityPage/HealthCareFacilityAdd";
import HealthCareFacilityEdit from "./HealthcareFacilityPage/HealthCareFacilityEdit";
import FacilityManagersAdd from "./Users/FacilityManagers/FacilityManagersAdd";
import FacilityManagersEdit from "./Users/FacilityManagers/FacilityManagersEdit";
import FacilityManagersPage from "./Users/FacilityManagers/FacilityManagersPage";
import SchedulerReadOnly from './SchedulerReadOnly/SchedulerReadOnly';
import TemplatesOverview from "./TaskPage/TemplatesOverview";
import ProfilePage from './Users/ProfilePage';
import AdminPage from './AdminPage'
import { UnauthorizedHandler } from '../utils/Unauthorized';
import UncoupledUsersPage from './Users/UncoupledUsersPage'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}))

function RouterComponent() {
  const classes = useStyles();
  const user_context = useContext(UserContext);

  if (!user_context.user) return <Login />

  return (
    <Router>
      <div>
        <div className={classes.root}>
          <Navbar />
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Switch>
              <Route exact path="/categories">
                <CategoryOverview />
              </Route>
              <Route exact path="/categories/add">
                <CategoryAdd />
              </Route>
              <Route exact path="/categories/edit/:id">
                <CategoryEdit />
              </Route>
              <Route exact path="/tasks">
                <TaskOverview />
              </Route>
              <Route exact path="/tasks/add">
                <TaskAdd />
              </Route>
              <Route exact path="/tasks/edit/:id">
                <TaskEdit />
              </Route>
              <Route exact path="/tasks/templates">
                <TemplatesOverview />
              </Route>
              <Route path="/needyusers/add">
                <AddUserPage />
              </Route>
              <Route path="/needyusers/:id">
                <EditUserPage />
              </Route>
              <Route path="/needyusers">
                <NeedyUserPage />
              </Route>
              <Route path="/caregivers/add">
                <AddCaregiversPage />
              </Route>
              <Route path="/caregivers/:id">
                <EditCaregiversPage />
              </Route>
              <Route path="/caregivers">
                <CaregiversPage />
              </Route>
              <Route path="/guardians/add">
                <AddGuardiansPage />
              </Route>
              <Route path="/guardians/:id">
                <EditGuardiansPage />
              </Route>
              <Route path="/guardians">
                <GuardiansPage />
              </Route>
              <Route path="/facilitymanagers/add">
                <FacilityManagersAdd />
              </Route>
              <Route path="/facilitymanagers/:id">
                <FacilityManagersEdit />
              </Route>
              <Route path="/facilitymanagers">
                <FacilityManagersPage />
              </Route>
              <Route path="/scheduler">
                <Scheduler />
              </Route>
              <Route path="/schedulerreadonly">
                <SchedulerReadOnly />
              </Route>
              <Route path="/healthcarefacilities/add">
                <HealthCareFacilityAdd />
              </Route>
              <Route path="/healthcarefacilities/:id">
                <HealthCareFacilityEdit />
              </Route>
              <Route path="/healthcarefacilities">
                <HealthcareFacilityOverview />
              </Route>
              <Route path="/profile">
                <ProfilePage />
              </Route>
              <Route path="/admin">
                <AdminPage />
              </Route>
              {user_context.hasRole(["caregiver"]) && (
                        <Route exact path="/" component={TaskOverview} />
                      )}
              {user_context.hasRole(["guardian"]) && (
                        <Route exact path="/" component={SchedulerReadOnly} />
                        )}
              {user_context.hasRole(["admin"]) && (
                        <Route exact path="/" component={AdminPage} />
                        )}
              {user_context.hasRole(["facility_manager"]) && (
                        <Route exact path="/" component={HealthcareFacilityOverview} />
                        )}
              <Route path="/users/uncoupled">
                <UncoupledUsersPage />
              </Route>
         

            </Switch>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default RouterComponent;
