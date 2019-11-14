import {createConnection, getManager, TableColumn,getRepository} from "typeorm";
import {Typesrates} from "../entity/typesrates"
import {Settings} from "../entity/settings"
import {Curentproject} from "../entity/curentproject"

export function creatEntities(conectionOption) {
    const asyncProcess = async (conectionOption) => {
        let newOption = {...conectionOption}
        newOption.synchronize = true;        
        try {
            newOption.entities = [
                Typesrates,
                Settings,
                Curentproject,
            ]
            let connection      = await createConnection(newOption);
            await connection.close();
        } catch (error) {

        }        
    }
    return asyncProcess(conectionOption);
}


export function TypesratesConvert(conectionOption) {

    const asyncProcess = async () => {
        conectionOption.synchronize = false;
        let connection      = await createConnection(conectionOption);
        let entityManager   = getManager();        

        let result = await entityManager.query('SELECT count(*) FROM sqlite_master WHERE type="table" AND name="typesrates"');
        if(result[0]['count(*)']){
            let repository     = getRepository(Typesrates);
            let rows = await repository.find();
            if(!rows.length){
                const rawData = await entityManager.query('SELECT * FROM typesrates');
                for (var i = 0; i < rawData.length; i++) {
                    let newObject   = {
                        id:rawData[i].recid,
                        orderroundingrates:rawData[i].orderroundingrates,
                        orderroundingrates:rawData[i].orderroundingrates,
                        predefined:rawData[i].predefined,
                        name:rawData[i].name,
                        coefficientsindexing:rawData[i].coefficientsindexing,
                    };
                    await repository.save(newObject);
                }
            }
        }

        await connection.close();
    }

    return asyncProcess();
}



