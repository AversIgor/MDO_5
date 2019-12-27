import {
    LOAD_CURENTPROJECT,
} from '../../constants/decktop/curentproject'

//в эти переменные будем инициировать сохраненные но не выгруженные с прошлого сеанса объекты
const initialState = {
    plot: undefined,
    abris: undefined,
}

export default function curentproject (state = initialState, action) {
    switch(action.type) {
        case LOAD_CURENTPROJECT://и МДО и еще чего нибудь
            return {...state,
                plot:action.plot,
                abris:action.abris,
            }
        default:
            return state
    }
}
