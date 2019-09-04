import {
    LEFTMENU_RESIZE,
} from '../../constants/decktop/leftMenu'

export function resize(id) {

    return (dispatch,getState) => {
        dispatch({
            type: LEFTMENU_RESIZE,
            resize: !getState().leftMenu.resize,
        })
    }

}
