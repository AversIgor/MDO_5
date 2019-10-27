const initialState = {
    property:{
        location:{
            forestry:0,
            subforestry:0,
            tract:0,
            quarter:0,
            isolated:"",
            cuttingarea:"",
        },
        parameters:{
            purposeForests:0,
            property:0,
            methodscleaning:0,
            undergrowth:"",
            seedtrees:"",        
        },
        felling:{
            areacutting:0,
            formCutting:0,
            groupCutting:0,
            cuttingmethods:0,
        },
        taxation:{
            arearecount:0,
            coefficient:0,
            releasedate:"",
            valuationdate:"",
            estimator:"",
            methodTaxation:0,
            typesrates:0,
            rankTax:0,
        },
    },
    coefficients:[],
    objectsTaxation:[],
    results:[],
    objectTaxation:{
        id:0,        
        type:0,
        areacutting:0,
    },
    objectBreed:{
        id:0,        
        breed:0,
        tables:0,
        rank:0,
    },
    objectStep:{
        id:0,         
        step:0, 
        business:0,  
        halfbusiness:0,
        firewood:0,
    },
}

export default function plot (state = initialState, action) {
    switch(action.type) {
        default:
            return state
    }
}
