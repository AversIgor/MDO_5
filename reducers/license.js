import {
    LICENSE_CHECK,
} from '../constants/license'

const initialState = {
    numberlicense: '',//номер лицензии
    dateactive: '',//дата активацииe,
}


export default function license (state = initialState, action) {
    switch(action.type) {
        case LICENSE_CHECK:
            return {...state,
                numberlicense:action.numberlicense,
                dateactive:action.dateactive,         
            }
        default:
            return state
    }    
}
