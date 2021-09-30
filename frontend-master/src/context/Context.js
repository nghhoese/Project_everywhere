import { ThemeProvider } from './ThemeContext';
import { UserProvider } from './UserContext';
import {SelectedUserProvider} from "./SelectedUserContext";
import { AlertProvider } from './AlertContext';

function Context(props) {
  return (
    <ThemeProvider>
      <AlertProvider>
        <UserProvider>
            <SelectedUserProvider>
            {props.children}
          </SelectedUserProvider>
        </UserProvider>
      </AlertProvider>
    </ThemeProvider>
  );
}

export default Context;