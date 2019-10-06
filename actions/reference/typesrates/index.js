import {
    TYPESRATES_FILL_SUCCESS,
    TYPESRATES_ADD,
    TYPESRATES_DEL,
    TYPESRATES_EDIT,
    TYPESRATES_SORT
} from '../../../constants/reference/typesrates'
import {getRepository} from "typeorm";
import {Typesrates} from "../../TypeORM/entity/typesrates";

export function defaultTypesrates() {

    let struct = [
        {'id':1,'status':0,'orderroundingrates':2,'predefined':true,'coefficientsindexing':1.43,'name':'Ставки Федерального уровня'},        
    ]

    return struct
}


export function getData(getState,repository,where) {
    const asyncProcess = async () => {
        if(!where){
            where = getState().typesrates.where;
        }
        let data =  await repository.find({
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
            let repository = getRepository(Typesrates);
            let data = await getData(getState,repository,where);
            dispatch({
                type: TYPESRATES_FILL_SUCCESS,
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
            let repository      = getRepository(Typesrates);
            let currentObject   = repository.create();
            await repository.save(currentObject);
            let data = await getData(getState,repository);
            dispatch({
                type: TYPESRATES_ADD,
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
            let repository      = getRepository(Typesrates);
            let data = await repository.find({
                where: {status:1},
            });
            await repository.remove(data);
            webix.message({ type:"info", text:'Удалено '+data.length+' элементов'});
            data = await getData(getState,repository);
            dispatch({
                type: TYPESRATES_DEL,
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
            let repository      = getRepository(Typesrates);
            if(obj){
                for (var property in values) {
                    console.log(property)
                    if(property == 'coefficientsindexing'){
                        obj[property] = parseFloat(values[property].replace(',','.').replace(' ',''))
                    }else{
                        obj[property] = values[property]
                    }
                }
                await repository.save(obj)
            }
            let data = await getData(getState,repository);
            dispatch({
                type: TYPESRATES_EDIT,
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
            type: TYPESRATES_SORT,
            currentId: id,
            sort: {
                by:by,
                dir:dir,
                as:as
            },
        })
    }
}