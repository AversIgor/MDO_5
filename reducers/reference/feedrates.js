import {
    FEEDRATES_FILL_SUCCESS,
    FEEDRATES_ADD,
    FEEDRATES_DEL,
    FEEDRATES_EDIT,
    FEEDRATES_SORT
} from '../../constants/reference/feedrates'

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

export default function cuttinfeedratesgmethods(state = initialState, action) {
    switch(action.type) {
        case FEEDRATES_FILL_SUCCESS:
            return { ...state,
                data: action.data,
                options:action.options,
                where: action.where
            }
        case FEEDRATES_ADD:
            return { ...state,
                currentId: action.currentId,
                data: action.data,
                options:action.options,
            }
        case FEEDRATES_DEL:
            return { ...state,
                currentId: undefined,
                data: action.data,
                options:action.options,
            }
        case FEEDRATES_EDIT:
            return { ...state,
                currentId: action.currentId,
                data: action.data,
                options:action.options,
            }
        case FEEDRATES_SORT:
            return { ...state,
                currentId: action.currentId,
                sort: action.sort,
            }
        default:
            return state
    }
}

