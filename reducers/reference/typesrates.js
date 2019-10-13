import {
    TYPESRATES_FILL_SUCCESS,
    TYPESRATES_ADD,
    TYPESRATES_EDIT,
    TYPESRATES_DEL,
    TYPESRATES_SORT,
    TYPESRATES_FILL_REGIONS
} from '../../constants/reference/typesrates'

const initialState = {
    currentId:undefined,
    data:[],
    options:[],
    regions:[],
    sort: {
        by:'id',
        dir:'asc',
        as:'int'
    },
    where: {
        status:0
    }
}

export default function typesrates(state = initialState, action) {
    switch(action.type) {
        case TYPESRATES_FILL_SUCCESS:
            return { ...state,
                data: action.data,
                options:action.options,
                where: action.where
            }
        case TYPESRATES_ADD:
            return { ...state,
                currentId: action.currentId,
                data: action.data,
                options:action.options,
            }
        case TYPESRATES_DEL:
            return { ...state,
                currentId: undefined,
                data: action.data,
                options:action.options,
            }
        case TYPESRATES_EDIT:
            return { ...state,
                currentId: action.currentId,
                data: action.data,
                options:action.options,
            }
        case TYPESRATES_SORT:
            return { ...state,
                currentId: action.currentId,
                sort: action.sort,
            }
        case TYPESRATES_FILL_REGIONS:
            return { ...state,
                regions: action.regions,
            }
        default:
            return state
    }
}

