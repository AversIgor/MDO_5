import {
    CURENTPROJECT_PLOT_EDIT,
    LOAD_CURENTPROJECT,
} from '../../constants/decktop/curentproject'
import {getRepository} from "typeorm";
import {Curentproject} from "../TypeORM/entity/curentproject";

let lodash = require('lodash');

export function saveCurentPlot(curentproject,plot) {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let repository          = getRepository(Curentproject);
            let new_curentproject   = lodash.cloneDeep(curentproject)
            new_curentproject.plot  = plot
            let row = await repository.save({
                id:0,
                data:new_curentproject
            })
            dispatch({
                type: CURENTPROJECT_PLOT_EDIT,
                plot: row.data.plot,
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
            dispatch({
                type: LOAD_CURENTPROJECT,
                plot: data[0].data.plot,
            })
        }
        asyncProcess()
    }
}