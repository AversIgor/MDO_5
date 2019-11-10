export class PlotMDO {
    constructor(copy = false) {
        this.property = {
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
        }//свойства МДО
        this.coefficients = {
            main:{},
            random:[]
        }//коэффициенты на ставки
        this.recount = []//объекты таксации,площади/породы,разряды высот/ступени толщины,количество
        this.resultsRecount = []//результат расчете МДО по перечетной ведомоти для печатной формы
    }

    changeProperty(newProperty) {
        this.property = {...newProperty}
    }
}

export function calculation(property,recount,coefficients) {
    //прототип функции fill_arrayAssortmentStructure
    const asyncProcess = async () => {
        //let plot = new Plot()
       // plot.addObjectTaxation(recount)
       // return plot
    }
    return asyncProcess()
}
