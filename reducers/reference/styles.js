import {
    STYLES_FILL_SUCCESS,
    STYLES_ADD,
    STYLES_DEL,
    STYLES_EDIT,
    STYLES_SORT
} from '../../constants/reference/styles'

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

export default function styles(state = initialState, action) {
    switch(action.type) {
        case STYLES_FILL_SUCCESS:
            return { ...state,
                data: action.data,
                where: action.where                
            }
        case STYLES_ADD:
            return { ...state,
                currentId: action.currentId,
                data: action.data,
            }
        case STYLES_DEL:
            return { ...state,
                currentId: undefined,
                data: action.data,
            }
        case STYLES_EDIT:
            return { ...state,
                currentId: action.currentId,
                data: action.data,
            }
        case STYLES_SORT:
            return { ...state,
                currentId: action.currentId,
                sort: action.sort,
            }
        default:
            return state
    }
}

