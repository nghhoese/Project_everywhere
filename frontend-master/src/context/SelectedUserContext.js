import React, {useState} from 'react';

const SelectedUserContext = React.createContext();

export function SelectedUserProvider(props) {

    const [needyUsers, setNeedyUsers] = React.useState([]);
    const [selectedNeedyUser, setSelectedNeedyUser] = React.useState(null);

    return (
        <SelectedUserContext.Provider value={{needyUsers, setNeedyUsers, selectedNeedyUser, setSelectedNeedyUser}}>
            {props.children}
        </SelectedUserContext.Provider>
    )
}

export default SelectedUserContext;