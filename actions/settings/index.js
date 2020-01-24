import {
    SETTINGS_EDIT,
    SETTINGS_FILL_SUCCESS,
    SETTINGS_RESTORE,
} from '../../constants/settings/index'


import {getRepository} from "typeorm";
import {Settings} from "../TypeORM/entity/settings";
import * as dump from "./dumpDB";

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
                data:value
            });
            let data            = await repository.find();
            if(data.length != 0){
                dispatch({
                    type: SETTINGS_EDIT,
                    data: data[0].data
                })
            }

        }
        asyncProcess()
    }
}

export function dumpDB() {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let dumpDB  = new dump.DumpDB(getState())
            await dumpDB.dump()
        }
        asyncProcess()
    }
}

export function restoreDB(event) {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let dumpDB  = new dump.DumpDB(getState())            
            let progress = await dumpDB.readFile(event)
            dispatch({
                type: SETTINGS_RESTORE,
                progress: progress
            })
            progress = await dumpDB.restoreForestry()
            dispatch({
                type: SETTINGS_RESTORE,
                progress: progress
            })
            progress = await dumpDB.restoreSubForestry()
            dispatch({
                type: SETTINGS_RESTORE,
                progress: progress
            })
            progress = await dumpDB.restoreTract()
            dispatch({
                type: SETTINGS_RESTORE,
                progress: progress
            })
            progress = await dumpDB.restorePublications()
            dispatch({
                type: SETTINGS_RESTORE,
                progress: progress
            })
            progress = await dumpDB.restoreBreeds()
            dispatch({
                type: SETTINGS_RESTORE,
                progress: progress
            })
        }
        asyncProcess()
    }
}


