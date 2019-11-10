import {
    NEW_PLOT,
    CHANGE_PROPERTY,
    CHANGE_RECOUNT,
    CHANGE_CURENTRECOUNT,
    UPDATE_STEPS,
    CHANGE_COEFFICIENTS,
} from '../../constants/plot'

const initialState = {
    property:{
        location:{
            forestry:0,
            subforestry:0,
            tract:0,
            quarter:0,
            isolated:"",
            cuttingarea:0,
        },
        parameters:{
            purposeForests:1,
            property:1,
            methodscleaning:0,
            undergrowth:"",
            seedtrees:"",        
        },
        felling:{
            areacutting:0,
            formCutting:1,
            groupCutting:1,
            cuttingmethods:20,
        },
        taxation:{
            arearecount:0,
            coefficient:1,
            releasedate:new Date(),
            valuationdate:new Date(),
            estimator:"",
            methodTaxation:1,
            typesrates:1,
            rankTax:1,
        },
    },//свойства МДО
    coefficients:{
        main:{},
        random:[]
    },//коэффициенты на ставки
    recount:[],//объекты таксации,площади/породы,разряды высот/ступени толщины,количество
    curentRecount:undefined,//текущий объект перечета (объект таксации или порода)
    resultsRecount:[],//результат расчете МДО по перечетной ведомоти для печатной формы    
}

export default function plot (state = initialState, action) {
    switch(action.type) {        
        case NEW_PLOT:
            return { ...initialState,
                recount:[],
                resultsRecount:[],    
            }   
        case CHANGE_PROPERTY:
            return { ...state,
                property: action.property,
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
