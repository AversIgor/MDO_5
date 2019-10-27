import {
    SUBFORESTRY_FILL_SUCCESS,
    SUBFORESTRY_ADD,
    SUBFORESTRY_DEL,
    SUBFORESTRY_EDIT,
    SUBFORESTRY_SORT
} from '../../constants/reference/subforestry'

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

export default function subforestry(state = initialState, action) {
    switch(action.type) {
        case SUBFORESTRY_FILL_SUCCESS:
            return { ...state,
                data: action.data,
                where: action.where
            }
        case SUBFORESTRY_ADD:
            return { ...state,
                currentId: action.currentId,
                data: action.data,
            }
        case SUBFORESTRY_DEL:
            return { ...state,
                currentId: undefined,
                data: action.data,
            }
        case SUBFORESTRY_EDIT:
            return { ...state,
                currentId: action.currentId,
                data: action.data,
            }
        case SUBFORESTRY_SORT:
            return { ...state,
                currentId: action.currentId,
                sort: action.sort,
            }
        default:
            return state
    }
}

