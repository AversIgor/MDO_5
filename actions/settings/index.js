import {
    SETTINGS_EDIT,
    SETTINGS_FILL_SUCCESS,
} from '../../constants/settings/index'


import {getRepository} from "typeorm";
import {Settings} from "../TypeORM/entity/settings";

export function fill_data() {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let repository = getRepository(Settings);
            let data = await repository.find();
            if(data.length != 0){
                dispatch({
                    type: SETTINGS_FILL_SUCCESS,
                    data: data[0].data
                })
            }
        }
        return asyncProcess()
    }
}


export function edit(value) {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let repository      = getRepository(Settings);
            await repository.save({
                id:0,
                data:JSON.stringify(value)
            });
            let data            = await repository.find();
            dispatch({
                type: SETTINGS_EDIT,
                data: data[0].data
            })
        }
        asyncProcess()
    }
}
