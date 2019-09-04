import {
    METHODSCLEANINGS_FILL_SUCCESS,
    METHODSCLEANINGS_ADD,
    METHODSCLEANINGS_DEL,
    METHODSCLEANINGS_EDIT,
    METHODSCLEANINGS_SORT
} from '../../constants/reference/methodscleanings'

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

export default function methodscleanings(state = initialState, action) {
    switch(action.type) {
        case METHODSCLEANINGS_FILL_SUCCESS:
            return { ...state,
                data: action.data,
                where: action.where
            }
        case METHODSCLEANINGS_ADD:
            return { ...state,
                currentId: action.currentId,
                data: action.data,
            }
        case METHODSCLEANINGS_DEL:
            return { ...state,
                currentId: undefined,
                data: action.data,
            }
        case METHODSCLEANINGS_EDIT:
            return { ...state,
                currentId: action.currentId,
                data: action.data,
            }
        case METHODSCLEANINGS_SORT:
            return { ...state,
                currentId: action.currentId,
                sort: action.sort,
            }
        default:
            return state
    }
}

