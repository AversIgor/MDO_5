import {
    FORESTRY_FILL_SUCCESS,
    FORESTRY_ADD,
    FORESTRY_DEL,
    FORESTRY_EDIT,
    FORESTRY_SORT
} from '../../../constants/reference/forestry'
import {getRepository} from "typeorm";
import {Forestry} from "../../TypeORM/entity/forestry";

export function getData(getState,repository) {
    const asyncProcess = async () => {
        let where = getState().forestry.where;
        let data =  await repository.find({
            relations: ["subforestrys"],
            where: where,
        });
        return data
    }
    return asyncProcess()
}

export function fill_data(where = {}) {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let repository = getRepository(Forestry);
            let data = await repository.find({
                relations: ["subforestrys"],
                where: where,
            });
            dispatch({
                type: FORESTRY_FILL_SUCCESS,
                data: data,
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
                data: data
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
                data: data
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
                data: data
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