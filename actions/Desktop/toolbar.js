import {
    TOOLBAR_FILL_SUCCESS
} from '../../constants/desktop'
import {project} from "./projectMeny";
import {infoButton} from "./infoButton";
import {questionButton} from "./questionButton";
import {mainButton} from "./mainButton";
import {settingsButton} from "./settingsButton";


export function creatToolbar() {

    var elements = [];

    elements.push(project())
    elements.push(mainButton())
    elements.push(settingsButton())
    elements.push({})
    elements.push(infoButton())
    elements.push(questionButton())

    return (dispatch,getState) => {
        dispatch({
            type: TOOLBAR_FILL_SUCCESS,
            elements: elements,
        })
    }

}



