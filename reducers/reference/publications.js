import {
    PUBLICATIONS_FILL_SUCCESS,
    PUBLICATIONS_ADD,
    PUBLICATIONS_DEL,
    PUBLICATIONS_EDIT,
    PUBLICATIONS_SORT,
    PUBLICATIONS_FILL_lISTPUBLICATION
} from '../../constants/reference/publications'

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
    },
    listPublication:[],      

}

export default function publications(state = initialState, action) {
    switch(action.type) {
        case PUBLICATIONS_FILL_SUCCESS:
            return { ...state,
                data: action.data,
                where: action.where
            }
        case PUBLICATIONS_ADD:
            return { ...state,
                currentId: action.currentId,
                data: action.data,
            }
        case PUBLICATIONS_DEL:
            return { ...state,
                currentId: undefined,
                data: action.data,
            }
        case PUBLICATIONS_EDIT:
            return { ...state,
                currentId: action.currentId,
                data: action.data,
            }
        case PUBLICATIONS_SORT:
            return { ...state,
                currentId: action.currentId,
                sort: action.sort,
            }
        case PUBLICATIONS_FILL_lISTPUBLICATION:
            return { ...state,
                listPublication: action.listPublication,
            }
        default:
            return state
    }
}

