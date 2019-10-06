import {createConnection, getManager, TableColumn,getRepository} from "typeorm";
import {Styles} from "../TypeORM/entity/styles"
import {Abrissettings} from "../TypeORM/entity/abrissettings"
import {Cuttingmethods} from "../TypeORM/entity/cuttingmethods"
import {Typesrates} from "../TypeORM/entity/typesrates"
import {Foresttax} from "../TypeORM/entity/foresttax"

import {defaultStyle} from "../reference/styles";
import {defaultSettings} from "../Abris/settings";
import {defaultCuttingMethods} from "../reference/cuttingmethods";
import {defaultTypesrates} from "../reference/typesrates";
import {defaultForesttax} from "../reference/foresttax";

import {updatePredefinedAbrisPrintForms} from "../../actions/reference/abrisprintforms";

export function creatMainStyle(conectionOption) {

    const asyncProcess = async () => {
        conectionOption.synchronize = false;
        let connection      = await createConnection(conectionOption);
        let repository = getRepository(Styles);
        let styles =  await repository.find({ main: 1});
        if(styles.length == 0){
            let newObject   = repository.create({
                name:'Основной стиль',
                main:true,
                style:JSON.stringify(defaultStyle())                
            })
            await repository.save(newObject);            
        }  
        await connection.close();
    }
    return asyncProcess();
}

export function creatAbrisSettings(conectionOption) {

    const asyncProcess = async () => {
        conectionOption.synchronize = false;
        let connection      = await createConnection(conectionOption);
        let repository = getRepository(Abrissettings);
        let styles =  await repository.find();
        if(styles.length == 0){
            let newObject   = repository.create({
                settings:JSON.stringify(defaultSettings())
            })
            await repository.save(newObject);
        }
        await connection.close();
    }
    return asyncProcess();
}

export function creatCuttingmethods(conectionOption) {

    const asyncProcess = async () => {
        conectionOption.synchronize = false;
        let connection      = await createConnection(conectionOption);
        let repository = getRepository(Cuttingmethods);
        let cuttingmethods =  await repository.find();
        if(cuttingmethods.length == 0){
            let arrayCuttingMethods = defaultCuttingMethods()
            for (var i = 0; i < arrayCuttingMethods.length; i++) {
                let newObject   = repository.create(arrayCuttingMethods[i])
                await repository.save(newObject);                
            }
        }
        await connection.close();
    }
    return asyncProcess();
}

export function creatTypesrates(conectionOption) {

    const asyncProcess = async () => {
        conectionOption.synchronize = false;
        let connection      = await createConnection(conectionOption);
        let repository = getRepository(Typesrates);
        let typesrates =  await repository.find();
        if(typesrates.length == 0){
            let arrayTypesrates = defaultTypesrates()
            for (var i = 0; i < arrayTypesrates.length; i++) {
                let newObject   = repository.create(arrayTypesrates[i])
                await repository.save(newObject);                
            }
        }
        await connection.close();
    }
    return asyncProcess();
}

export function creatForesttax(conectionOption) {

    const asyncProcess = async () => {
        conectionOption.synchronize = false;
        let connection      = await createConnection(conectionOption);
        let repository = getRepository(Foresttax);
        let foresttax =  await repository.find();
        if(foresttax.length == 0){
            let arrayForesttax = await defaultForesttax()
            for (var i = 0; i < arrayForesttax.length; i++) {
                let newObject   = repository.create(arrayForesttax[i])
                await repository.save(newObject);                
            }
        }
        await connection.close();
    }
    return asyncProcess();
}

export function updateAbrisPrintForms() {
    const asyncProcess = async () => {
        await updatePredefinedAbrisPrintForms();
    }
    return asyncProcess();
}


