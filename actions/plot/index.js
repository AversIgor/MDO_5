import {
    CHANGE_PROPERTY,
} from '../../constants/plot'

let lodash = require('lodash');

import * as mdo from "./mdoRecount";

export function mdoRecount(plotObject) {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let new_plotObject = lodash.cloneDeep(plotObject)
            let state = getState()
            new_plotObject.calculation(state)
        }
        return asyncProcess()
    }
}

export function newPlot(restoreData) {
    return (dispatch,getState) => {
        if(!restoreData){
            dispatch({
                type: CHANGE_PROPERTY,
                plotObject: new mdo.PlotMDO(),
            })
        }else{
            dispatch({
                type: CHANGE_PROPERTY,
                plotObject: new mdo.PlotMDO(restoreData),
            })
        }
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
            type: CHANGE_PROPERTY,
            plotObject: new_plotObject,
        })
    }
}

export function updateBreed(plotObject,newValue,breeds){
    return (dispatch,getState) => {
        let new_plotObject = lodash.cloneDeep(plotObject)
        let rowBreed = undefined        
        let rowObjectTaxation  = new_plotObject.getObjectTaxation({id:newValue.parent})
        if(rowObjectTaxation){
            rowBreed = new_plotObject.getBreed(rowObjectTaxation,newValue)
            if(rowBreed){
                rowBreed = new_plotObject.getBreed(rowObjectTaxation,newValue)
                new_plotObject.feelSteps(rowBreed,breeds)
            }
        }
        dispatch({
            type: CHANGE_PROPERTY,
            plotObject: new_plotObject,
        })
    }
}

export function deleteObjectTaxation(plotObject,id) {
    return (dispatch,getState) => {
        let new_plotObject = lodash.cloneDeep(plotObject)
        new_plotObject.deleteObjectTaxation(id)
        dispatch({
            type: CHANGE_PROPERTY,
            plotObject: new_plotObject,
        })
    }
}

export function deleteBreed(plotObject,id,parent) {
    return (dispatch,getState) => {
        let new_plotObject = lodash.cloneDeep(plotObject)
        let rowObjectTaxation  = new_plotObject.getObjectTaxation({id:parent})
        if(rowObjectTaxation){
            new_plotObject.deleteBreed(rowObjectTaxation,id)
        }       
        dispatch({
            type: CHANGE_PROPERTY,
            plotObject: new_plotObject,
        })
    }
}

export function changeCurentRecount(plotObject,curentRecount) {
    let new_plotObject = lodash.cloneDeep(plotObject)
    new_plotObject.changeCurentRecount(curentRecount)
    return (dispatch,getState) => {
        dispatch({
            type: CHANGE_PROPERTY,
            plotObject: new_plotObject
        })
    }
}

export function changeCoeficients(plotObject,newCoefficients) {
    return (dispatch,getState) => {
        let new_plotObject = lodash.cloneDeep(plotObject)
        new_plotObject.changeCoeficients(newCoefficients)
        dispatch({
            type: CHANGE_PROPERTY,
            plotObject:new_plotObject
        })
    }
}

export function updateStep(plotObject,stepValue) {
    return (dispatch,getState) => {
        let rowObjectTaxation   = plotObject.getObjectTaxation({id:plotObject.curentRecount.objectTaxation})
        let rowBreed            = plotObject.getBreed(rowObjectTaxation,{id:plotObject.curentRecount.breed})
        plotObject.getStep(rowBreed,stepValue)
    }
}
