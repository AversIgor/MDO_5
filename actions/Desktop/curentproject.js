import {
    CURENTPROJECT_PLOT_EDIT,
    LOAD_CURENTPROJECT,
} from '../../constants/decktop/curentproject'
import {getRepository} from "typeorm";
import {Curentproject} from "../TypeORM/entity/curentproject";

export function saveCurentPlot(plot) {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let repository          = getRepository(Curentproject);
            await repository.save({
                id:0,
                saved:false,
                plot:plot
            })
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
                    plot: data[0].plot,
                    saved: data[0].saved,
                })
            }
        }
        asyncProcess()
    }
}