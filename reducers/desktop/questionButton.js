import {
    QUESTIONBATTON_FILL_SUCCESS,
} from '../../constants/decktop/questionButton'

const initialState = {
    data: [],
}

export default function questionButton (state = initialState, action) {
    switch(action.type) {
        case QUESTIONBATTON_FILL_SUCCESS:
            return {...state,
                data:action.data
            }
        default:
            return state
    }
}
