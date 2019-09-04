import {
    ABRISPRINTFORMS_FILL_SUCCESS,
    ABRISPRINTFORMS_ADD,
    ABRISPRINTFORMS_DEL,
    ABRISPRINTFORMS_EDIT,
} from '../../constants/reference/abrisprintforms'

const initialState = {
    currentId:undefined,
    data:[],
    sort: {
        by:'id',
        dir:'asc',
        as:'int'
    },
    where: {
        status:0
    }    
}

export default function abrisprintforms(state = initialState, action) {
    switch(action.type) {
        case ABRISPRINTFORMS_FILL_SUCCESS:
            return { ...state,
                data: action.data,
                where: action.where                
            }
        case ABRISPRINTFORMS_ADD:
            return { ...state,
                currentId: action.currentId,
                data: action.data,
            }
        case ABRISPRINTFORMS_DEL:
            return { ...state,
                currentId: undefined,
                data: action.data,
            }
        case ABRISPRINTFORMS_EDIT:
            return { ...state,
                currentId: action.currentId,
                data: action.data,
            }
        default:
            return state
    }
}

