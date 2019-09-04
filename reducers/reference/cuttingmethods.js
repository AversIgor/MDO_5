import {
    CUTTINGMETHODS_FILL_SUCCESS,
    CUTTINGMETHODS_ADD,
    CUTTINGMETHODS_DEL,
    CUTTINGMETHODS_EDIT,
    CUTTINGMETHODS_SORT
} from '../../constants/reference/cuttingmethods'

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

export default function cuttingmethods(state = initialState, action) {
    switch(action.type) {
        case CUTTINGMETHODS_FILL_SUCCESS:
            return { ...state,
                data: action.data,
                where: action.where
            }
        case CUTTINGMETHODS_ADD:
            return { ...state,
                currentId: action.currentId,
                data: action.data,
            }
        case CUTTINGMETHODS_DEL:
            return { ...state,
                currentId: undefined,
                data: action.data,
            }
        case CUTTINGMETHODS_EDIT:
            return { ...state,
                currentId: action.currentId,
                data: action.data,
            }
        case CUTTINGMETHODS_SORT:
            return { ...state,
                currentId: action.currentId,
                sort: action.sort,
            }
        default:
            return state
    }
}

