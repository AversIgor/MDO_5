import {
    PRINTFORMS_FILL_SUCCESS,
    PRINTFORMS_ADD,
    PRINTFORMS_DEL,
    PRINTFORMS_EDIT,
} from '../../constants/reference/printforms'

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

export default function printforms(state = initialState, action) {
    switch(action.type) {
        case PRINTFORMS_FILL_SUCCESS:
            return { ...state,
                data: action.data,
                where: action.where                
            }
        case PRINTFORMS_ADD:
            return { ...state,
                currentId: action.currentId,
                data: action.data,
            }
        case PRINTFORMS_DEL:
            return { ...state,
                currentId: undefined,
                data: action.data,
            }
        case PRINTFORMS_EDIT:
            return { ...state,
                currentId: action.currentId,
                data: action.data,
            }
        default:
            return state
    }
}

