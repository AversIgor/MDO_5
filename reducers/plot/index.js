import {
    CHANGE_PROPERTY,
    RECOUNTRESULT,
} from '../../constants/plot'

const initialState = {    
    plotObject:undefined,
    curentRecount:undefined,//текущий объект перечета (объект таксации или порода)
    recount:[]
}

export default function plot (state = initialState, action) {
    switch(action.type) {        
        case CHANGE_PROPERTY:
            return { ...state,
                plotObject:action.plotObject, 
            }  
        case RECOUNTRESULT:
            return { ...state,
                recount:action.recount, 
            }  
        default:
            return state
    }
}
