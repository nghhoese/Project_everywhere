import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
  GetStorageItem,
  RemoveStorageItem,
  SetStorageItem,
  StorageKeys,
} from '../helpers/Storage';

const UserContext = React.createContext();

export function UserProvider(props) {
  const [user, setUser] = useState();
  const [autoLoginLoading, setAutoLoginLoading] = useState(true);

  useEffect(() => {
    async function fetchUserFromStorage() {
      try {
        const temp_user = await GetStorageItem(StorageKeys.user);
        const temp_token = await GetStorageItem(StorageKeys.user_token);

        setUser(temp_user);
        axios.defaults.headers.common.Authorization = `Bearer ${temp_token}`;
      } catch (err) {
      } finally {
        setAutoLoginLoading(false);
      }
    }
    fetchUserFromStorage();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser: async ({user: new_user, token}) => {
          setUser(new_user);

          SetStorageItem(StorageKeys.user, new_user);
          SetStorageItem(StorageKeys.user_token, token);
          axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        },
        logOut: () => {
          axios.defaults.headers.common.Authorization = '';
          RemoveStorageItem(StorageKeys.user);
          RemoveStorageItem(StorageKeys.user_token);
          setUser(null);
        },
        autoLoginLoading,
      }}>
      {props.children}
    </UserContext.Provider>
  );
}

export default UserContext;
