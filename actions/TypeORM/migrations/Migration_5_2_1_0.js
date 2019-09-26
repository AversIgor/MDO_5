import {createConnection, getManager, TableColumn} from "typeorm";
import {Constants} from "../entity/constants"

export function Migration_5_2_1_0(conectionOption) {
    const asyncProcess = async (conectionOption) => {
        let newOption = {...conectionOption}
        newOption.synchronize = true;        
        try {
            newOption.entities = [
                Constants
            ]
            let connection      = await createConnection(newOption);
            await connection.close();
        } catch (error) {

        }
    }
    return asyncProcess(conectionOption);
}
