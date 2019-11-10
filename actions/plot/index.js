import {
    NEW_PLOT,
    CHANGE_PROPERTY,
    CHANGE_RECOUNT,
    CHANGE_CURENTRECOUNT,
    UPDATE_STEPS,
    CHANGE_COEFFICIENTS,
} from '../../constants/plot'

export function newPlot() {
    return (dispatch,getState) => {
        dispatch({
            type: NEW_PLOT,
        })
    }
}

export function changeProperty(newProperty) {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            dispatch({
                type: CHANGE_PROPERTY,
                property: newProperty
            })
        }
        return asyncProcess()
    }
}

export function updateObjectTaxation(newValue,recount) {
    return (dispatch,getState) => {
        let objectTaxation = recount.find(item => item.id == newValue.id);
        if(!objectTaxation){
            objectTaxation = {
                id: newValue.id,
                objectsBreed:[],
            };
            recount.push(objectTaxation)
        }
        objectTaxation.areacutting = newValue.areacutting;
        objectTaxation.objectTaxation = newValue.objectTaxation;

        const asyncProcess = async () => {
            dispatch({
                type: CHANGE_RECOUNT,
                recount: recount,
                curentRecount:objectTaxation
            })
        }
        return asyncProcess()
    }
}

export function updateBreed(newValue,recount,breeds) {
    return (dispatch,getState) => {
        let objectTaxation  = recount.find(item => item.id == newValue.parentid);
        let objectBreed     = undefined
        if(objectTaxation){
            objectBreed = objectTaxation.objectsBreed.find(item => item.id == newValue.id);
            if(!objectBreed){
                objectBreed = {
                    id: newValue.id,
                    parent: objectTaxation.id,
                    steps:[],
                    objectsStep:[],                
                };
                objectTaxation.objectsBreed.push(objectBreed)
            }
            objectBreed.breed = newValue.breed;
            objectBreed.rank = newValue.rank;

            let breed = breeds.find(item => item.id == newValue.breed);
            let steps = breed.table.sorttables[newValue.rank];
            objectBreed.steps = Object.keys(steps)
            objectBreed.publication = breed.publication.fullname;
        }
        const asyncProcess = async () => {
            dispatch({
                type: CHANGE_RECOUNT,
                recount: recount,
                curentRecount:objectBreed
            })
        }
        return asyncProcess()
    }
}

export function deleteObjectTaxation(id,recount) {
    return (dispatch,getState) => {
        let index = recount.findIndex(item => item.id == id);
        if(index != -1){
            recount.splice(index, 1)
        }
        const asyncProcess = async () => {
            dispatch({
                type: CHANGE_RECOUNT,
                recount: recount,
                curentRecount:undefined
            })
        }
        return asyncProcess()
    }
}

export function deleteBreed(id,parentid,recount) {
    return (dispatch,getState) => {
        let parent = recount.find(item => item.id == parentid);
        if(parent){
            let index = parent.objectsBreed.findIndex(item => item.id == id);
            if(index != -1){
                parent.objectsBreed.splice(index, 1)
            }
        }
        const asyncProcess = async () => {
            dispatch({
                type: CHANGE_RECOUNT,
                recount: recount,
                curentRecount:parent
            })
        }
        return asyncProcess()
    }
}

export function changeCurentRecount(curentRecount) {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            dispatch({
                type: CHANGE_CURENTRECOUNT,
                curentRecount:curentRecount
            })
        }
        return asyncProcess()
    }
}

export function changeCoeficients(newCoefficients) {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            dispatch({
                type: CHANGE_COEFFICIENTS,
                coefficients:newCoefficients
            })
        }
        return asyncProcess()
    }
}

export function updateStep(row,recount,id,parentId) {
    
    let parent         = recount.find(item => item.id == parentId); 
    let curentRecount  = parent.objectsBreed.find(item => item.id == id);

    let objectStep = curentRecount.objectsStep.find(item => item.step == row.step);
    if(!objectStep){
        objectStep = {step:row.step}
        curentRecount.objectsStep.push(objectStep)
    }
    if(('business' in row) && (webix.rules.isNumber(row.business))){ objectStep.business = Math.abs(row.business)}
    if(('halfbusiness' in row) && (webix.rules.isNumber(row.halfbusiness))){ objectStep.halfbusiness = Math.abs(row.halfbusiness)}
    if(('firewood' in row) && (webix.rules.isNumber(row.firewood))){ objectStep.firewood = Math.abs(row.firewood)}

    return (dispatch,getState) => {
    }
}
