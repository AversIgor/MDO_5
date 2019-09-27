import {
    INFOBUTTON_SET_BADGE
} from '../../constants/decktop/toolbar'


export function statusBadge() {
    return (dispatch,getState) => {
        dispatch({
            type: INFOBUTTON_SET_BADGE,
            badge: "!",
        })
    }
}

