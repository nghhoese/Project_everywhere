import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import clsx from "clsx";
import {
    AppBar, CssBaseline,
    Divider,
    Drawer,
    IconButton,
    List, ListItem, ListItemIcon, ListItemText,
    makeStyles,
    Menu,
    MenuItem, TextField,
    Toolbar,
    Typography, useTheme
} from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";
import MenuIcon from '@material-ui/icons/Menu';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import AssignmentIcon from '@material-ui/icons/Assignment';
import UserContext from '../context/UserContext';
import SelectedUserContext from "../context/SelectedUserContext";
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import BusinessIcon from '@material-ui/icons/Business';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import PersonIcon from '@material-ui/icons/Person';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import {GetNeedyUsersFromCaregiver, GetNeedyUsersFromGuardian} from "../data/userData";
import {useHistory} from "react-router-dom";
import BarChartIcon from '@material-ui/icons/BarChart';
import AlertContext from '../context/AlertContext';
import { UnauthorizedHandler } from '../utils/Unauthorized';
import {Autocomplete} from "@material-ui/lab";
import FormControl from "@material-ui/core/FormControl";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    drawerTitle: {
        alignItems: 'center',
        textAlign: 'center',
        fontSize: '14px'
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        flexGrow: 1,
        display: 'inline-block',
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    inputRoot: {
        color: "white",
        // This matches the specificity of the default styles at https://github.com/mui-org/material-ui/blob/v4.11.3/packages/material-ui-lab/src/Autocomplete/Autocomplete.js#L90
        '&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-child': {
            textColor: "white"
        },
        '&[class*="MuiOutlinedInput-root"] & $endAdornment': {
            textColor: "white",
            backgroundColor: "white",
            background: "white",
        },
        // Select outline non hover
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#3f51b5"
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "grey"
        },
        // Select outline on click
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "lightgrey"
        },
    },
}));

function NavBar() {
    const classes = useStyles();
    const theme = useTheme();
    const history = useHistory();
    const user_context = useContext(UserContext);
    const {alert} = useContext(AlertContext);

    const selectedUser_context = useContext(SelectedUserContext);

    // Navbar drawer menu
    const [openDrawer, setOpenDrawer] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpenDrawer(true);
    };

    const handleDrawerClose = () => {
        setOpenDrawer(false);
    };

    // Navbar account menu
    const [openAccountMenu, setAccountMenu] = React.useState(null);
    const openAccount = Boolean(openAccountMenu);

    const handleAccountMenu = (event) => {
        setAccountMenu(event.currentTarget);
    };

    const handleAccountClose = () => {
        setAccountMenu(null);
    };

    const GoToProfile = () => {
        setAccountMenu(null);
        history.push(`/profile`);
    };

    const handleChangeSelect = (event, value) => {
        selectedUser_context.setSelectedNeedyUser(value);
    };

    const handleOpenSelect = async () => {
        let needyUsersFromUser = [];
        if(user_context.hasRole(["caregiver"])) {
            const response = await GetNeedyUsersFromCaregiver(user_context.getToken())
            needyUsersFromUser = response.needy_users
        }
        else if (user_context.hasRole(["guardian"])){
            const response = await GetNeedyUsersFromGuardian(user_context.getToken())
            needyUsersFromUser = response.needyUsers
        }
        selectedUser_context.setNeedyUsers(needyUsersFromUser);
    };

    const handleLogout = () => {
        selectedUser_context.setNeedyUsers([]);
        selectedUser_context.setSelectedNeedyUser(null);
        user_context.logOut()
        history.push('/');
    };

    useEffect(() => {
        UnauthorizedHandler(alert, history.push,user_context.logOut);
    }, []);

    console.log(selectedUser_context.needyUsers)

    return (
        <div>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: openDrawer,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: openDrawer,
                        })}
                    >
                        <MenuIcon />
                    </IconButton>
                    <div className={classes.formControl}>
                        {Boolean(user_context.hasRole(["caregiver", "guardian"])) ?
                            <Autocomplete
                                id="combo-box"
                                options={selectedUser_context.needyUsers}
                                getOptionLabel={(option) => option.fullname}
                                getOptionSelected={(option, value) => option._id === value._id}
                                style={{ width: 300 }}
                                classes={{inputRoot: classes.inputRoot}}
                                onChange={handleChangeSelect}
                                onOpen={handleOpenSelect}
                                renderInput={(params) => <TextField {...params} variant="outlined" />}
                            />
                        :
                        <div className={classes.formControl}/>
                        }
                    </div>
                    <div>
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleAccountMenu}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={openAccountMenu}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={openAccount}
                            onClose={handleAccountClose}
                        >
                            <MenuItem onClick={GoToProfile}>Profile</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: openDrawer,
                    [classes.drawerClose]: !openDrawer,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: openDrawer,
                        [classes.drawerClose]: !openDrawer,
                    }),
                }}
            >
                <div className={classes.toolbar}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    {user_context.hasRole(["admin"]) && <Link to="/categories">
                        <ListItem button key='categoryButton'>
                            <ListItemIcon><FormatListBulletedIcon /></ListItemIcon>
                            <ListItemText primary='Categorieen beheer' />
                        </ListItem>
                    </Link>
                    }
                    {user_context.hasRole(["admin"]) && <Link to="/admin">
                        <ListItem button key='adminButton'>
                            <ListItemIcon><BarChartIcon /></ListItemIcon>
                            <ListItemText primary='Statistieken' />
                        </ListItem>
                    </Link>
                    }
                    {user_context.hasRole(["caregiver"]) && <Link to="/tasks">
                        <ListItem button key='taskButton'>
                            <ListItemIcon><AssignmentIcon /></ListItemIcon>
                            <ListItemText primary='Taken beheer' />
                        </ListItem>
                    </Link>
                    }
                    {user_context.hasRole(["caregiver"]) && <Link to="/tasks/templates">
                        <ListItem button key='sharedTasksButton'>
                            <ListItemIcon><AssignmentTurnedInIcon /></ListItemIcon>
                            <ListItemText primary='Gedeelde taken' />
                        </ListItem>
                    </Link>
                    }
                    {user_context.hasRole(["guardian"]) && <Link to="/schedulerreadonly">
                        <ListItem button key='planningButton'>
                            <ListItemIcon><CalendarTodayIcon /></ListItemIcon>
                            <ListItemText primary='Planning' />
                        </ListItem>
                    </Link>
                    }
                    {user_context.hasRole(["caregiver"]) && <Link to='/scheduler'>
                        <ListItem button key='planningButton'>
                            <ListItemIcon><CalendarTodayIcon /></ListItemIcon>
                            <ListItemText primary='Dag/weekplanner' />
                        </ListItem>
                    </Link>
                    }
                </List>
                <Divider />
                {!user_context.hasRole(["guardian"]) && <Typography noWrap className={classes.drawerTitle}>
                    Beheer
                </Typography>
                }
                <List>
                    {user_context.hasRole(["caregiver"]) && <Link to="/needyusers" >
                        <ListItem button key='userButton'>
                            <ListItemIcon><SupervisorAccountIcon /></ListItemIcon>
                            <ListItemText primary='Hulpbehoevenden' />
                        </ListItem>
                    </Link>
                    }
                    {user_context.hasRole(["facility_manager"]) && <Link to="/caregivers" >
                        <ListItem button key='userButton'>
                            <ListItemIcon><PersonIcon /></ListItemIcon>
                            <ListItemText primary='Hulpverleners' />
                        </ListItem>
                    </Link>
                    }
                    {user_context.hasRole(["facility_manager"]) && <Link to="/users/uncoupled" >
                        <ListItem button key='userButton'>
                            <ListItemIcon><SupervisorAccountIcon /></ListItemIcon>
                            <ListItemText primary='Losgekoppelde Hulpbehoevende' />
                        </ListItem>
                    </Link>
                    }
                    {user_context.hasRole(["caregiver"]) && <Link to="/guardians" >
                        <ListItem button key='userButton'>
                            <ListItemIcon><PersonIcon /></ListItemIcon>
                            <ListItemText primary='Mantelzorgers' />
                        </ListItem>
                    </Link>
                    }
                    {user_context.hasRole(["admin"]) && <Link to="/healthcarefacilities" >
                        <ListItem button key='healthcareFacilityButton'>
                            <ListItemIcon><BusinessIcon /></ListItemIcon>
                            <ListItemText primary='Organisaties' />
                        </ListItem>
                    </Link>
                    }
                    {user_context.hasRole(["admin"]) &&
                        <Link to="/facilitymanagers" >
                            <ListItem button key='facilityManagerButton'>
                                <ListItemIcon><SupervisedUserCircleIcon /></ListItemIcon>
                                <ListItemText primary='Organisatie beheerders' />
                            </ListItem>
                        </Link>
                    }
                </List>
            </Drawer>
        </div>
    );
}

export default NavBar
