import {
    LOAD_CURENTPROJECT,    
} from '../../constants/decktop/curentproject'
import {getRepository} from "typeorm";
import {Curentproject} from "../TypeORM/entity/curentproject";

export function clearProject(id) {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let repository          = getRepository(Curentproject);
            let data = await repository.find({
                where: {id:id},
            });
            await repository.remove(data);          
        }
        asyncProcess()
    }
}

export function saveCurentPlot(plot) {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let repository          = getRepository(Curentproject);
            await repository.save({id:0,data:plot})
        }
        asyncProcess()
    }
}

export function saveCurentAbris(abris) {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let repository          = getRepository(Curentproject);
            await repository.save({id:1,data:abris})
        }
        asyncProcess()
    }
}

export function restoreProject() {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let repository      = getRepository(Curentproject);
            let result = {
                type:   LOAD_CURENTPROJECT,
                plot:   undefined,
                abris:  undefined,
            }
            let data            = await repository.find();
            if(data.length > 0){
                result.plot = data[0].data
            }
            if(data.length > 1){
                result.abris = data[1].data
            }
            dispatch(result)          
        }
        asyncProcess()
    }
}