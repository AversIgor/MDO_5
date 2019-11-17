import {
    LOAD_CURENTPROJECT,    
} from '../../constants/decktop/curentproject'
import {getRepository} from "typeorm";
import {Curentproject} from "../TypeORM/entity/curentproject";

export function clearProject() {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let repository          = getRepository(Curentproject);
            let data = await repository.find({
                where: {id:0},
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
            await repository.save({id:0,saved:true,plot:plot})
        }
        asyncProcess()
    }
}

export function restoreProject() {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let repository      = getRepository(Curentproject);
            let data            = await repository.find();
            if(data.length != 0){
                dispatch({
                    type: LOAD_CURENTPROJECT,
                    saved: true,
                    plot: data[0].plot,
                    abris: data[0].abris,
                })
            }else{
                dispatch({
                    type: LOAD_CURENTPROJECT,
                    saved: false,
                    plot: undefined,
                    abris: undefined,
                })
            }
        }
        asyncProcess()
    }
}