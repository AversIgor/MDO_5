import {
    FORESTRY_FILL_SUCCESS,
    FORESTRY_ADD,
    FORESTRY_DEL,
    FORESTRY_EDIT,
    FORESTRY_SORT
} from '../../constants/reference/forestry'

const initialState = {
    currentId:undefined,
    data:[],
    options:[],
    sort: {
        by:'id',
        dir:'asc',
        as:'int'
    },
    where: {
        status:0        
    }
}

export default function forestry(state = initialState, action) {
    switch(action.type) {
        case FORESTRY_FILL_SUCCESS:
            return { ...state,
                data: action.data,
                options:action.options,
                where: action.where
            }
        case FORESTRY_ADD:
            return { ...state,
                currentId: action.currentId,
                data: action.data,
                options:action.options,
            }
        
        case FORESTRY_DEL:
            return { ...state,
                currentId: undefined,
                data: action.data,
                options:action.options,
            }
        case FORESTRY_EDIT:
            return { ...state,
                currentId: action.currentId,
                data: action.data,
                options:action.options,
            }
        case FORESTRY_SORT:
            return { ...state,
                currentId: action.currentId,
                sort: action.sort,
            }
        default:
            return state
    }
}

