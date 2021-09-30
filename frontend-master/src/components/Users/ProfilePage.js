import React, {useState, useContext, useEffect} from 'react';
import UserContext from '../../context/UserContext';
import {makeStyles, IconButton} from "@material-ui/core";
import {GetProfile} from "../../data/userData";
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import BusinessIcon from '@material-ui/icons/Business';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import InfoIcon from '@material-ui/icons/Info';
import moment from 'moment';

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

function ProfilePage() {
    const classes = useStyles();
    const user_context = useContext(UserContext);
    let token = user_context.getToken();
    let [userInfo, setUserInfo] = useState([]);

    useEffect(async () => {
        let user = await GetProfile(token);
        setUserInfo(user);
    }, []);

    return (
        <div>
            {userInfo.user &&
            <h1>
                <IconButton aria-label="back">
                    <PermIdentityIcon fontSize="large" className={classes.headIcon}/>
                </IconButton>
                {userInfo.user.fullname}
            </h1>
            }
            {userInfo.user &&
            <div className={classes.size1}>
                <div className={classes.backgroundColor}>
                    <h2>
                        <IconButton aria-label="back">
                            <InfoIcon fontSize="default" className={classes.icon}/>
                        </IconButton>
                        Algemene informatie
                    </h2>
                </div>
                <div>
                    <p className={classes.text}><strong>Voornaam: </strong>{userInfo.user.firstname}</p>
                    <p className={classes.text}><strong>Achternaam: </strong>{userInfo.user.lastname}</p>
                    <p className={classes.text}><strong>Email: </strong>{userInfo.user.email}</p>
                    <p className={classes.text}><strong>Telefoonnummer: </strong>{userInfo.user.phone}</p>
                    <p className={classes.text}><strong>Geboortedatum: </strong>{moment(userInfo.user.birthday).format('DD-MM-YYYY')}</p>    
                </div>
            </div>
            }
            {userInfo.organisation &&
            <div className={classes.size2}>
                <div className={classes.backgroundColor}>
                    <h2>
                        <IconButton aria-label="back">
                            <BusinessIcon fontSize="default" className={classes.icon}/>
                        </IconButton>
                        ZorgInstelling informatie
                    </h2>
                </div>
                <div>
                    <p className={classes.text}><strong>ZorgInstelling: </strong>{userInfo.organisation.name}</p>
                    <p className={classes.text}><strong>Kvk nummer: </strong>{userInfo.organisation.kvkNumber}</p>
                    <p className={classes.text}><strong>Locatie naam: </strong>{userInfo.organisation.locationName}</p>
                    <p className={classes.text}><strong>Plaats: </strong>{userInfo.organisation.place}</p>
                    <p className={classes.text}><strong>Huisnummer: </strong>{userInfo.organisation.houseNumber}</p>
                    <p className={classes.text}><strong>Postcode: </strong>{userInfo.organisation.postalCode}</p>   
                </div> 
            </div>
            }
            <br></br>
            {userInfo.facility_manager &&
            <div>
                {userInfo.facility_manager[0] &&
                    <div className={classes.size1}>
                        <div className={classes.backgroundColor}>
                            <h2>
                                <IconButton aria-label="back">
                                    <AssignmentIndIcon fontSize="default" className={classes.icon}/>
                                </IconButton>
                                ZorgInstelling manager informatie
                            </h2>
                        </div>
                        <div>
                            <p className={classes.text}><strong>Voornaam: </strong>{userInfo.facility_manager[0].firstname}</p>
                            <p className={classes.text}><strong>Achternaam: </strong>{userInfo.facility_manager[0].lastname}</p>
                            <p className={classes.text}><strong>Email: </strong>{userInfo.facility_manager[0].email}</p>
                            <p className={classes.text}><strong>Telefoonnummer: </strong>{userInfo.facility_manager[0].phone}</p>
                        </div> 
                    </div>
                }
            </div>
            }
            <br></br>
            {userInfo.needy_users &&
            <div>
                {userInfo.needy_users.length > 0 &&
                    <div className={classes.size2}>
                        <div className={classes.backgroundColor}>
                            <h2>
                                <IconButton aria-label="back">
                                    <PeopleOutlineIcon fontSize="default" className={classes.icon}/>
                                </IconButton>
                                Hulpbehoevende informatie
                            </h2>
                        </div>
                        <div>
                            <p className={classes.text}><strong>Totaal aantal hulpbehoevende: </strong>{userInfo.needy_users.length}</p>
                        </div>
                    </div>
                }
            </div>
            }
        </div>
    );
}

export default ProfilePage;