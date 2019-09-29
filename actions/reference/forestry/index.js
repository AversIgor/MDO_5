import {
    FORESTRY_FILL_SUCCESS,
    FORESTRY_ADD,
    FORESTRY_DEL,
    FORESTRY_EDIT,
    FORESTRY_SORT
} from '../../../constants/reference/forestry'
import {getRepository} from "typeorm";
import {Forestry} from "../../TypeORM/entity/forestry";

export function getData(getState,repository,where) {
    const asyncProcess = async () => {
        if(!where){
            where = getState().forestry.where;
        }
        let data =  await repository.find({
            relations: ["subforestrys"],
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
            let repository = getRepository(Forestry);
            let data = await getData(getState,repository,where);        
            dispatch({
                type: FORESTRY_FILL_SUCCESS,
                data: data.data,
                options: data.options,
                where: where
            })
        }
        return asyncProcess()
    }
}

export function add() {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let repository      = getRepository(Forestry);
            let currentObject   = repository.create();
            await repository.save(currentObject);
            let data = await getData(getState,repository);
            dispatch({
                type: FORESTRY_ADD,
                data: data.data,
                options: data.options,
            })
        }
        asyncProcess()
    }
}

export function del() {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let repository      = getRepository(Forestry);
            let data = await repository.find({
                where: {status:1},
            });
            await repository.remove(data);
            webix.message({ type:"info", text:'Удалено '+data.length+' элементов'});
            data = await getData(getState,repository);
            dispatch({
                type: FORESTRY_DEL,
                data: data.data,
                options: data.options,
            })
        }
        asyncProcess()    }
}

export function edit(obj,values) {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let repository      = getRepository(Forestry);
            if(obj){
                for (var property in values) {
                    obj[property] = values[property]
                }
                await repository.save(obj)
            }
            let data = await getData(getState,repository);
            dispatch({
                type: FORESTRY_EDIT,
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
            type: FORESTRY_SORT,
            currentId: id,
            sort: {
                by:by,
                dir:dir,
                as:as
            },
        })
    }
}