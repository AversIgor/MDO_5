import {createConnection, getManager} from "typeorm";

export function Migration_5_1_0_5(conectionOption) {

    //удалим таблицу
    const asyncProcess = async () => {
        conectionOption.synchronize = false;
        let connection      = await createConnection(conectionOption);
        let entityManager   = getManager();
        let result = await entityManager.query('SELECT count(*) FROM sqlite_master WHERE type="table" AND name="avers_outlines"');
        if(result[0]['count(*)']){
            try{
                await entityManager.query('DROP TABLE IF EXISTS "avers_outlines"');
            }catch (e){
                
            }
        }

        await connection.close();
    }
    return asyncProcess();
}
