import {
    TRACT_FILL_SUCCESS,
    TRACT_ADD,
    TRACT_DEL,
    TRACT_EDIT,
    TRACT_SORT
} from '../../../constants/reference/tract'
import {getRepository} from "typeorm";
import {Tract} from "../../TypeORM/entity/tract";
import {Subforestry} from "../../TypeORM/entity/subforestry";

export function getData(getState,repository,where) {
    const asyncProcess = async () => {
        if(!where){
            where = getState().tract.where;
        }
        let data =  await repository.find({
            relations: ["subforestry"],
            where: where,
        });
        let options = [];
        for (let i = 0; i < data.length; i++) {
            options.push({
                id:data[i].id,
                value:data[i].name
            })
        }
        return {
            data:data,
            options:options
        }
    }
    return asyncProcess()
}

export function fill_data(where = {}) {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let repository = getRepository(Tract);
            let data = await getData(getState,repository,where);
            dispatch({
                type: TRACT_FILL_SUCCESS,
                data: data.data,
                options: data.options,
                where: where,
            })
        }
        return asyncProcess()
    }
}

export function add() {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let repository      = getRepository(Tract);
            let currentObject   = repository.create();
            await repository.save(currentObject);
            let data = await getData(getState,repository);
            dispatch({
                type: TRACT_ADD,
                data: data.data,
                options: data.options,
            })
        }
        asyncProcess()
    }
}

export function del(ids) {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let repository      = getRepository(Tract);
            let data = await repository.find({
                where: {status:1},
            });
            await repository.remove(data);
            webix.message({ type:"info", text:'Удалено '+data.length+' элементов'});
            data = await getData(getState,repository);
            dispatch({
                type: TRACT_DEL,
                data: data.data,
                options: data.options,
            })
        }
        asyncProcess()
    }
}

export function edit(obj,values) {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let repository      = getRepository(Tract);
            if(obj){
                for (var property in values) {
                    let value = values[property]
                    if(property == 'subforestry'){
                        let repositorySubforestry      = getRepository(Subforestry);
                        let objsubforestry = await repositorySubforestry.findByIds([value]);
                        if(objsubforestry.length>0){
                            value = objsubforestry[0]
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
                type: TRACT_EDIT,
                currentId: obj.id,
                data: data.data,
                options: data.options,
            })
        }
        asyncProcess()
    }
}

export function sorting(by,dir,as,id) {
    return (dispatch,getState) => {
        dispatch({
            type: TRACT_SORT,
            currentId: id,
            sort: {
                by:by,
                dir:dir,
                as:as
            },
        })
    }
}