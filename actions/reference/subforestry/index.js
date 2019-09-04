import {
    SUBFORESTRY_FILL_SUCCESS,
    SUBFORESTRY_ADD,
    SUBFORESTRY_DEL,
    SUBFORESTRY_EDIT,
    SUBFORESTRY_SORT
} from '../../../constants/reference/subforestry'
import {getRepository} from "typeorm";

import {Subforestry} from "../../TypeORM/entity/subforestry";
import {Forestry} from "../../TypeORM/entity/forestry";

export function getData(getState,repository) {
    const asyncProcess = async () => {
        let where = getState().subforestry.where;
        let data =  await repository.find({
            relations: ["forestry","tracts"],
            where: where,
        });
        return data
    }
    return asyncProcess()
}

export function fill_data(where = {}) {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let repository = getRepository(Subforestry);
            let data = await repository.find({
                relations: ["forestry","tracts"],
                where: where,
            });
            dispatch({
                type: SUBFORESTRY_FILL_SUCCESS,
                data: data,
                where: where,
            })
        }
        return asyncProcess()
    }
}

export function add() {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let repository      = getRepository(Subforestry);
            let currentObject   = repository.create();
            await repository.save(currentObject);
            let data = await getData(getState,repository);
            dispatch({
                type: SUBFORESTRY_ADD,
                data: data
            })
        }
        asyncProcess()
    }
}

export function del() {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let repository      = getRepository(Subforestry);
            let data = await repository.find({
                where: {status:1},
            });
            await repository.remove(data);
            webix.message({ type:"info", text:'Удалено '+data.length+' элементов'});
            data = await getData(getState,repository);
            dispatch({
                type: SUBFORESTRY_DEL,
                data: data
            })
        }
        asyncProcess()
    }
}

export function edit(obj,values) {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let repository      = getRepository(Subforestry);
            if(obj){
                for (var property in values) {
                    let value = values[property]
                    if(property == 'forestry'){
                        let repositoryForestry      = getRepository(Forestry);
                        let objForestry = await repositoryForestry.findByIds([value]);
                        if(objForestry.length>0){
                            value = objForestry[0]
                        }else {
                            value = undefined
                        }
                    }
                    if(value != undefined){
                        obj[property] = value
                    }
                }
                await repository.save(obj)
            }
            let data = await getData(getState,repository);
            dispatch({
                type: SUBFORESTRY_EDIT,
                currentId: obj.id,
                data: data
            })
        }
        asyncProcess()
    }
}

export function sorting(by,dir,as,id) {
    return (dispatch,getState) => {
        dispatch({
            type: SUBFORESTRY_SORT,
            currentId: id,
            sort: {
                by:by,
                dir:dir,
                as:as
            },
        })
    }
}