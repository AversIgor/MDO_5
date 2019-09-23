import {
    LEFTMENU_ID,
} from '../../constants/decktop/leftMenu'

export function clickMenu(id) {

    return (dispatch,getState) => {
        dispatch({
            type: LEFTMENU_ID,
            id: id,
        })
    }

}