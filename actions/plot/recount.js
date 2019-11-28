
export class Recount {
    constructor() {
        this.plot = undefined
        this.setting = undefined
        this.enumerations = undefined
        this.breed = undefined
        this.recountResult = []//результат расчете МДО по перечетной ведомости для печатной формы   
    }

    setProperty(data){
        Object.assign(this, data);
    }

    getProperty(name){
        return this[name];
    }


    getValueFromId(id,collection,field = undefined) {
        let value = collection.find(item => item.id == id);
        if(field){
            value = value[field]
        }
        return value
    }

    //здесь будем на основе перечетной ведомости создавать Новое дерево данных и дополнять его данными
    calculation() {        
        const asyncProcess = async () => {
            for (let i = 0; i < this.plot.recount.length; i++) {
                let row_objectTaxation = this.plot.recount[i];
                let objectTaxation = this.getValueFromId(row_objectTaxation.objectTaxation,this.enumerations.objectTaxation);
                
                //проверка на сплошной и ленточный перечет
                if(!this.check_methodTaxation(row_objectTaxation.objectTaxation)) continue;                

                for (let j = 0; j < row_objectTaxation.objectsBreed.length; j++) {
                    let row_objBreed = row_objectTaxation.objectsBreed[j];
                    let objBreed = this.getValueFromId(row_objBreed.breed,this.breed)                

                    //строка с описанием породы и объекта таксации
                    let row = {
                        objectTaxation:objectTaxation.value,  
                        areacutting:row_objectTaxation.areacutting,
                        rank:row_objBreed.rank,
                        breed:objBreed.value,                    
                    }
                    this.recountResult.push(row)

                    //сформируем итоговую строку по ступеням толщины
			        let objTotalStep = new ClassAssortmentStructure({});
                    for (let k = 0; k < row_objBreed.objectsStep.length; k++) {
                        let row_objStep = row_objBreed.objectsStep[k];
                        //на этом уровне заполним сортиментную структуру на основе сортиментных таблиц и настроек МДО				
                        let objAssortmentStructure = this.fillStepFromSortTablesAndSettings(
                            objBreed,
                            row_objBreed,
                            row_objStep,
                            objTotalStep
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
        if(this.plot.property.taxation.methodTaxation == 1){
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

    fillStepFromSortTablesAndSettings(objBreed,rowBreed,rowStep,totalStep) { 

        var business 		= parseInt(rowStep.business) || 0;
        var halfbusiness 	= parseInt(rowStep.halfbusiness) || 0;
        var firewood 		= parseInt(rowStep.firewood) || 0;
        if(business+halfbusiness+firewood == 0){
            return undefined;
        }
            
        //распределим полуделовые				
        var halfbusinessFor = (halfbusiness-halfbusiness%2)/2; //целочилостное деление
        let business_r = 0;
        let firewood_r = 0;
        if(!this.settings.distributionhalfbusiness){
            business_r = business+halfbusiness-halfbusinessFor;
            firewood_r = firewood+halfbusinessFor;
        }else{
            business_r = business+halfbusinessFor;
            firewood_r = firewood+halfbusiness-halfbusinessFor;
        }
    
        //данные бере из породы
        let rowSortTable 			= undefined;
        let rowSortFirewoodTable    = undefined;//сортиментная таблица для дровяных стволов
        if('sorttables' in objBreed) rowSortTable 			        = objBreed.sorttables[rowStep.step];
        if('sorttablesfirewood' in objBreed) rowSortFirewoodTable   = objBreed.sorttablesfirewood[rowStep.step];
    
        console.log(rowSortTable)
        if(!rowSortTable){
            webix.message({
                text:'Не найдено данных в сортиментной таблице для породы "'+objBreed.value+'", разряда высот: "'+
                    rowBreed.rank+', ступени толщины: "'+rowStep.step+'"!',
                type:"error", 
                expire: 10000});
            return undefined;
        }    
        
        //Учет дров от дровяных деревьев в зависимости от настроек	
        var technical_f 		= parseFloat(rowSortTable.technical_f);
        var	firewood_f 			= parseFloat(rowSortTable.firewood_f);	
        
        var totalfirewood_f 	= 0;				
        if(this.settings.assessfirewoodcommonstock) {
            totalfirewood_f	= technical_f + firewood_f;
        }
        
        //отходы
        var waste_f		= parseFloat(rowSortTable.waste_f);    
    
        if(objBreed.kodGulf == '304200'){
            if(this.settings.firewoodtrunkslindencountedinbark == 1 && this.settings.barklindenindividualreserves == 1) {
                //добавим кору если она отдельно и учет в коре
                firewood_f += parseFloat(rowSortTable.bark);
                waste_f += parseFloat(rowSortTable.bark);
            }
            if(this.settings.firewoodtrunkslindencountedinbark == 0 && constantValues.barklindenindividualreserves == 0) {
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
    
        var options = {	'step'	:			rowStep.step,
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
    
        //данные по ступени добавим в итоги
	
        for (var key in options) {
            if(key == 'step') {
                continue;
            }
            totalStep[key] = totalStep[key]+options[key];
        }	
        
        return objAssortmentStructure;
    
    }
    

}


//Строка расчета сортиментной структура
class ClassAssortmentStructure {

    constructor(options) {
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