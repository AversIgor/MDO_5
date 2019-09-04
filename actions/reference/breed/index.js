import {
    BREED_FILL_SUCCESS,
    BREED_ADD,
    BREED_DEL,
    BREED_EDIT,
    BREED_SORT
} from '../../../constants/reference/breed'
import {getRepository} from "typeorm";

import {Breed} from "../../TypeORM/entity/breed";
import {Publications} from "../../TypeORM/entity/publications";
import {Tables} from "../../TypeORM/entity/tables";

export function getData(getState,repository) {
    const asyncProcess = async () => {
        let where = getState().subforestry.where;
        let data =  await repository.find({
            where: where,
        });
        return data
    }
    return asyncProcess()
}

export function fill_data(where = {}) {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let repository = getRepository(Breed);
            let data = await repository.find({
                where: where,
            });
            dispatch({
                type: BREED_FILL_SUCCESS,
                data: data,
                where: where,
            })
        }
        return asyncProcess()
    }
}

export function add(values = {}) {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let repository      = getRepository(Breed);
            let currentObject   = repository.create(values);
            await repository.save(currentObject);
            let data = await getData(getState,repository);
            dispatch({
                type: BREED_ADD,
                data: data,
                currentObject: currentObject
            })
        }
        return asyncProcess()
    }
}

export function del() {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let repository      = getRepository(Breed);
            let data = await repository.find({
                where: {status:1},
            });
            await repository.remove(data);
            webix.message({ type:"info", text:'Удалено '+data.length+' элементов'});
            data = await getData(getState,repository);
            dispatch({
                type: BREED_DEL,
                data: data
            })
        }
        asyncProcess()
    }
}

export function edit(obj,values) {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let repository      = getRepository(Breed);
            if(obj){
                for (var property in values) {
                    let value = values[property]
                    if(property == 'publication'){
                        let repositoryPublications      = getRepository(Publications);
                        let objPublications = await repositoryPublications.findByIds([value]);
                        if(objPublications.length>0){
                            value = objPublications[0]
                        }else {
                            value = ''
                        }
                    }
                    if(property == 'table'){
                        let repositoryTables      = getRepository(Tables);
                        let objTables = await repositoryTables.find({ id: value });
                        if(objTables.length>0){
                            value = objTables[0]
                        }else {
                            value = ''
                        }
                    }
                    if(property == 'tablefirewood'){
                        let repositoryTables      = getRepository(Tables);
                        let objTables = await repositoryTables.find({ id: value });
                        if(objTables.length>0){
                            value = objTables[0]
                        }else {
                            value = ''
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
                type: BREED_EDIT,
                currentId: obj.id,
                currentObject: obj,
                data: data
            })
        }
        return asyncProcess()
    }
}

export function sorting(by,dir,as,id) {
    return (dispatch,getState) => {
        dispatch({
            type: BREED_SORT,
            currentId: id,
            sort: {
                by:by,
                dir:dir,
                as:as
            },
        })
    }
}