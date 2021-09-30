import React, {useEffect, useState} from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const AlertContext = React.createContext();

function Alert({title, handleClose, active, severity, duration}) {
    const [open, setOpen] = useState(true);

    useEffect(() => {
        setOpen(active);
    }, [active]);

    return (
    <Snackbar open={open} autoHideDuration={duration ?? 4000} onClick={handleClose} onClose={(event, reason) => {
        if (reason === 'clickaway') {
            return;
          }
        setOpen(false);
        handleClose(); 
        }}>
        <MuiAlert elevation={6} variant="filled" severity={severity ?? "info"}>
            {title}
        </MuiAlert >
    </Snackbar>
    )
}

let alert_id = 0;
export function AlertProvider(props) {
    const [alerts, setAlerts] = useState([]);
    const [currentAlert, setCurrentAlert] = useState(0);

    return (
        <AlertContext.Provider value={{
            alert: alert => {
                alert_id++;
                setAlerts([...alerts, {...alert, alert_id}]);
            }
        }}>
            {props.children}

            {alerts.map((alert, key) => {
                return (
                    <Alert 
                        {...alert}
                        active={key === currentAlert}
                        key={alert.alert_id}
                        handleClose={() => {
                            setCurrentAlert(currentAlert + 1);
                        }}
                    />
                )
            }
            )}

        </AlertContext.Provider>
    )
}

export default AlertContext;