import {createConnection, getManager, TableColumn} from "typeorm";
import {Styles} from "../entity/styles"
import {Forestry} from "../entity/forestry"
import {Subforestry} from "../entity/subforestry"
import {Tract} from "../entity/tract"
import {Cuttingmethods} from "../entity/cuttingmethods"
import {Publications} from "../entity/publications"
import {Tables} from "../entity/tables";
import {Breed} from "../entity/breed";
import {Abrisprintforms} from "../entity/abrisprintforms"
import {Methodscleanings} from "../entity/methodscleanings";

import {store} from "../../../src/app";
import * as publications_actions from "../../reference/publications";

export function creatEntities(conectionOption) {
    const asyncProcess = async (conectionOption) => {
        let newOption = {...conectionOption}
        newOption.synchronize = true;
        try {
            newOption.entities = [
                Styles,
                Forestry,
                Subforestry,
                Tract,
                Cuttingmethods,
                Publications,
                Tables,
                Breed,
                Abrisprintforms,
            ]
            let connection      = await createConnection(newOption);
            await connection.close();
        } catch (error) {

        }

    }
    return asyncProcess(conectionOption);
}

export function renameTable(conectionOption) {

    //переименовывание устаревших таблиц
    const asyncProcess = async () => {
        conectionOption.synchronize = false;
        let connection      = await createConnection(conectionOption);
        let entityManager   = getManager();
        let result = await entityManager.query('SELECT count(*) FROM sqlite_master WHERE type="table" AND name="methodscleaning"');
        if(result[0]['count(*)']){
            await entityManager.query('ALTER TABLE methodscleaning RENAME TO old_methodscleaning');
        }
        result = await entityManager.query('SELECT count(*) FROM sqlite_master WHERE type="table" AND name="global_parameters"');
        if(result[0]['count(*)']){
            await entityManager.query('ALTER TABLE global_parameters RENAME TO old_global_parameters');
        }

        await connection.close();
    }
    return asyncProcess();
}

export function methodscleaningConvert(conectionOption) {

    const asyncProcess = async () => {
        conectionOption.synchronize = false;
        let connection      = await createConnection(conectionOption);
        let entityManager   = getManager();

        let result = await entityManager.query('SELECT count(*) FROM sqlite_master WHERE type="table" AND name="old_methodscleaning"');
        if(result[0]['count(*)']){
            let repository      = getRepository(Methodscleanings);
            let rows = await repository.find();
            if(!rows.length){
                const rawData = await entityManager.query('SELECT * FROM old_methodscleaning');
                for (var i = 0; i < rawData.length; i++) {
                    let newObject   = repository.create({
                        id:rawData[i].recid,
                        name:rawData[i].name,
                        fullname:rawData[i].fullname,
                    });
                    await repository.save(newObject);
                }
            }
        }

        await connection.close();
    }

    return asyncProcess();
}

export function forestryConvert(conectionOption) {

    const asyncProcess = async () => {
        conectionOption.synchronize = false;
        let connection      = await createConnection(conectionOption);
        let entityManager   = getManager();

        let result = await entityManager.query('SELECT count(*) FROM sqlite_master WHERE type="table" AND name="forestry"');
        if(result[0]['count(*)']){
            let repository      = getRepository(Forestry);
            let rows = await repository.find();
            if(!rows.length){
                const rawData = await entityManager.query('SELECT * FROM forestry');
                for (var i = 0; i < rawData.length; i++) {
                    let newObject   = repository.create({
                        id:rawData[i].recid,
                        name:rawData[i].name,
                        fullname:rawData[i].fullname,
                        cod:rawData[i].cod,
                    });
                    await repository.save(newObject);
                }
            }
        }

        await connection.close();
    }

    return asyncProcess();
}

export function subforestryConvert(conectionOption) {

    const asyncProcess = async () => {
        conectionOption.synchronize = false;
        let connection      = await createConnection(conectionOption);
        let entityManager   = getManager();

        let result = await entityManager.query('SELECT count(*) FROM sqlite_master WHERE type="table" AND name="subforestry"');
        if(result[0]['count(*)']){
            let repository      = getRepository(Subforestry);
            let rows = await repository.find();
            if(!rows.length){
                const rawData = await entityManager.query('SELECT * FROM subforestry');
                for (var i = 0; i < rawData.length; i++) {
                    let newObject   = repository.create({
                        id:rawData[i].recid,
                        name:rawData[i].name,
                        fullname:rawData[i].fullname,
                        cod:rawData[i].cod,
                        forestry:rawData[i].forestry_id,
                    });
                    await repository.save(newObject);
                }
            }
        }

        await connection.close();
    }

    return asyncProcess();
}

export function tractConvert(conectionOption) {

    const asyncProcess = async () => {
        conectionOption.synchronize = false;
        let connection      = await createConnection(conectionOption);
        let entityManager   = getManager();

        let result = await entityManager.query('SELECT count(*) FROM sqlite_master WHERE type="table" AND name="tract"');
        if(result[0]['count(*)']){
            let repository      = getRepository(Tract);
            let rows = await repository.find();
            if(!rows.length){
                const rawData = await entityManager.query('SELECT * FROM tract');
                for (var i = 0; i < rawData.length; i++) {
                    let newObject   = repository.create({
                        id:rawData[i].recid,
                        name:rawData[i].name,
                        fullname:rawData[i].fullname,
                        cod:rawData[i].cod,
                        subforestry:rawData[i].subforestry_id,
                    });
                    await repository.save(newObject);
                }
            }
        }

        await connection.close();
    }

    return asyncProcess();
}

export function cuttingmethodsConvert(conectionOption) {

    const asyncProcess = async () => {
        conectionOption.synchronize = false;
        let connection      = await createConnection(conectionOption);
        let entityManager   = getManager();

        let result = await entityManager.query('SELECT count(*) FROM sqlite_master WHERE type="table" AND name="cuttingmethods"');
        if(result[0]['count(*)']){
            let repository      = getRepository(Cuttingmethods);
            let rows = await repository.find();
            if(!rows.length){
                const rawData = await entityManager.query('SELECT * FROM cuttingmethods');
                for (var i = 0; i < rawData.length; i++) {
                    let newObject   = repository.create({
                        id:rawData[i].recid,
                        name:rawData[i].name,
                        cod:rawData[i].idCutting,
                        formCutting:rawData[i].formCutting,
                        groupCutting:rawData[i].groupCutting,
                    });
                    await repository.save(newObject);
                }
            }
        }
        await connection.close();
    }

    return asyncProcess();
}

export function publicationsConvert(conectionOption) {

    const asyncProcess = async () => {
        conectionOption.synchronize = false;
        let connection      = await createConnection(conectionOption);
        let entityManager   = getManager();

        let result = await entityManager.query('SELECT count(*) FROM sqlite_master WHERE type="table" AND name="publications"');
        if(result[0]['count(*)']){
            let repository      = getRepository(Publications);
            let rows = await repository.find();
            if(!rows.length){
                const rawData = await entityManager.query('SELECT * FROM publications');
                for (var i = 0; i < rawData.length; i++) {
                    let newObject   = repository.create({
                        id:rawData[i].id,
                        name:rawData[i].name,
                        fullname:rawData[i].fullname,
                        version:rawData[i].version,
                        loadversion:rawData[i].loadversion,
                        official:rawData[i].official,
                        developer:rawData[i].developer,
                        barklindenindividualreserves:rawData[i].barklindenindividualreserves,
                        load:rawData[i].load,                        
                    });
                    await repository.save(newObject);                    
                    await store.dispatch(publications_actions.add(rawData[i].id));
                }
            }
        }
        await connection.close();
    }

    return asyncProcess();
}

export function breedsConvert(conectionOption) {

    const asyncProcess = async () => {
        conectionOption.synchronize = false;
        let connection      = await createConnection(conectionOption);
        let entityManager   = getManager();

        let result = await entityManager.query('SELECT count(*) FROM sqlite_master WHERE type="table" AND name="breeds"');
        if(result[0]['count(*)']){
            let repository      = getRepository(Breed);
            let rows = await repository.find();
            if(!rows.length){
                const rawData = await entityManager.query('SELECT * FROM breeds');
                for (var i = 0; i < rawData.length; i++) {
                    let newObject   = repository.create({
                        publication_id:rawData[i].publication_id,
                        tables_id:rawData[i].tables_id,
                        tablesfirewood_id:rawData[i].tablesfirewood_id,
                        name:rawData[i].name,
                        kodGulf:rawData[i].kodGulf,
                    });
                    await repository.save(newObject);
                }
            }
        }
        await connection.close();
    }

    return asyncProcess();
}