import {
    LEFTMENU_FILL_SUCCESS,
    LEFTMENU_ID,
    LEFTMENU_RESIZE
} from '../../constants/decktop/leftMenu'

const initialState = {
    data: [],
    id: "",
    action:undefined,
    resize: false,
}

export default function InfoButton (state = initialState, action) {
    switch(action.type) {
        case LEFTMENU_FILL_SUCCESS:
            return {...state,
                data:action.data,
                id:"",
                action:action.action,
            }
        case LEFTMENU_ID:
            return {...state,
                id:action.id,
            }
        case LEFTMENU_RESIZE:
            return {...state,
                size:action.size,
            }
        default:
            return state
    }
}
