import {
    INFOBUTTON_SET_BADGE,
    TOOLBAR_QUESTIONMENU_ID
} from '../../constants/decktop/toolbar'

const initialState = {
    badge: '',
    questionId: '',
}

export default function InfoButton (state = initialState, action) {
    switch(action.type) {
        case INFOBUTTON_SET_BADGE:
            return {...state,
                badge:action.badge
            }
        case TOOLBAR_QUESTIONMENU_ID:
            return {...state,
                questionId:action.id
            }
        default:
            return state
    }

}
