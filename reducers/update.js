import {
    UPDATE_CHECK,
    UPDATE_INIT,
    UPDATE_COMPLETE
} from '../constants/update'

const initialState = {
    newversion: '',
    isUpdate: false,
    textUpdate: '',
}


export default function update (state = initialState, action) {
    switch(action.type) {
        case UPDATE_CHECK:
            return {...state,
                isUpdate:action.isUpdate,
                newversion:action.newversion,                
            }
        case UPDATE_INIT:
            return {...state,
                textUpdate:action.textUpdate,
            }
        case UPDATE_COMPLETE:
            return {...initialState}
        default:
            return state
    }    
}
