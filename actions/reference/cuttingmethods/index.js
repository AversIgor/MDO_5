import {
    CUTTINGMETHODS_FILL_SUCCESS,
    CUTTINGMETHODS_ADD,
    CUTTINGMETHODS_DEL,
    CUTTINGMETHODS_EDIT,
    CUTTINGMETHODS_SORT
} from '../../../constants/reference/cuttingmethods'
import {getRepository} from "typeorm";
import {Cuttingmethods} from "../../TypeORM/entity/cuttingmethods";

export function defaultCuttingMethods() {

    let struct = [
        {'id':1,'cod':312,'formCutting':2,'groupCutting':1,'name':'Группово-выборочная'},
        {'id':2,'cod':314,'formCutting':2,'groupCutting':1,'name':'Группово-постепенная (котловинная)'},
        {'id':3,'cod':316,'formCutting':2,'groupCutting':1,'name':'Длительно-постепенные'},
        {'id':4,'cod':311,'formCutting':2,'groupCutting':1,'name':'Добровольно-выборочная'},
        {'id':5,'cod':313,'formCutting':2,'groupCutting':1,'name':'Равномерно-постепенная'},
        {'id':6,'cod':315,'formCutting':2,'groupCutting':1,'name':'Чересполосно-постепенная'},
        {'id':7,'cod':240,'formCutting':1,'groupCutting':4,'name':'Расчистка просек и противопожарных разрывов'},
        {'id':8,'cod':380,'formCutting':2,'groupCutting':4,'name':'Рубка лесных насаждений, предназначенных для строительства, реконструкции и эксплуатации объектов (выборочная)'},
        {'id':9,'cod':230,'formCutting':1,'groupCutting':4,'name':'Рубка лесных насаждений, предназначенных для строительства, реконструкции и эксплуатации объектов (сплошная)'},
        {'id':10,'cod':362,'formCutting':2,'groupCutting':2,'name':'Прореживание'},
        {'id':11,'cod':363,'formCutting':2,'groupCutting':2,'name':'Проходная'},
        {'id':12,'cod':369,'formCutting':2,'groupCutting':2,'name':'Рубка единичных деревьев'},
        {'id':13,'cod':364,'formCutting':2,'groupCutting':2,'name':'Рубка обновления'},
        {'id':14,'cod':365,'formCutting':2,'groupCutting':2,'name':'Рубка переформирования'},
        {'id':15,'cod':367,'formCutting':2,'groupCutting':2,'name':'Рубка реконструкции'},
        {'id':16,'cod':366,'formCutting':2,'groupCutting':2,'name':'Рубка формирования ландшафта'},
        {'id':17,'cod':388,'formCutting':2,'groupCutting':2,'name':'Уход за опушками'},
        {'id':18,'cod':320,'formCutting':2,'groupCutting':3,'name':'Санитарная (выборочная)'},
        {'id':19,'cod':220,'formCutting':1,'groupCutting':3,'name':'Санитарная (сплошная)'},
        {'id':20,'cod':212,'formCutting':1,'groupCutting':1,'name':'Сплошная (с последующим лесовосстановлением)'},
        {'id':21,'cod':211,'formCutting':1,'groupCutting':1,'name':'Сплошная (с предварительным лесовосстановлением)'}
    ]

    return struct
}


export function getData(getState,repository,where) {
    const asyncProcess = async () => {
        if(!where){
            where = getState().forestry.where;
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
            let repository = getRepository(Cuttingmethods);
            let data = await getData(getState,repository,where);
            dispatch({
                type: CUTTINGMETHODS_FILL_SUCCESS,
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
            let repository      = getRepository(Cuttingmethods);
            let currentObject   = repository.create();
            await repository.save(currentObject);
            let data = await getData(getState,repository);
            dispatch({
                type: CUTTINGMETHODS_ADD,
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
            let repository      = getRepository(Cuttingmethods);
            let data = await repository.find({
                where: {status:1},
            });
            await repository.remove(data);
            webix.message({ type:"info", text:'Удалено '+data.length+' элементов'});
            data = await getData(getState,repository);
            dispatch({
                type: CUTTINGMETHODS_DEL,
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
            let repository      = getRepository(Cuttingmethods);
            if(obj){
                for (var property in values) {
                    obj[property] = values[property]
                }
                await repository.save(obj)
            }
            let data = await getData(getState,repository);
            dispatch({
                type: CUTTINGMETHODS_EDIT,
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
            type: CUTTINGMETHODS_SORT,
            currentId: id,
            sort: {
                by:by,
                dir:dir,
                as:as
            },
        })
    }
}