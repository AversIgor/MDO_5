import {
    STYLES_FILL_SUCCESS,
    STYLES_ADD,
    STYLES_DEL,
    STYLES_EDIT,
    STYLES_SORT,
} from '../../../constants/reference/styles'
import {getRepository} from "typeorm";
import {Styles} from "../../TypeORM/entity/styles";

export function getData(getState,repository) {
    const asyncProcess = async () => {
        let where = getState().styles.where;
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
            let repository = getRepository(Styles);
            let data = await repository.find({
                where: where,
            });
            dispatch({
                type: STYLES_FILL_SUCCESS,
                data: data,
                where: where
            })
        }
        return asyncProcess()
    }
}

export function defaultStyle() {
    return {
        poliline:{
            strokeWidth:"1",
            stroke:"black",
            fill:"black",
            fillOpacity:".3",
            strokeOpacity:"1",
            strokeDasharray:"0"
        },
        points:{
            fill:"white",
            fontfill:"black",
            fontSize:"12",
            r:"4",
            visible:true,
        },
        name:{
            fontfill:"black",
            fontSize:"12",
            visible:true,
        }
    }
}

export function add() {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let repository      = getRepository(Styles);
            let currentObject   = repository.create();
            currentObject.style = JSON.stringify(defaultStyle())
            await repository.save(currentObject);
            let data = await getData(getState,repository);
            dispatch({
                type: STYLES_ADD,
                data: data
            })
        }
        asyncProcess()
    }
}

export function del(ids) {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let repository      = getRepository(Styles);
            let data = await repository.find({
                where: {status:1},
            });
            await repository.remove(data);
            webix.message({ type:"info", text:'Удалено '+data.length+' элементов'});
            data = await getData(getState,repository);
            dispatch({
                type: STYLES_DEL,
                data: data
            })
        }
        asyncProcess()
    }
}

export function edit(obj,values) {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let repository      = getRepository(Styles);
            if(obj){
                for (var property in values) {
                    obj[property] = values[property]
                }
                await repository.save(obj)
            }
            let data = await getData(getState,repository);
            dispatch({
                type: STYLES_EDIT,
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
            type:STYLES_SORT,
            currentId: id,
            sort: {
                by:by,
                dir:dir,
                as:as
            },
        })
    }
}
