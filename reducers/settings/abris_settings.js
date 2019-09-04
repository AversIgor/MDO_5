import {
    SETTINGS_EDIT,
    SETTINGS_FILL_SUCCESS,
} from '../../constants/settings/abris_settings'

const initialState = {
    data:[],
}

export default function settings (state = initialState, action) {
    switch(action.type) {
        case SETTINGS_FILL_SUCCESS:
            return { ...state,
                data: action.data,
            }       
        case SETTINGS_EDIT:
            return { ...state,
                data: action.data,
            }
        default:
            return state
    }
}

