import {
    METHODSCLEANINGS_FILL_SUCCESS,
    METHODSCLEANINGS_ADD,
    METHODSCLEANINGS_DEL,
    METHODSCLEANINGS_EDIT,
    METHODSCLEANINGS_SORT
} from '../../../constants/reference/methodscleanings'
import {getRepository} from "typeorm";
import {Methodscleanings} from "../../TypeORM/entity/methodscleanings";

export function getData(getState,repository) {
    const asyncProcess = async () => {
        let where = getState().methodscleanings.where;
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
            let repository = getRepository(Methodscleanings);
            let data = await repository.find({
                where: where,
            });
            dispatch({
                type: METHODSCLEANINGS_FILL_SUCCESS,
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
            let repository      = getRepository(Methodscleanings);
            let currentObject   = repository.create();
            await repository.save(currentObject);
            let data = await getData(getState,repository);
            dispatch({
                type: METHODSCLEANINGS_ADD,
                data: data
            })
        }
        asyncProcess()
    }
}

export function del(ids) {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let repository      = getRepository(Methodscleanings);
            let data = await repository.find({
                where: {status:1},
            });
            await repository.remove(data);
            webix.message({ type:"info", text:'Удалено '+data.length+' элементов'});
            data = await getData(getState,repository);
            dispatch({
                type: METHODSCLEANINGS_DEL,
                data: data
            })
        }
        asyncProcess()
    }
}

export function edit(obj,values) {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let repository      = getRepository(Methodscleanings);
            if(obj){
                for (var property in values) {
                    obj[property] = values[property]
                }
                await repository.save(obj)
            }
            let data = await getData(getState,repository);
            dispatch({
                type: METHODSCLEANINGS_EDIT,
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
            type: METHODSCLEANINGS_SORT,
            currentId: id,
            sort: {
                by:by,
                dir:dir,
                as:as
            },
        })
    }
}