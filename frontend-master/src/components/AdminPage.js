import React, {useState, useContext, useEffect} from 'react';
import {makeStyles, IconButton} from "@material-ui/core";
import UserContext from '../context/UserContext';
import {GetUsersCount} from "../data/userData";
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import {GetHealthcareFacilities} from "../data/healthcareFacilityData";
import BusinessIcon from '@material-ui/icons/Business';

const useStyles = makeStyles((theme) => ({
    backgroundColor: {
        backgroundColor: '#3f51b5',
        color: 'white',
        width: '100%',
        clear: 'none',
    },
    border: {
        border: '1px solid black',
        clear: 'none',
    },
    headIcon: {
        color: 'black'
    },
    icon: {
        color: 'white'
    },
    text: {
        marginLeft: '10px'
    },
    size1: {
        width: '50%',
        minHeight: '350px',
        float: 'left'
    },
    size2: {
        width: '50%',
        minHeight: '350px',
        float: 'right'
    },
}))

function AdminPage() {
    const classes = useStyles();
    const user_context = useContext(UserContext);
    let token = user_context.getToken();
    let [users, setUsers] = useState([]);
    let [facilities, setFacilities] = useState([]);

    useEffect(async () => {
        let users = await GetUsersCount(token);
        let facilities = await GetHealthcareFacilities(token);
        setUsers(users);
        setFacilities(facilities);
    }, []);

    return (
        <div>
            <h1>Statistieken</h1>
            {users &&
            <div className={classes.size1}>
                <div className={classes.backgroundColor}>
                    <h2>
                        <IconButton aria-label="back">
                            <PeopleOutlineIcon fontSize="default" className={classes.icon}/>
                        </IconButton>
                        Gebruikers
                    </h2>
                </div>
                <div>
                    <p className={classes.text}><strong>Totaal aantal zorgInstelling beheerders: </strong>{users.facility_managers}</p>
                    <p className={classes.text}><strong>Totaal aantal hulpverleners: </strong>{users.caregivers}</p>
                    <p className={classes.text}><strong>Totaal aantal mantelzorgers: </strong>{users.guardians}</p>
                    <p className={classes.text}><strong>Totaal aantal hulpbehoevenden: </strong>{users.needy_users}</p>
                </div>
            </div>
            }
            {facilities &&
            <div>
                {facilities.healthcareFacilities &&
                    <div className={classes.size2}>
                        <div className={classes.backgroundColor}>
                            <h2>
                                <IconButton aria-label="back">
                                    <BusinessIcon fontSize="default" className={classes.icon}/>
                                </IconButton>
                                Zorginstellingen
                            </h2>
                        </div>
                        <div>
                            <p className={classes.text}><strong>Totaal aantal zorginstellingen: </strong>{facilities.healthcareFacilities.length}</p>
                        </div>
                    </div>
                }
            </div>
            }
        </div>
    );
}

export default AdminPage;