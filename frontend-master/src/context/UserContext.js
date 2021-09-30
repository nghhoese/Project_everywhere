import React, {useState} from 'react';
import axios from 'axios';

const UserContext = React.createContext();

export function hasRole(roles) {
    let permission = false;
    this.user.roles.forEach(element => {
        roles.forEach(role => {
            if (element.name === role) {
                permission = true;
            }
        })
    });
    return permission;
};

export function UserProvider(props) {
    const [user, setUser] = useState();

    const saveToken = token => {
        localStorage.setItem('user_jwt_token', token);
    }

    const logOut = () => {
        setUser(null);
        localStorage.removeItem('user_jwt_token');
        axios.defaults.headers.common['Authorization'] = null;
    }

    return (
        <UserContext.Provider value={{
            user,
            setUser: setUser,
            saveToken: saveToken,
            logOut: logOut,
            hasRole: hasRole,
            getToken: () => localStorage.getItem('user_jwt_token'),
        }}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserContext;