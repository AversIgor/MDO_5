import {
    CHANGE_PROPERTY,
    CHANGE_RECOUNT,
} from '../../constants/plot'


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
                curentId:newValue.id
            })
        }
        return asyncProcess()
    }
}

export function updateBreed(newValue,recount) {
    return (dispatch,getState) => {
        let objectTaxation = recount.find(item => item.id == newValue.parentid);
        if(objectTaxation){
            let objectBreed = objectTaxation.objectsBreed.find(item => item.id == newValue.id);
            if(!objectBreed){
                objectBreed = {
                    id: newValue.id,                
                };
                objectTaxation.objectsBreed.push(objectBreed)
            }
            objectBreed.breed = newValue.breed;
            objectBreed.rank = newValue.rank;
        }
        const asyncProcess = async () => {
            dispatch({
                type: CHANGE_RECOUNT,
                recount: recount,
                curentId:newValue.id
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
                curentId:undefined
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
                curentId:parentid
            })
        }
        return asyncProcess()
    }
}
