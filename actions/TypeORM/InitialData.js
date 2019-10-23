import {createConnection, getManager, TableColumn,getRepository} from "typeorm";
import {Styles} from "../TypeORM/entity/styles"
import {Cuttingmethods} from "../TypeORM/entity/cuttingmethods"
import {Typesrates} from "../TypeORM/entity/typesrates"

import {defaultStyle} from "../reference/styles";
import {defaultCuttingMethods} from "../reference/cuttingmethods";
import {defaultTypesrates} from "../reference/typesrates";

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


export function updateAbrisPrintForms() {
    const asyncProcess = async () => {
        await updatePredefinedAbrisPrintForms();
    }
    return asyncProcess();
}


