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
    objectsTaxation:[],
    results:[],
    rows:{
        objectTaxation:{   
            objectTaxation:1,
            areacutting:0,
        },
        objectBreed:{    
            breed:0,
            tables:0,
            rank:0,
        },
        objectStep:{     
            step:0, 
            business:0,  
            halfbusiness:0,
            firewood:0,
        },
    }   
}

export default function plot (state = initialState, action) {
    switch(action.type) {
        default:
            return state
    }
}
