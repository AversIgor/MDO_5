import {
    CHANGE_PROPERTY,
} from '../../constants/plot'

const initialState = {    
    plotObject:undefined,
    curentRecount:undefined,//текущий объект перечета (объект таксации или порода)
}

export default function plot (state = initialState, action) {
    switch(action.type) {        
        case CHANGE_PROPERTY:
            return { ...state,
                plotObject:action.plotObject, 
            }  
        default:
            return state
    }
}
