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
        }
    }

    getStep(objectBreed,stepValue) {
        let row = objectBreed.objectsStep.find(item => item.step == stepValue.step);
        if(!row){
            row = {
                step:stepValue.step
            }
            objectBreed.objectsStep.push(row)
        }
        if(('business' in stepValue) && (webix.rules.isNumber(stepValue.business))){ row.business = Math.abs(stepValue.business)}
        if(('halfbusiness' in stepValue) && (webix.rules.isNumber(stepValue.halfbusiness))){ row.halfbusiness = Math.abs(stepValue.halfbusiness)}
        if(('firewood' in stepValue) && (webix.rules.isNumber(stepValue.firewood))){ row.firewood = Math.abs(stepValue.firewood)}

        return row
    }



    //здесь буде на основе перечетной ведомости создавать Новое дерево даных и дополнять его данными
    calculation(state) {
        const asyncProcess = async () => {
            for (let i = 0; i < this.recount.length; i++) {
                let row_objectTaxation = this.recount[i];
                //проверка на сплошной и ленточный перечет
                if(!this.check_methodTaxation(row_objectTaxation.objectTaxation)) continue;

                for (let j = 0; j < row_objectTaxation.objectsBreed.length; j++) {
                    let row_objBreed = row_objectTaxation.objectsBreed[j];
                    for (let k = 0; k < row_objBreed.objectsStep.length; k++) {
                        let row_objStep = row_objBreed.objectsStep[k];
                        console.log(state)
                        //на этом уровне заполним сортиментную структуру на основе сортиментных таблиц и настроек МДО				
                        let objAssortmentStructure = fillStepFromSortTablesAndSettings(
                            row_objBreed,
                            row_objStep,
                            state.settings.data.mdo
                        );
                        //if(objAssortmentStructure != null){
                        //    objBreed.addAssortmentStructure(objAssortmentStructure);
                        //}
                    }
                    
                    
                    //сформируем итоговую строку по ступеням толщины - сделае это потом
                    //let objTotalStep = new ClassAssortmentStructure({});			

                }
            }            
        }
        return asyncProcess()
    }

    check_methodTaxation(objectTaxation) {	
        var result = true;	
        if(this.property.taxation.methodTaxation == 1){
            if(objectTaxation.id == 5){
                result = false;
            }
        }else{
            if(objectTaxation.id != 5){
                result = false;
            }	
        } 	
        return result;        
    }

}

function fillStepFromSortTablesAndSettings(objBreed,objStep,settings) { 

	var business 		= parseInt(objStep.business) || 0;
	var halfbusiness 	= parseInt(objStep.halfbusiness) || 0;
	var firewood 		= parseInt(objStep.firewood) || 0;
	if(business+halfbusiness+firewood == 0){
		return undefined;
    }
    	
	//распределим полуделовые				
	var halfbusinessFor = (halfbusiness-halfbusiness%2)/2; //целочилостное деление
    let business_r = 0;
    let firewood_r = 0;
	if(!settings.distributionhalfbusiness){
		business_r = business+halfbusiness-halfbusinessFor;
		firewood_r = firewood+halfbusinessFor;
	}else{
		business_r = business+halfbusinessFor;
		firewood_r = firewood+halfbusiness-halfbusinessFor;
	}

    let rowSortTable 			= undefined;
    let rowSortFirewoodTable    = undefined;//сортиментная таблица для дровяных стволов
    if('sorttables' in objBreed) rowSortTable 			        = objBreed.sorttables[objStep.step];
    if('sorttablesfirewood' in objBreed) rowSortFirewoodTable   = objBreed.sorttablesfirewood[objStep.step];

	if(!rowSortTable){
        webix.message({
            text:'Не найдено данных в сортиментной таблице для породы "'+objBreed.value+'", разряда высот: "'+
                objBreed.rank+', ступени толщины: "'+objStep.step+'"!',
            type:"error", 
            expire: 10000});
		return undefined;
    }    
	
	//Учет дров от дровяных деревьев в зависимости от настроек	
	var technical_f 		= parseFloat(rowSortTable.technical_f);
	var	firewood_f 			= parseFloat(rowSortTable.firewood_f);	
	
	var totalfirewood_f 	= 0;				
	if(settings.assessfirewoodcommonstock) {
		totalfirewood_f	= technical_f + firewood_f;
	}
	
	//отходы
    var waste_f		= parseFloat(rowSortTable.waste_f);
    
    console.log(objBreed)

	if(objBreed.kodGulf == '304200'){
		if(settings.firewoodtrunkslindencountedinbark == 1 && settings.barklindenindividualreserves == 1) {
			//добавим кору если она отдельно и учет в коре
			firewood_f += parseFloat(rowSortTable.bark);
			waste_f += parseFloat(rowSortTable.bark);
		}
		if(settings.firewoodtrunkslindencountedinbark == 0 && constantValues.barklindenindividualreserves == 0) {
			//убавим кору если она вместе с отходами и учет без коры
			firewood_f -= parseFloat(rowSortTable.bark);
			waste_f -= parseFloat(rowSortTable.bark);
		}	
	}
	
	if(waste_f < 0) {
		waste_f = 0;	
	}

	//всего дров
	if(constantValues.assessfirewoodcommonstock == 1) {
		//по общему запасу
		if(constantValues.assesswastefirewood == 1) {
			//использовать отходы
			totalfirewood_f = totalfirewood_f + waste_f;
		}
	}	
	
	
	var average 	= round_value((parseFloat(rowSortTable.average1)+parseFloat(rowSortTable.average2))*business_r,2);
	var large 		= round_value(parseFloat(rowSortTable.large)*business_r,2);
	var small 		= round_value(parseFloat(rowSortTable.small)*business_r,2);
	var waste_b		= round_value(parseFloat(rowSortTable.waste_b)*business_r,2);
	var technical_b = round_value(parseFloat(rowSortTable.technical_b)*business_r,2);
	var firewood_b 	= round_value(parseFloat(rowSortTable.firewood_b)*business_r,2);
	
	if(rowSortFirewoodTable != null){
		large 		= large			+	round_value(parseFloat(rowSortFirewoodTable.large)*firewood_r,2);
		small 		= small			+	round_value(parseFloat(rowSortFirewoodTable.small)*firewood_r,2);
		average 	= average		+	round_value((parseFloat(rowSortFirewoodTable.average1)+parseFloat(rowSortFirewoodTable.average2))*firewood_r,2);
		waste_b		= waste_b		+	round_value(parseFloat(rowSortFirewoodTable.waste_b)*firewood_r,2);
		technical_b	= technical_b	+	round_value(parseFloat(rowSortFirewoodTable.technical_b)*firewood_r,2);
		firewood_b	= firewood_b	+	round_value(parseFloat(rowSortFirewoodTable.firewood_b)*firewood_r,2);
	}

	var totalfirewood_b 	= 0;
	if(constantValues.assessfirewoodcommonstock == 1) {
		totalfirewood_b	= technical_b + firewood_b;
	}	

	var options = {	'recid'	:			objStep.recid,		
					'step'	:			objStep.step,
					'business'	:		business,
					'halfbusiness'	:	halfbusiness,
					'firewood'	:		firewood,
					'total'			:	business + firewood + halfbusiness,
					'business_r'	:	business_r,
					'firewood_r'	:	firewood_r,
					'total_r'		:	business_r + firewood_r,
					'large'	:			large,
					'average'	:		average,
					'small'	:			small,
					'totalbusiness_b':	large+average+small,
					'technical_b':		technical_b,
					'firewood_b':		firewood_b,
					'totalfirewood_b':	totalfirewood_b,
					'waste_b':			waste_b,
					
					'technical_f':		Math.round(technical_f*firewood_r*1000)/1000,
					'firewood_f':		Math.round(firewood_f*firewood_r*1000)/1000,
					'waste_f':			Math.round(waste_f*firewood_r*1000)/1000,
					'totalfirewood_f':	Math.round(totalfirewood_f*firewood_r*1000)/1000
				};


	var objAssortmentStructure = new ClassAssortmentStructure(options);	

	
	return objAssortmentStructure;

}


//Строка расчета сортиментной структура
class ClassAssortmentStructure {

    constructor(options) {
        this.id			    = '';
        this.step 			= 0;
        this.business 		= 0;
        this.halfbusiness	= 0;
        this.firewood 		= 0;
        this.total  		= 0;
        this.business_r		= 0;
        this.firewood_r		= 0;
        this.total_r		= 0;
        this.large 			= 0;
        this.average 		= 0;
        this.small 			= 0;
        this.totalbusiness_b= 0;//всего деловая, 			в этом объекте не заполняется
        this.technical_b	= 0;
        this.firewood_b		= 0;
        this.totalfirewood_b= 0;//всего дрова от деловых,	заполняется если оценка по общему запасу дров!!!
        this.liquidity		= 0;//ликвид, 					в этом объекте не заполняется
        this.waste_b 		= 0;
        this.total_b 		= 0;//всего деловых деревьев, 	в этом объекте не заполняется
        
        this.technical_f	= 0;
        this.firewood_f		= 0;
        this.waste_f		= 0;
        this.totalfirewood_f= 0;//всего ликвидных дров от дровяных, заполняется если оценка по общему запасу дров!!!
        this.total_f 		= 0;//всего дровяных деревьев, 	в этом объекте не заполняется
        
        for (var key in options) {
            this[key] = options[key];
        }
    }
}