import {  
    ABRIS_MODE_OBJECT,
    ABRIS_CREAT_OBJECT,
    ABRIS_EDIT_OBJECT,
    ABRIS_DELETE_OBJECT,
    ABRIS_CLEAR_CURENT_OBJECT,
    ABRIS_CLEAR_OBJECTS,
    ABRIS_CTRL_Z_OBJECT,
    ABRIS_RESTORING_OBJECT,
} from '../../constants/abris'

import {roundingSquare} from "../../actions/Abris/common";

const initialState = {
    objects:{},
    objectsTree:{},
    curentObject:undefined,    
    mode:1,
}

let historyEditObject = []

export function makeTree(objects) {
    var objectsTree = {};
    //корень дерева
    for(let key in objects) {
        let object = objects[key];
        if (object.parent == undefined){
            objectsTree[object.id] = object;
            object.childrens = {};
        }
    }
    //размещение дочерних элементов
    for(let key in objects){
        let object = objects[key];
        if (objectsTree[object.parent]){
            objectsTree[object.parent].childrens[object.id] = object
        }
    }
    //расчет экспуатационной площади - areaexploitation
    for(let key in objectsTree) {
        let objectParent = objectsTree[key];
        let areaexploitation = objectParent.area
        for(let keyChildrens in objectParent.childrens) {
            let objectChildren = objectParent.childrens[keyChildrens];
            if(objectChildren.nonexploitationarea){
                areaexploitation = areaexploitation-objectChildren.area
            }
            objectChildren.fillgeoJSON()
        }
        areaexploitation = roundingSquare(areaexploitation*10000)
        objectParent.areaexploitation = areaexploitation
        objectParent.fillgeoJSON()
    }

    return objectsTree;
}

export default function Polygons (state = initialState, action) {

    let objects     = state.objects
    let newObjects  = {}
        
    switch(action.type) {        
        case ABRIS_CREAT_OBJECT:
            historyEditObject = []
            historyEditObject.push(action.curentObject)
            newObjects  = {...objects}
            newObjects[action.curentObject.id] = action.curentObject;
            return {...state,
                curentObject:action.curentObject,
                mode:action.mode,
                objects:newObjects,
                objectsTree: makeTree(newObjects),
            }
        case ABRIS_EDIT_OBJECT:
            historyEditObject.push(state.curentObject)
            newObjects  = {...objects}
            if(newObjects[action.curentObject.id]){
                delete newObjects[action.curentObject.id];
            }
            newObjects[action.curentObject.id] = action.curentObject;
            return {...state,                
                curentObject:action.curentObject,
                objects:newObjects,
                objectsTree: makeTree(newObjects),
            }
        case ABRIS_RESTORING_OBJECT:
            historyEditObject = []
            return {...state,
                objects:action.objects,
                objectsTree: makeTree(action.objects),
            }
        case ABRIS_DELETE_OBJECT:
            historyEditObject = []
            newObjects  = {...objects}
            if(newObjects[action.curentObject.id]){
                delete newObjects[action.curentObject.id];
            }
            return {...state,
                objects:newObjects,
                objectsTree: makeTree(newObjects)
            }            
        case ABRIS_CLEAR_CURENT_OBJECT:
            historyEditObject = []
            return {...state,
                curentObject:action.curentObject,
            }
        case ABRIS_CLEAR_OBJECTS:
            historyEditObject = []
            return {...state,
                objects:{},
                objectsTree: makeTree({})
            }
        case ABRIS_MODE_OBJECT:
            return {...state,
                curentObject:action.curentObject,
                mode:action.mode,
            }
        case ABRIS_CTRL_Z_OBJECT:
            if(historyEditObject.length>0){
                return {...state,
                    curentObject:historyEditObject.pop(),
                }
            }else {
                return state
            }
        default:
            return state
    }
}