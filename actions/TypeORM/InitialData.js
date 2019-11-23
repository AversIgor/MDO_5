import {createConnection, getManager, TableColumn,getRepository} from "typeorm";
import {Styles} from "../TypeORM/entity/styles"
import {Cuttingmethods} from "../TypeORM/entity/cuttingmethods"
import {Typesrates} from "../TypeORM/entity/typesrates"

import * as curentproject from "../Desktop/curentproject";
import * as forestry from "../reference/forestry";
import * as subforestry from "../reference/subforestry";
import * as tract from "../reference/tract";
import * as methodscleanings from "../reference/methodscleanings";
import * as cuttingmethods from "../reference/cuttingmethods";
import * as typesrates from "../reference/typesrates";
import * as breed from "../reference/breed";
import * as publications from "../reference/publications";
import * as printforms from "../reference/printforms";

import {defaultStyle} from "../reference/styles";
import {defaultCuttingMethods} from "../reference/cuttingmethods";
import {defaultTypesrates} from "../reference/typesrates";
import {updatePredefinedPrintForms} from "../../actions/reference/printforms";

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

export function updatePrintForms() {
    const asyncProcess = async () => {
        await updatePredefinedPrintForms();
    }
    return asyncProcess();
}

export function feelAllReducers(dispatch) {

    dispatch(curentproject.restoreProject())      
    dispatch(forestry.fill_data({status:0}))
    dispatch(subforestry.fill_data({status:0}))
    dispatch(tract.fill_data({status:0}))
    dispatch(methodscleanings.fill_data({status:0}))
    dispatch(cuttingmethods.fill_data({status:0}))
    dispatch(typesrates.fill_data({status:0})) 
    dispatch(breed.fill_data({status:0}))  
    dispatch(publications.fill_data({status:0}))   
    dispatch(printforms.fill_data({status:0})) 
}



