import {
    LEFTMENU_FILL_SUCCESS,
    LEFTMENU_ID,
} from '../../constants/decktop/leftMenu'


export function creatLeftMenu(action) {

    var data = [
        {id: "abrisv2", icon: "map-o",value:"Абрис (схема) v.2"},
    ];

    return (dispatch,getState) => {
        dispatch({
            type: LEFTMENU_FILL_SUCCESS,
            data: data,
            action: action,
        })
    }
}


export function clickLeftMenu(id) {
  
    return (dispatch,getState) => {
        dispatch({
            type: LEFTMENU_ID,
            id: id,
        })
    }

}
