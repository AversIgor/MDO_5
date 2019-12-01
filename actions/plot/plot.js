let uniq = require('lodash/uniq');
let sortBy = require('lodash/sortBy');

export class Plot {
    constructor(data = undefined) {
        if(data){
            Object.assign(this, data);
        }else{
            this.curentRecount = {
                objectTaxation:undefined,
                breed:undefined
            }//текущая ветка объекта перечета
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
            this.publications = []
            this.recount = []//объекты таксации,площади/породы,разряды высот/ступени толщины,количество
        }        
    }

    changeCurentRecount(newValue) {
        this.curentRecount = {...newValue}
    }

    changeProperty(newValue) {
        this.property = {...newValue}
    }

    changeCoeficients(newValue) {
        this.coefficients = {...newValue}
    }

    getObjectTaxation(objectTaxationValue) {
        let row = this.recount.find(item => item.id == objectTaxationValue.id);
        if(!row){
            row = {
                id: objectTaxationValue.id,
                objectsBreed:[],
            };
            this.recount.push(row)
        }
        if('areacutting' in objectTaxationValue) row.areacutting = objectTaxationValue.areacutting; 
        if('objectTaxation' in objectTaxationValue) row.objectTaxation = objectTaxationValue.objectTaxation;   

        return row
    }

    deleteObjectTaxation(id) {
        let index = this.recount.findIndex(item => item.id == id);
        if(index != -1){
            this.recount.splice(index, 1)
        }
    }

    getBreed(objectTaxation,breedValue) {
        let row = objectTaxation.objectsBreed.find(item => item.id == breedValue.id);
        if(!row){
            row = {
                id: breedValue.id,                
                parent: objectTaxation.id,
                steps:[],
                objectsStep:[],                
            };
            objectTaxation.objectsBreed.push(row)
        }
        if('rank' in breedValue)  row.rank = breedValue.rank;  
        if('breed' in breedValue) row.breed = breedValue.breed;
        return row
    }

    deleteBreed(objectTaxation,id) {
        let index = objectTaxation.objectsBreed.findIndex(item => item.id == id);
        if(index != -1){
            objectTaxation.objectsBreed.splice(index, 1)
        }
    }

    //Заполнение породы ступенями толщины из справочника пород
    feelSteps(objectBreed,breeds) {
        let breed = breeds.find(item => item.id == objectBreed.breed);
        if(breed){
            if(('table' in breed) && ('sorttables' in breed.table)){
                let sorttables      = breed.table.sorttables[objectBreed.rank];
                objectBreed.steps   = Object.keys(sorttables)                
            }  
            if(breed.publication){
                this.publications.push(breed.publication.name)
                this.publications = uniq(this.publications)
            }         
        }
    }

    getStep(objectBreed,stepValue) {
        let row = objectBreed.objectsStep.find(item => item.step == stepValue.step);
        if(!row){
            row = {
                step:stepValue.step
            }
            objectBreed.objectsStep.push(row)
            let sortArray = sortBy(objectBreed.objectsStep,['step'])
            objectBreed.objectsStep = []
            objectBreed.objectsStep.push(...sortArray)
        }
        if(('business' in stepValue) && (webix.rules.isNumber(stepValue.business))){ row.business = Math.abs(stepValue.business)}
        if(('halfbusiness' in stepValue) && (webix.rules.isNumber(stepValue.halfbusiness))){ row.halfbusiness = Math.abs(stepValue.halfbusiness)}
        if(('firewood' in stepValue) && (webix.rules.isNumber(stepValue.firewood))){ row.firewood = Math.abs(stepValue.firewood)}

        return row
    }
}