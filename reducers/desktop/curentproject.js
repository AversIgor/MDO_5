import {
    CURENTPROJECT_PLOT_EDIT,
    LOAD_CURENTPROJECT,
} from '../../constants/decktop/curentproject'

const initialState = {
    saved: false,
    plot: undefined,
}

export default function leftMenu (state = initialState, action) {
    switch(action.type) {
        case CURENTPROJECT_PLOT_EDIT:
            return {...state,
                plot:action.plot,
            }
        case LOAD_CURENTPROJECT://и МДО и еще чего нибудь
            return {...state,
                plot:action.plot,
                saved:action.saved,
            }
        default:
            return state
    }
}
