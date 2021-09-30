import { useState, useEffect, useContext } from 'react';
import UserContext from '../../context/UserContext';
import moment from 'moment';
import selectedUser from '../../context/SelectedUserContext';
import { getHistoryDayitems } from '../../data/schedulerData';
import Config from '../../config/config';

export default function ExportPage() {
    const [exportObject, setExportObject] = useState({});
    const selectedUserContext = useContext(selectedUser);
    const user_context = useContext(UserContext);
    let token = user_context.getToken();
    const [creationDate, setCreationDate] = useState("");

    const exportDetails = async () => {
        // If no needy user is selected
        if(!Boolean(selectedUserContext.selectedNeedyUser)) {
            return;
        }

        try {
            const result = await getHistoryDayitems(selectedUserContext.selectedNeedyUser,token);
            let date = new Date();
          setCreationDate(date.toLocaleString());
            result.data.fileName =  result.data.path.split("./public/uploads/")[1];
                result.data.path = Config.apiurl + result.data.path.split("./public")[1];
              console.log(result.data);
            setExportObject(result.data)
        } catch (error) {
            console.log(error);
        }
    }



    useEffect(() => {
        exportDetails();
    }, [selectedUserContext.selectedNeedyUser]);

    return (
        <div>
            <h1>Export:</h1>
            <h3>Csv Export bestand: <a href={exportObject.path} target="_blank">{exportObject.fileName}</a> </h3>
            <h3>Unieke handtekening: {exportObject.signature}</h3>
            <h4>Dit bestand en deze handtekening zijn gegenereerd op: {creationDate}</h4>
            <h4>Dit bestand en deze handtekening worden elke keer opnieuw gegenereerd dus sla deze handtekening ergens op!</h4>
        </div>
    )
}
