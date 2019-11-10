import {
    NEW_PLOT,
    CHANGE_PROPERTY,
    CHANGE_RECOUNT,
    CHANGE_CURENTRECOUNT,
    UPDATE_STEPS,
    CHANGE_COEFFICIENTS,
} from '../../constants/plot'

const initialState = {
    
    plotObject:undefined,
    curentRecount:undefined,//текущий объект перечета (объект таксации или порода)

    coefficients:{
        main:{},
        random:[]
    },//коэффициенты на ставки
    recount:[],//объекты таксации,площади/породы,разряды высот/ступени толщины,количество
    resultsRecount:[],//результат расчете МДО по перечетной ведомоти для печатной формы    
}

export default function plot (state = initialState, action) {
    switch(action.type) {        
        case NEW_PLOT:
            return { ...initialState,
                plotObject:action.plotObject,    
            }   
        case CHANGE_PROPERTY:
            return { ...state,
                plotObject: action.plotObject,
            }    
        case CHANGE_RECOUNT:
            return { ...state,
                recount: action.recount.slice(),
                curentRecount: action.curentRecount,
            }   
        case CHANGE_CURENTRECOUNT:
            return { ...state,
                curentRecount: action.curentRecount,
            }   
        case CHANGE_COEFFICIENTS:
            return { ...state,
                coefficients: action.coefficients,
            }   
        default:
            return state
    }
}
