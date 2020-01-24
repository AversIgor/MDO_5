import {
    ORM_COMPLETE,
    ORM_INIT
} from '../constants/TypeORM'

const initialState = {
    curentVersion: '5.2.1.18',
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
