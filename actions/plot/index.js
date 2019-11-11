import {
    NEW_PLOT,
    CHANGE_PROPERTY,
    CHANGE_RECOUNT,
    CHANGE_CURENTRECOUNT,
    UPDATE_STEPS,
    CHANGE_COEFFICIENTS,
} from '../../constants/plot'

let lodash = require('lodash');

import * as mdo from "./mdoRecount";

export function mdoRecount(plotObject) {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let new_plotObject = lodash.cloneDeep(plotObject)
            new_plotObject.calculation()
        }
        return asyncProcess()
    }
}

export function newPlot() {
    return (dispatch,getState) => {
        dispatch({
            type: NEW_PLOT,
            plotObject: new mdo.PlotMDO()
        })
    }
}


export function changeProperty(plotObject,newValue) {
    return (dispatch,getState) => {  
        let new_plotObject = lodash.cloneDeep(plotObject)      
        new_plotObject.changeProperty(newValue)        
        dispatch({
            type: CHANGE_PROPERTY,
            plotObject: new_plotObject
        })
    }
}

export function updateObjectTaxation(plotObject,newValue) {
    return (dispatch,getState) => {
        let new_plotObject = lodash.cloneDeep(plotObject)
        let rowObjectTaxation = new_plotObject.getObjectTaxation(newValue)
        dispatch({
            type: CHANGE_RECOUNT,
            plotObject: new_plotObject,
            curentRecount:rowObjectTaxation
        })
    }
}

export function updateBreed(plotObject,newValue,breeds){
    return (dispatch,getState) => {
        let new_plotObject = lodash.cloneDeep(plotObject)
        let rowBreed = undefined        
        let rowObjectTaxation  = new_plotObject.getObjectTaxation({id:newValue.parentid})
        if(rowObjectTaxation){
            rowBreed = new_plotObject.getBreed(rowObjectTaxation,newValue)
            if(rowBreed){
                rowBreed = new_plotObject.getBreed(rowObjectTaxation,newValue)
                new_plotObject.feelSteps(rowBreed,breeds)
            }
        }
        dispatch({
            type: CHANGE_RECOUNT,
            plotObject: new_plotObject,
            curentRecount:rowBreed
        })
    }
}

export function deleteObjectTaxation(plotObject,id) {
    return (dispatch,getState) => {
        let new_plotObject = lodash.cloneDeep(plotObject)
        new_plotObject.deleteObjectTaxation(id)
        dispatch({
            type: CHANGE_RECOUNT,
            plotObject: new_plotObject,
            curentRecount:undefined
        })
    }
}

export function deleteBreed(plotObject,id,parentid) {
    return (dispatch,getState) => {
        let new_plotObject = lodash.cloneDeep(plotObject)
        let rowObjectTaxation  = new_plotObject.getObjectTaxation({id:parentid})
        if(rowObjectTaxation){
            new_plotObject.deleteBreed(rowObjectTaxation,id)
        }       
        dispatch({
            type: CHANGE_RECOUNT,
            plotObject: new_plotObject,
            curentRecount:rowObjectTaxation
        })
    }
}

export function changeCurentRecount(curentRecount) {
    return (dispatch,getState) => {
        dispatch({
            type: CHANGE_CURENTRECOUNT,
            curentRecount:curentRecount
        })
    }
}

export function changeCoeficients(plotObject,newCoefficients) {
    return (dispatch,getState) => {
        let new_plotObject = lodash.cloneDeep(plotObject)
        new_plotObject.changeCoeficients(newCoefficients)
        dispatch({
            type: CHANGE_COEFFICIENTS,
            plotObject:new_plotObject
        })
    }
}

export function updateStep(plotObject,curentRecount,stepValue) {
    return (dispatch,getState) => {
        let rowObjectTaxation   = plotObject.getObjectTaxation({id:curentRecount.parent})
        let rowBreed            = plotObject.getBreed(rowObjectTaxation,{id:curentRecount.id})
        plotObject.getStep(rowBreed,stepValue)
        //dispatch({})
    }
}
