import {BD} from "../js/dao";
import {
    ORM_COMPLETE,
    ORM_INIT
} from '../constants/TypeORM'

const initialState = {
    curentVersion: BD.curentVersion,
    isUpdate: false,
}


export default function TypeORM (state = initialState, action) {
    switch(action.type) {
        case ORM_INIT:
            return {...state,
                isUpdate:action.isUpdate
            }
        case ORM_COMPLETE:
            return {...state}
        default:
            return state
    }    
}
