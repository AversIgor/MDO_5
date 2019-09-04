import {
    LEFTMENU_FILL_SUCCESS,
} from '../../constants/decktop/leftMenu'

export function creatLeftMenu(context) {

    var data = [
        {id: "orginfo",value:"Данные организации"},
        {id: "database",value:"База данных"},
      
    ];

    return (dispatch,getState) => {
        dispatch({
            type: LEFTMENU_FILL_SUCCESS,
            data: data,
            context: context,
        })
    }
}


