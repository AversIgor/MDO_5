import {createConnection, getManager, TableColumn,getRepository} from "typeorm";
import {Contactinformation} from "../entity/contactinformation"
import {Typesrates} from "../entity/typesrates"
import {Mdosettings} from "../entity/mdosettings"

export function creatEntities(conectionOption) {
    const asyncProcess = async (conectionOption) => {
        let newOption = {...conectionOption}
        newOption.synchronize = true;        
        try {
            newOption.entities = [
                Contactinformation,
                Typesrates,
                Mdosettings,
            ]
            let connection      = await createConnection(newOption);
            await connection.close();
        } catch (error) {

        }        
    }
    return asyncProcess(conectionOption);
}

export function ContactinformationConvert(conectionOption) {

    const asyncProcess = async () => {
        conectionOption.synchronize = false;
        let connection      = await createConnection(conectionOption);
        let entityManager   = getManager();        

        let result = await entityManager.query('SELECT count(*) FROM sqlite_master WHERE type="table" AND name="constants"');
        if(result[0]['count(*)']){
            let repository     = getRepository(Contactinformation);
            let rows = await repository.find();
            if(!rows.length){
                const rawData = await entityManager.query('SELECT * FROM constants');
                for (var i = 0; i < rawData.length; i++) {
                    let newObject   = {
                        id:rawData[i].recid,
                        contacts:JSON.parse(rawData[i].contacts),
                    };
                    await repository.save(newObject);
                }
            }
        }

        await connection.close();
    }

    return asyncProcess();
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



