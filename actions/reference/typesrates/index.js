import {
    TYPESRATES_FILL_SUCCESS,
    TYPESRATES_ADD,
    TYPESRATES_DEL,
    TYPESRATES_EDIT,
    TYPESRATES_SORT,
    TYPESRATES_FILL_REGIONS
} from '../../../constants/reference/typesrates'
import {getRepository} from "typeorm";
import {Typesrates} from "../../TypeORM/entity/typesrates";

export function defaultTypesrates() {

    let struct = [
        {'id':1,'status':0,'orderroundingrates':2,'predefined':true,'coefficientsindexing':1.43,'name':'Ставки Федерального уровня'},        
    ]

    return struct
}
let resources = '../../../resources/'

export function fill_regions() {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let payment_rates = await $.ajax(resources+'Payment_rates.xml');
            if(typeof (payment_rates) == 'string'){
                payment_rates = $.parseXML(payment_rates)
            }
            let regions = []
            $(payment_rates).find("Description").children().each(function () {
                regions.push($(this).attr("Name"))
            });            
            dispatch({
                type: TYPESRATES_FILL_REGIONS,
                regions: regions,
            })
        }
        return asyncProcess()
    }
}

export function fillFeedrates(paramFeedrate,breeds) {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let payment_rates = await $.ajax(resources+'Payment_rates.xml');
            if(typeof (payment_rates) == 'string'){
                payment_rates = $.parseXML(payment_rates)
            }
            let feedrates = []
            $(payment_rates).find("Description").children().each(function () {
                
                if($(this).attr("Name") == paramFeedrate.region){
			
                    $(this).children().each(function () {                        
                        var breeds_id = null;
                        for (var i = 0; i < breeds.length; i++) {
                            if(breeds[i].kodGulf == $(this).attr("ID")){
                                breeds_id = breeds[i].id;
                                break;
                            }
                        }
                        if(breeds_id != null){
                            $(this).children().each(function () {
                                var data = {};
                                data.breed = breeds_id;
                                data.ranktax = parseFloat($(this).attr("Category"));
                                data.large = parseFloat($(this).attr("Large").replace(",","."));
                                data.average = parseFloat($(this).attr("Average").replace(",","."));
                                data.small = parseFloat($(this).attr("Small").replace(",","."));
                                data.firewood = parseFloat($(this).attr("Firewood").replace(",","."));
                                feedrates.push(data);
                            })
                        }
                    })
                }
            });
            let values = {
                feedrates:feedrates,
            }
            dispatch(edit(paramFeedrate,values));
           
        }
        return asyncProcess()
    }
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