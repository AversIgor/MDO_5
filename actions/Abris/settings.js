import {
    SETTINGS_EDIT,
    SETTINGS_FILL_SUCCESS,
} from '../../constants/settings/abris_settings'


import {getRepository} from "typeorm";
import {Abrissettings} from "../TypeORM/entity/abrissettings";

export function fill_data() {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let repository = getRepository(Abrissettings);
            let data = await repository.find();
            dispatch({
                type: SETTINGS_FILL_SUCCESS,
                data: data
            })
        }
        return asyncProcess()
    }
}

export function getRoundingSquare() {
    return [
        {"id":100,    "value":"До сотки"},
        {"id":10,   "value":"До 0,1 га"},
        {"id":1, "value":"До целого га"},
    ]
}

export function getRoundingAngle() {
    return [
        {"id":60,    "value":"До градусов"},
        {"id":30,   "value":"До 30 минут"},
        {"id":10, "value":"До 10 минут"},
        {"id":1, "value":"До 1 минуты"},
    ]
}

export function getRoundingLengths() {
    return [
        {"id":1,    "value":"До метров"},
        {"id":10,   "value":"До 10 сантиметров"},
        {"id":100, "value":"До 1 сантиметра"},
    ]
}



export function defaultSettings() {
    return {
        main:{
			typeangle:'Румбы',
        },
        rounding:{
            square:100, //1 - 1.0, 10  - 1.1,100  - 1.11,
            angle:30,//60 - грудусы, 30  - 30 минут , 10  - 10 минут, 1 - минуты
            lengths:10,//1 - 1.0, 10  - 1.1,100  - 1.11,
        },
        residual:{
            linear:1, //1 метр на 300 метров
            angle:30,//60 - грудусы, 30  - 30 минут , 10  - 10 минут, 1 - минуты
        },
    }
}

export function edit(id,value) {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let repository      = getRepository(Abrissettings);
            await repository.updateById(id,value);
            let data            = await repository.find();
            dispatch({
                type: SETTINGS_EDIT,
                data: data
            })
        }
        asyncProcess()
    }
}
