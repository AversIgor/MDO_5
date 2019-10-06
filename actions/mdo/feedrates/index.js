import {
    FEEDRATES_FILL_SUCCESS,
    FEEDRATES_ADD,
    FEEDRATES_DEL,
    FEEDRATES_EDIT,
    FEEDRATES_SORT
} from '../../../constants/mdo/feedrates'
import {getRepository} from "typeorm";
import {Feedrates} from "../../TypeORM/entity/feedrates";

let resources = '../../../resources/'
export function getForesttax() {

    const asyncProcess = async () => {
        let payment_rates = await $.ajax(resources+'Payment_rates.xml');
        if(typeof (payment_rates) == 'string'){
            payment_rates = $.parseXML(payment_rates)
        }
        let struct = [];
        let id = 0;
        $(payment_rates).find("Description").children().each(function () {
            id = id+1;
            struct.push({
                name:$(this).attr("Name"),
                id:id               
            });	
        });
        return  struct
    }
    return asyncProcess()
}


export function getData(getState,repository,where) {
    const asyncProcess = async () => {
        if(!where){
            where = getState().feedrates.where;
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
            let repository = getRepository(Feedrates);
            let data = await getData(getState,repository,where);
            dispatch({
                type: FEEDRATES_FILL_SUCCESS,
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
            let repository      = getRepository(Feedrates);
            let currentObject   = repository.create();
            await repository.save(currentObject);
            let data = await getData(getState,repository);
            dispatch({
                type: FEEDRATES_ADD,
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
            let repository      = getRepository(Feedrates);
            let data = await repository.find({
                where: {status:1},
            });
            await repository.remove(data);
            webix.message({ type:"info", text:'Удалено '+data.length+' элементов'});
            data = await getData(getState,repository);
            dispatch({
                type: FEEDRATES_DEL,
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
            let repository      = getRepository(Feedrates);
            if(obj){
                for (var property in values) {
                    obj[property] = values[property]
                }
                await repository.save(obj)
            }
            let data = await getData(getState,repository);
            dispatch({
                type: FEEDRATES_EDIT,
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
            type: FEEDRATES_SORT,
            currentId: id,
            sort: {
                by:by,
                dir:dir,
                as:as
            },
        })
    }
}*/