import {
    TRACT_FILL_SUCCESS,
    TRACT_ADD,
    TRACT_DEL,
    TRACT_EDIT,
    TRACT_SORT
} from '../../constants/reference/tract'

const initialState = {
    currentId:undefined,
    data:[],
    sort: {
        by:'id',
        dir:'asc',
        as:'int'
    }
}

export default function tract(state = initialState, action) {
    switch(action.type) {
        case TRACT_FILL_SUCCESS:
            return { ...state,
                data: action.data,
                where: action.where
            }
        case TRACT_ADD:
            return { ...state,
                currentId: action.currentId,
                data: action.data,
            }
        case TRACT_DEL:
            return { ...state,
                currentId: undefined,
                data: action.data,
            }
        case TRACT_EDIT:
            return { ...state,
                currentId: action.currentId,
                data: action.data,
            }
        case TRACT_SORT:
            return { ...state,
                currentId: action.currentId,
                sort: action.sort,
            }
        default:
            return state
    }
}

