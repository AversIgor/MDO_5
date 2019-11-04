import {
    CHANGE_PROPERTY,
    CHANGE_RECOUNT,
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
    },
    coefficients:[],
    recount:[],
    curentRecount:undefined,
    results:[],    
}

export default function plot (state = initialState, action) {
    switch(action.type) {
        case CHANGE_PROPERTY:
            return { ...state,
                property: action.property,
            }    
        case CHANGE_RECOUNT:
            return { ...state,
                recount: action.recount.slice(),
                curentRecount: action.curentRecount,
            }      
        default:
            return state
    }
}
