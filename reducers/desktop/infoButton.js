import {
    INFOBUTTON_SET_BADGE
} from '../../constants/decktop/infoButton'

const initialState = {
    badge: '',
}

export default function InfoButton (state = initialState, action) {

    switch(action.type) {
        case INFOBUTTON_SET_BADGE:
            return {...state,
                badge:action.badge
            }
        default:
            return state
    }

}
