import {createConnection, getManager, TableColumn} from "typeorm";
import {Contactinformation} from "../entity/contactinformation"

export function Migration_5_2_1_0(conectionOption) {
    const asyncProcess = async (conectionOption) => {
        let newOption = {...conectionOption}
        newOption.synchronize = true;        
        try {
            newOption.entities = [
                Contactinformation
            ]
            let connection      = await createConnection(newOption);
            await connection.close();
        } catch (error) {

        }
    }
    return asyncProcess(conectionOption);
}
