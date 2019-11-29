import {
    CHANGE_PROPERTY,
    RECOUNTRESULT,
} from '../../constants/plot'

let cloneDeep = require('lodash/cloneDeep');

import * as plot from "./plot";
import * as recount from "./recount";

export function mdoRecount(plotObject) {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let state       = getState()
            let newRecount  = new recount.Recount()
            newRecount.setProperty({
                plot:plotObject,
                settings:state.settings.data.mdo,
                enumerations:state.enumerations,
                breed:state.breed.data,
                publications:state.publications.data,
            })            
            newRecount.calculation()
            dispatch({
                type: RECOUNTRESULT,
                recountResult: newRecount.getProperty("recountResult"),
            })
        }
        return asyncProcess()
    }
}

export function newPlot(restoreData) {
    return (dispatch,getState) => {
        if(!restoreData){
            dispatch({
                type: CHANGE_PROPERTY,
                plotObject: new plot.Plot(),
            })
        }else{
            dispatch({
                type: CHANGE_PROPERTY,
                plotObject: new plot.Plot(restoreData),
            })
        }
    }
}


export function changeProperty(plotObject,newValue) {
    return (dispatch,getState) => {  
        let new_plotObject = cloneDeep(plotObject)      
        new_plotObject.changeProperty(newValue)        
        dispatch({
            type: CHANGE_PROPERTY,
            plotObject: new_plotObject
        })
    }
}

export function updateObjectTaxation(plotObject,newValue) {
    return (dispatch,getState) => {
        let new_plotObject = cloneDeep(plotObject)
        new_plotObject.getObjectTaxation(newValue)
        new_plotObject.changeCurentRecount({
            objectTaxation:newValue.id,
            breed:undefined
        })
        dispatch({
            type: CHANGE_PROPERTY,
            plotObject: new_plotObject,
        })
    }
}

export function updateBreed(plotObject,newValue,breeds){
    return (dispatch,getState) => {
        let new_plotObject = cloneDeep(plotObject)
        let rowBreed = undefined        
        let rowObjectTaxation  = new_plotObject.getObjectTaxation({id:newValue.parent})
        if(rowObjectTaxation){
            rowBreed = new_plotObject.getBreed(rowObjectTaxation,newValue)
            if(rowBreed){
                new_plotObject.feelSteps(rowBreed,breeds)
                new_plotObject.changeCurentRecount({
                    objectTaxation:rowObjectTaxation.id,
                    breed:rowBreed.id
                })
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
        let new_plotObject = cloneDeep(plotObject)
        new_plotObject.deleteObjectTaxation(id)
        new_plotObject.changeCurentRecount({
            objectTaxation:undefined,
            breed:undefined
        })
        dispatch({
            type: CHANGE_PROPERTY,
            plotObject: new_plotObject,
        })
    }
}

export function deleteBreed(plotObject,id,parent) {
    return (dispatch,getState) => {
        let new_plotObject = cloneDeep(plotObject)
        let rowObjectTaxation  = new_plotObject.getObjectTaxation({id:parent})
        if(rowObjectTaxation){
            new_plotObject.deleteBreed(rowObjectTaxation,id)
            new_plotObject.changeCurentRecount({
                objectTaxation:rowObjectTaxation.id,
                breed:undefined
            })
        }       
        dispatch({
            type: CHANGE_PROPERTY,
            plotObject: new_plotObject,
        })
    }
}

export function changeCurentRecount(plotObject,curentRecount) {
    let new_plotObject = cloneDeep(plotObject)
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
        let new_plotObject = cloneDeep(plotObject)
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
