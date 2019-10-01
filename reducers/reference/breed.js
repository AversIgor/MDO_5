import {
    BREED_FILL_SUCCESS,
    BREED_ADD,
    BREED_DEL,
    BREED_EDIT,
    BREED_SORT
} from '../../constants/reference/breed'

const initialState = {
    currentId:undefined,
    currentObject:undefined,
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

export default function breed (state = initialState, action) {
    switch(action.type) {
        case BREED_FILL_SUCCESS:
            return { ...state,
                data: action.data,
                options:action.options,
                where: action.where
            }
        case BREED_ADD:
            return { ...state,
                currentId: action.currentId,
                currentObject: action.currentObject,
                data: action.data,
                options:action.options,
            }
        
        case BREED_DEL:
            return { ...state,
                currentId: undefined,
                currentObject: undefined,
                data: action.data,
                options:action.options,
            }
        case BREED_EDIT:
            return { ...state,
                currentId: action.currentId,
                currentObject: action.currentObject,
                data: action.data,
                options:action.options,
            }
        case BREED_SORT:
            return { ...state,
                currentId: action.currentId,
                sort: action.sort,
            }
        default:
            return state
    }
}

