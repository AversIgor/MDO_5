import {
    TABLES_FILL_SUCCESS,
} from '../../constants/reference/tables'

const initialState = {
    data:[],
    where: {
        status:0
    },
}

export default function tables(state = initialState, action) {
    switch(action.type) {
        case TABLES_FILL_SUCCESS:
            return { ...state,
                data: action.data,
                where: action.where,
            }       
        default:
            return state
    }
}

