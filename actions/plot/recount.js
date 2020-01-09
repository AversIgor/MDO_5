export class Recount {
    constructor() {
        this.plot = undefined
        this.setting = undefined
        this.enumerations = undefined
        this.breed = undefined
        this.publications = undefined
        this.typesrates = undefined        

        this.objectsTaxation    = new ClassObjectsTaxation(this)//коллекция объектов таксации
        this.objectsSteps       = new ClassObjectsSteps(this)//коллекция ступеней толщшины с сортиментной структурой        
        this.totalValue         = new ClassAssortmentStructure() //итоги запаса по делянке 

        this.objectsFeedrates   = new ClassObjectsFeedrates(this)//коллекция ставок платы с учетом коэффцентов
        this.totalSumm          = new ClassAssortmentStructure() //итоги стоимости по делянке 

        this.optionsPlots       = new ClassOptionsPlots(this) //параетры делянки по объектам таксаци

    }

    setProperty(data){
        Object.assign(this, data);
    }

    getProperty(name){
        return this[name];
    }

    //получение ссылки по идентификатору
    getObject(id,collection,field = undefined) {
        let obj = collection.find(item => item.id == id);
        if(obj){
            if(field){
                obj = obj[field]
            }
        }
        return obj
    }

  
    //здесь будем на основе перечетной ведомости создавать Новое дерево данных и дополнять его данными
    calculation() {  
        
        //формирование колекции объектов таксации
        this.objectsTaxation.feel(this.plot.recount)
        
        //рассчитае коэффциент для ленточного перечета
        this.plot.property.taxation.coefficient = this.objectsTaxation.getCoefficient(this.plot.property.taxation.methodTaxation)

        //по каждой ступени толщины заполним сортиментную структуру
        this.objectsSteps.feel()

        //заполним итоги по ступеням толщины
        this.objectsSteps.feelTotalSteps()

        //заполним итоги объема по объектам таксации и по всей делянке
        this.objectsSteps.feelTotalValue()

        //Сформируем коэффциенты на ставки платы
        this.feelСoefficients() 
        
        //Сформируем ставки платы
        this.objectsFeedrates.feel() 

        //Заполним стоимость
        this.objectsFeedrates.feelTotalSumm()

        //Заполним параметры по объектам таксции
        this.optionsPlots.feel()     
 
    }

    feelСoefficients(liquidity,firewoodwaste,totalbusiness) {
	
        //очистим основные коэффициенты
        this.plot.coefficients.main = {}

        let typesrates = this.typesrates.find(item => item.id == this.plot.property.taxation.typesrates);
        if(!typesrates) return

        //коэффицент индексации ставок
        this.plot.coefficients.main.coefficientsindexing = typesrates.coefficientsindexing

        //коэффициенты на форму рубки
        let coefficientsformcutting = typesrates.coefficientsformcutting.find(item => item.formCutting == this.plot.property.felling.formCutting);
        if(coefficientsformcutting){
            this.plot.coefficients.main.formCutting             = coefficientsformcutting.formCutting
            this.plot.coefficients.main.coefficientsformcutting = coefficientsformcutting.percent
        }

        //коэффициенты на ликвидный запас для сплошных рубок 
        if(this.plot.property.felling.formCutting == 1){
            let liquidityOnAreacutting = 0;            
            if(this.plot.property.taxation.methodTaxation == 1){
                //для сплошного перечета площадь возьмем из объектов таксации
                liquidityOnAreacutting = this.totalValue.liquidity/this.plot.property.taxation.arearecount;
            }else{
                //для ленточного перечета площад возьмем из площади лесосеки
                liquidityOnAreacutting = this.totalValue.liquidity/this.plot.property.felling.areacutting;
            }          
            
            if(liquidityOnAreacutting != 0){
                for (var i = 0; i < typesrates.coefficientsrangesliquidation.length; i++) {
                    if(		(liquidityOnAreacutting < 100 && typesrates.coefficientsrangesliquidation[i].rangesLiquidation == 1)
                        || 	(liquidityOnAreacutting >= 100 && liquidityOnAreacutting < 150 && typesrates.coefficientsrangesliquidation[i].rangesLiquidation == 2)
                        ||	(liquidityOnAreacutting >= 150 && typesrates.coefficientsrangesliquidation[i].rangesLiquidation == 3)){
                        this.plot.coefficients.main.rangesLiquidation             = typesrates.coefficientsrangesliquidation[i].rangesLiquidation
                        this.plot.coefficients.main.coefficientsrangesliquidation = typesrates.coefficientsrangesliquidation[i].percent
                    }
                }
            }
        }     
         
        //коэффициент на поврежденность насаждения
        if(this.plot.property.felling.formCutting == 1 && this.plot.property.felling.groupCutting == 3){
            //итог дрова и отходы
			let firewoodwaste = this.totalValue.totalfirewood_b + this.totalValue.waste_b + this.totalValue.total_f;	
			let totalbusiness = this.totalValue.totalbusiness;
            var damageCoefficient = firewoodwaste/(totalbusiness+firewoodwaste);
            for (var i = 0; i < typesrates.coefficientsdamage.length; i++) {
                if(		(damageCoefficient > 0   	&& damageCoefficient < 0.1 && typesrates.coefficientsdamage[i].damage == 1)
                    || 	(damageCoefficient >= 0.1   && damageCoefficient < 0.2 && typesrates.coefficientsdamage[i].damage == 2)
                    || 	(damageCoefficient >= 0.2   && damageCoefficient < 0.3 && typesrates.coefficientsdamage[i].damage == 3)
                    || 	(damageCoefficient >= 0.3   && damageCoefficient < 0.4 && typesrates.coefficientsdamage[i].damage == 4)
                    || 	(damageCoefficient >= 0.4   && damageCoefficient < 0.5 && typesrates.coefficientsdamage[i].damage == 5)
                    || 	(damageCoefficient >= 0.5   && damageCoefficient < 0.6 && typesrates.coefficientsdamage[i].damage == 6)
                    || 	(damageCoefficient >= 0.6   && damageCoefficient < 0.7 && typesrates.coefficientsdamage[i].damage == 7)
                    || 	(damageCoefficient >= 0.7   && damageCoefficient < 0.8 && typesrates.coefficientsdamage[i].damage == 8)
                    || 	(damageCoefficient >= 0.8   && damageCoefficient < 0.9 && typesrates.coefficientsdamage[i].damage == 9)
                    ||	(damageCoefficient >= 0.9 	&& typesrates.coefficientsdamage[i].damage == 10)){
                    this.plot.coefficients.main.damage              = typesrates.coefficientsdamage[i].damage
                    this.plot.coefficients.main.coefficientsdamage  = typesrates.coefficientsdamage[i].percent
                    }
            }	
        }    
    }  
}

class ClassObjectsTaxation {
    constructor(owner) {
        this.owner = owner;
        this.rows = [];        
    }


    feel(recount) {
        
        //очистим общую площадь таксации
        this.owner.plot.property.taxation.arearecount = 0;

        for (let i = 0; i < recount.length; i++) {
            let row_objectTaxation = recount[i];
            let objectTaxation = this.owner.getObject(row_objectTaxation.objectTaxation,this.owner.enumerations.objectTaxation);
            
            //проверка на сплошной и ленточный перечет
            if(!this.check_methodTaxation(objectTaxation.id)) continue;                

            for (let j = 0; j < row_objectTaxation.objectsBreed.length; j++) {
                let row_objBreed                    = row_objectTaxation.objectsBreed[j];
                let objBreed                        = this.owner.getObject(row_objBreed.breed,this.owner.breed)
                this.rows.push({
                    id:row_objBreed.id,
                    objectTaxationId:row_objectTaxation.id,
                    objectTaxation:objectTaxation.value,
                    objectTaxationType:objectTaxation.id,
                    breed:objBreed.value, 
                    breedId:objBreed.id,
                    kodGulf:objBreed.kodGulf,
                    rank:row_objBreed.rank, 
                    areacutting:row_objectTaxation.areacutting,
                    steps:row_objBreed.objectsStep,
                    publication:objBreed.publication.name,
                    sortables:this.getSorttables(objBreed,row_objBreed.rank), 
                    barklindenindividualreserves:this.owner.getObject(objBreed.publication.id,this.owner.publications,'barklindenindividualreserves'),                                     
                })
            }
            this.owner.plot.property.taxation.arearecount = this.owner.plot.property.taxation.arearecount+row_objectTaxation.areacutting
        }
    }

    getCoefficient(methodTaxation) {
        let coefficient = 1
        if(methodTaxation == 2){
            let areacutting = 0;
            let objectTaxationId = 0;
            for (let i = 0; i < this.rows.length; i++) {                
                let row = this.rows[i];                
                if(objectTaxationId == row.objectTaxationId) continue
                if(row.objectTaxationType == 5){
                    areacutting += row.areacutting
                }
                objectTaxationId = row.objectTaxationId
            } 
            if(areacutting !=0){
                coefficient = round_value(this.owner.plot.property.felling.areacutting/areacutting,2)
            }           
        }
        return coefficient
    }
    

    check_methodTaxation(objectTaxationType) {	
        var result = true;	
        if(this.owner.plot.property.taxation.methodTaxation == 1){
            if(objectTaxationType == 5){
                result = false;
            }
        }else{
            if(objectTaxationType != 5){
                result = false;
            }	
        } 	
        return result;        
    }

    //получение данных сортиментной таблицы по породе, разряду высот, ступени толщины
    getSorttables(objBreed,rank) {
        let rowSortTable 			= undefined;
        let rowSortFirewoodTable    = undefined;//сортиментная таблица для дровяных стволов
        if(objBreed.table) {
            rowSortTable = objBreed.table.sorttables[rank];
        }
        if(objBreed.tablefirewood){
            rowSortFirewoodTable   = objBreed.tablefirewood.sorttables[rank];
        } 
        
        if(!rowSortTable){
            webix.message({
                text:'Не найдено данных в сортиментной таблице для породы "'+objBreed.value+'", разряда высот: "'+rank+'"!',
                type:"error", 
                expire: 10000}
            );
            return undefined
        }

        return {
            rowSortTable:rowSortTable,
            rowSortFirewoodTable:rowSortFirewoodTable,            
        }
    }
}

class ClassObjectsSteps {
    constructor(owner) {
        this.owner          = owner;
        this.steps          = []; 
        this.totalSteps     = [];//итоги по ступеням толщины 
        this.totalValue     = [];//итоги по объектам таксации с коэффциентом и округлением   
    }

    
    feel() {
        for (let i = 0; i < this.owner.objectsTaxation.rows.length; i++) {
            let row_objectTaxation = this.owner.objectsTaxation.rows[i]; 
            if(!row_objectTaxation.sortables) continue           
            let rows = []
            for (let j = 0; j < row_objectTaxation.steps.length; j++) {
                let row_step = row_objectTaxation.steps[j];                
                let assortmentStructure = this.feelRow(row_objectTaxation,row_step)
                if (assortmentStructure){
                    rows.push(assortmentStructure)
                }
            }
            this.steps.push({
                id:     row_objectTaxation.id,
                rows:   rows
            })
        }
    }    

    //заполнение ступеней толщины данными сортиментных таблиц
    feelRow(objectTaxation,rowStep) { 

        let ST                              = objectTaxation.sortables;
        let barklindenindividualreserves    = objectTaxation.barklindenindividualreserves;
        let kodGulf                         = objectTaxation.kodGulf;

        let rowSortTable = ST.rowSortTable[rowStep.step]
        let rowSortFirewoodTable = undefined
        if(ST.rowSortFirewoodTable) rowSortFirewoodTable = ST.rowSortFirewoodTable[rowStep.step]
        

        if(!rowSortTable)return undefined;

        var business 		= parseInt(rowStep.business) || 0;
        var halfbusiness 	= parseInt(rowStep.halfbusiness) || 0;
        var firewood 		= parseInt(rowStep.firewood) || 0;
        if(business+halfbusiness+firewood == 0)return undefined;
            
        //распределим полуделовые				
        var halfbusinessFor = (halfbusiness-halfbusiness%2)/2; //целочилостное деление
        let business_r = 0;
        let firewood_r = 0;
        if(!this.owner.settings.distributionhalfbusiness){
            business_r = business+halfbusiness-halfbusinessFor;
            firewood_r = firewood+halfbusinessFor;
        }else{
            business_r = business+halfbusinessFor;
            firewood_r = firewood+halfbusiness-halfbusinessFor;
        }          
        business 		= business_r;
        firewood 		= firewood_r;

               
        //Учет дров от дровяных деревьев в зависимости от настроек	
        var technical_f 		= parseFloat(rowSortTable.technical_f);
        var	firewood_f 			= parseFloat(rowSortTable.firewood_f);	
        
        var totalfirewood_f 	= 0;				
        if(this.owner.settings.assessfirewoodcommonstock) {
            totalfirewood_f	= technical_f + firewood_f;
        }
        
        //отходы
        var waste_f		= parseFloat(rowSortTable.waste_f);    
    
        if(kodGulf == '304200'){
            if(this.owner.settings.firewoodtrunkslindencountedinbark == 1 && barklindenindividualreserves == "Да") {
                //добавим кору если она отдельно и учет в коре
                firewood_f += parseFloat(rowSortTable.bark);
                waste_f += parseFloat(rowSortTable.bark);
            }
            if(this.owner.settings.firewoodtrunkslindencountedinbark == 0 && barklindenindividualreserves != "Да") {
                //убавим кору если она вместе с отходами и учет без коры
                firewood_f -= parseFloat(rowSortTable.bark);
                waste_f -= parseFloat(rowSortTable.bark);
            }	
        }
        
        if(waste_f < 0) {
            waste_f = 0;	
        }
    
        //всего дров
        if(this.owner.settings.assessfirewoodcommonstock == 1) {
            //по общему запасу
            if(this.owner.settings.assesswastefirewood == 1) {
                //использовать отходы
                totalfirewood_f = totalfirewood_f + waste_f;
            }
        }	
        
        
        var average 	= round_value((parseFloat(rowSortTable.average1)+parseFloat(rowSortTable.average2))*business,2);
        var large 		= round_value(parseFloat(rowSortTable.large)*business,2);
        var small 		= round_value(parseFloat(rowSortTable.small)*business,2);
        var waste_b		= round_value(parseFloat(rowSortTable.waste_b)*business,2);
        var technical_b = round_value(parseFloat(rowSortTable.technical_b)*business,2);
        var firewood_b 	= round_value(parseFloat(rowSortTable.firewood_b)*business,2);
        
        if(rowSortFirewoodTable){
            large 		= large			+	round_value(parseFloat(rowSortFirewoodTable.large)*firewood,2);
            small 		= small			+	round_value(parseFloat(rowSortFirewoodTable.small)*firewood,2);
            average 	= average		+	round_value((parseFloat(rowSortFirewoodTable.average1)+parseFloat(rowSortFirewoodTable.average2))*firewood,2);
            waste_b		= waste_b		+	round_value(parseFloat(rowSortFirewoodTable.waste_b)*firewood,2);
            technical_b	= technical_b	+	round_value(parseFloat(rowSortFirewoodTable.technical_b)*firewood,2);
            firewood_b	= firewood_b	+	round_value(parseFloat(rowSortFirewoodTable.firewood_b)*firewood,2);
        }
    
        var totalfirewood_b 	= 0;
        if(this.owner.settings.assessfirewoodcommonstock) {
            totalfirewood_b	= round_value(technical_b + firewood_b,2);
        }	
    
        var options = {	'step'	:			rowStep.step,
                        'business'	:		business,
                        'firewood'	:		firewood,
                        'total'			:	business + firewood,
                        'large'	:			large,
                        'average'	:		average,
                        'small'	:			small,
                        'totalbusiness':	round_value(large+average+small,2),
                        'technical_b':		technical_b,
                        'firewood_b':		firewood_b,
                        'totalfirewood_b':	totalfirewood_b,
                        'waste_b':			waste_b,
                        
                        'technical_f':		round_value(technical_f*firewood,2),
                        'firewood_f':		round_value(firewood_f*firewood,2),
                        'waste_f':			round_value(waste_f*firewood,2),
                        'totalfirewood_f':	round_value(totalfirewood_f*firewood,2),
                    };
    
        return new ClassAssortmentStructure(options)
    
    }

    //заполнение строки итогов по ступеням толщины
    feelTotalSteps() {

        for (let i = 0; i < this.steps.length; i++) {
            let row_objectTaxation = this.steps[i]
            let total = new ClassAssortmentStructure({})
            for (let j = 0; j < row_objectTaxation.rows.length; j++) {
                let row = row_objectTaxation.rows[j]
                for (var key in row) {
                    if(key == 'step') {
                        continue;
                    }
                    total[key] = total[key]+row[key];
                }
            }
            //округление
            for (var key in total) {
                if(key == 'step') {
                    continue;
                }
                total[key] = round_value(total[key],2);
            }
            this.totalSteps.push({
                id:     row_objectTaxation.id,
                total:  total
            })
        }
    }

    //заполнение строки итогов с учетом коэффициента и округления
    feelTotalValue() {

        for (let i = 0; i < this.totalSteps.length; i++) {
            let row_objectTaxation = this.totalSteps[i]
            let total = new ClassAssortmentStructure(
                row_objectTaxation.total,
                this.owner.plot.property.taxation.coefficient,
                this.owner.settings.orderRoundingValues
            )            

            total.totalbusiness = round_value(total.large + total.average + total.small,2);
        
            if(!this.owner.settings.assessfirewoodcommonstock) {
                total.totalfirewood_b = round_value(total.technical_b + total.firewood_b,2);
            }else{
                total.technical_b = 0;
                total.firewood_b = 0;
            }
            
            total.liquidity 		= round_value(total.totalbusiness	+ total.totalfirewood_b,2);
            total.total_b 			= round_value(total.liquidity		+ total.waste_b,2);
            
            if(!this.owner.settings.assessfirewoodcommonstock) {
                total.total_f 			= round_value(total.technical_f + total.firewood_f + total.waste_f,2);
                total.totalfirewood_f 	= round_value(total.technical_f + total.firewood_f,2);	
                if(this.owner.settings.assesswastefirewood){
                    total.totalfirewood_f 		= round_value(total.totalfirewood_f + total.waste_f,2);	
                }		
            }else{
                total.total_f	= total.totalfirewood_f;
                if(!this.owner.settings.assesswastefirewood){
                    total.total_f 		= round_value(total.total_f + total.waste_f,2);	
                }			
                total.technical_f = 0;
                total.firewood_f = 0;
                total.waste_f = 0;
            }

            this.totalValue.push({
                id:     row_objectTaxation.id,
                total:  total
            })

            //итог по всем объекта таксации
            for (var key in total) {
                this.owner.totalValue[key] = this.owner.totalValue[key]+total[key];
            }	
      
        }
    }

}

class ClassObjectsFeedrates {
    constructor(owner) {
        this.owner = owner;
        this.feedrates = [];
        this.totalSumm = [];//итог суммы на делянке с округлением
    }

    feel() {
        for (let i = 0; i < this.owner.objectsTaxation.rows.length; i++) {
            let row_objectTaxation = this.owner.objectsTaxation.rows[i]; 
            //вид ставки
            let typesrates = this.owner.typesrates.find(item => item.id == this.owner.plot.property.taxation.typesrates);           
            if(!typesrates) continue
            //ставки
            let feedrates = typesrates.feedrates
            if(!feedrates.length) continue
            //по породе
            let feedratesBreed = feedrates.filter(item => item.breed == row_objectTaxation.breedId);
            //разряду такс
            let feedratesValues  = feedratesBreed.find(item => item.ranktax == this.owner.plot.property.taxation.rankTax);
            if(!feedratesValues) continue
             
            let options = {}            
            options.large 		= this.applyСoefficients(feedratesValues.large);
			options.average 	= this.applyСoefficients(feedratesValues.average);
			options.small 		= this.applyСoefficients(feedratesValues.small);
            let firewood        = this.applyСoefficients(feedratesValues.firewood)

			if(this.owner.settings.assessfirewoodcommonstock == 0) {
				options.technical_b 	= firewood;
				options.firewood_b 		= firewood;
				options.technical_f 	= firewood;
				options.firewood_f 		= firewood;
				if(this.owner.settings.assesswastefirewood == 1){
					options.waste_f 	= firewood;	
				}				
			}else{
				options.totalfirewood_b	= firewood;
				options.totalfirewood_f	= firewood;
			}		
            
            this.feedrates.push({
                id:    row_objectTaxation.id,
                row:   new ClassAssortmentStructure(options,undefined,typesrates.orderroundingrates)
            })
        }
    } 
    
    applyСoefficients(feedrate) {

        let result = feedrate;
        //умножим ставку на коэффицент индексации
        let coefficientsindexing = this.owner.plot.coefficients.main.coefficientsindexing
        if(coefficientsindexing && coefficientsindexing !=0){
            result *= coefficientsindexing;
            result = round_value(result,2)
        } 

        //умножим ставку на прочие коэффициенты
        let coefficientsformcutting = this.owner.plot.coefficients.main.coefficientsformcutting
        if(coefficientsformcutting && coefficientsformcutting !=0) result *= coefficientsformcutting;

        let coefficientsrangesliquidation = this.owner.plot.coefficients.main.coefficientsrangesliquidation
        if(coefficientsrangesliquidation && coefficientsrangesliquidation !=0) result *= coefficientsrangesliquidation;

        let coefficientsdamage = this.owner.plot.coefficients.main.coefficientsdamage
        if(coefficientsdamage && coefficientsdamage !=0) result *= coefficientsdamage;

        //умножим ставку на произвольные коэффиценты
        let random = this.owner.plot.coefficients.random
        for (var i = 0; i < random.length; i++) {
            let value = random[i].value
            if(value && value !=0) result *= value;
        }
        return result;
    }

    //заполнение строки итогов с учетом коэффициента и округления
    feelTotalSumm() {

        for (let i = 0; i < this.owner.objectsTaxation.rows.length; i++) {
            let row_objectTaxation = this.owner.objectsTaxation.rows[i];
            
            //найдем строки с итогом объема и ставок по объекту таксации
            let row_feedrates = this.feedrates.find(item => item.id == row_objectTaxation.id);
            let row_totalValue = this.owner.objectsSteps.totalValue.find(item => item.id == row_objectTaxation.id);

            if((!row_feedrates) || (!row_totalValue)) continue

            let feedrates = row_feedrates.row;
            let totalValue = row_totalValue.total;

            let options = {}
            options.large 		= totalValue.large		*feedrates.large;
            options.average 	= totalValue.average	*feedrates.average;
            options.small 		= totalValue.small		*feedrates.small;
            
            if(this.owner.settings.assessfirewoodcommonstock == 0) {
                options.technical_b 	= totalValue.technical_b	*feedrates.technical_b;
                options.firewood_b 		= totalValue.firewood_b		*feedrates.firewood_b;
                options.technical_f 	= totalValue.technical_f	*feedrates.technical_f;
                options.firewood_f 		= totalValue.firewood_f		*feedrates.firewood_f;
                if(this.owner.settings.assesswastefirewood == 1){
                    options.waste_f 	= totalValue.waste_f		*feedrates.waste_f;
                }				
            }else{
                options.totalfirewood_b 	= totalValue.totalfirewood_b	*feedrates.totalfirewood_b;
                options.totalfirewood_f 	= totalValue.totalfirewood_f	*feedrates.totalfirewood_f;
            }

            let total = new ClassAssortmentStructure(options,undefined,this.owner.settings.orderRoundingRates)

            //ИТОГИ	
            total.totalbusiness_b 	= total.large 			+ total.average 	+ total.small;
            if(this.owner.settings.assessfirewoodcommonstock == 0) {
                total.totalfirewood_b = total.technical_b + total.firewood_b;
            }else{
                total.technical_b = 0;
                total.firewood_b = 0;
            }
            
            total.liquidity 		= total.totalbusiness_b	+ total.totalfirewood_b;
            
            if(this.owner.settings.assessfirewoodcommonstock == 0) {
                total.totalfirewood_f 	= total.technical_f + total.firewood_f;	
                if(this.owner.settings.assesswastefirewood == 1){
                    total.totalfirewood_f 		= total.totalfirewood_f + total.waste_f;	
                }		
            }else{
                total.technical_f = 0;
                total.firewood_f = 0;
                total.waste_f = 0;
            }

            this.totalSumm.push({
                id:    row_objectTaxation.id,
                total: total
            })
  
            //итог по всем объекта таксации
            for (var key in total) {
                this.owner.totalSumm[key] = this.owner.totalSumm[key]+total[key];
            }	
      
        }
    }

}

class ClassOptionsPlots {
    constructor(owner) {
        this.owner                  = owner;
        this.optionsObjectTaxation  = [];//параметры по объектам таксации 
        this.optionsBreeds          = [];//параметры по породам
        this.totaloptions           = new ClassOptions({name:"Всего"});//итоги параметров по всем объектам  
    }

    feel() {

        let areacutting = this.owner.plot.property.felling.areacutting; 
        
        for (let i = 0; i < this.owner.objectsTaxation.rows.length; i++) {
            let row_objectTaxation = this.owner.objectsTaxation.rows[i]; 
            let objectTaxation = this.optionsObjectTaxation.find(item => item.id == row_objectTaxation.objectTaxationType);
            if(!objectTaxation){
                objectTaxation = new    ClassOptions({
                    id:             row_objectTaxation.objectTaxationType,
                    name:           "- "+row_objectTaxation.objectTaxation,
                    areacutting:    row_objectTaxation.areacutting,
                })
                this.optionsObjectTaxation.push(objectTaxation)
            }
            let objectBreed = this.optionsBreeds.find(item => item.id == row_objectTaxation.breedId);
            if(!objectBreed){
                objectBreed = new ClassOptions({
                    id:     row_objectTaxation.breedId,
                    name:   "-- "+row_objectTaxation.breed
                })
                this.optionsBreeds.push(objectBreed)
            }


            //найдем строки с итогами по объему
            let totalValue = this.owner.objectsSteps.totalValue.find(item => item.id == row_objectTaxation.id);

            //найдем строки с итогами по стоимости
            let totalSumm = this.owner.objectsFeedrates.totalSumm.find(item => item.id == row_objectTaxation.id);                        
            if(!totalValue) continue

            objectBreed.total 		    += totalValue.total.total_b         +totalValue.total.total_f;
            objectBreed.liquidity 		+= totalValue.total.liquidity		+totalValue.total.totalfirewood_f;
			objectBreed.totalbusiness   += totalValue.total.totalbusiness;
			objectBreed.firewood 		+= totalValue.total.totalfirewood_b	+totalValue.total.totalfirewood_f;            
            objectBreed.numberstems 	+= totalValue.total.total;
            if(totalSumm){
                objectBreed.totalsumm 	+= totalSumm.total.liquidity		+totalSumm.total.totalfirewood_f;
            }

			//заполним параметры объекта таксации
			objectTaxation.total 				+= totalValue.total.total_b         +totalValue.total.total_f;;
			objectTaxation.liquidity 			+= totalValue.total.liquidity		+totalValue.total.totalfirewood_f;
			objectTaxation.totalbusiness 		+= totalValue.total.totalbusiness;
			objectTaxation.firewood 			+= totalValue.total.totalfirewood_b	+totalValue.total.totalfirewood_f;
            objectTaxation.numberstems 		    += totalValue.total.total;
            if(totalSumm){
                objectTaxation.totalsumm 	    += totalSumm.total.liquidity		+totalSumm.total.totalfirewood_f;
            }
            
            objectTaxation.total_perhectare 	    = round_value(objectTaxation.total			/areacutting,0);
			objectTaxation.liquidity_perhectare     = round_value(objectTaxation.liquidity		/areacutting,0);
			objectTaxation.totalbusiness_perhectare = round_value(objectTaxation.totalbusiness	/areacutting,0);
			objectTaxation.firewood_perhectare 	    = round_value(objectTaxation.firewood		/areacutting,0);
            objectTaxation.averagevolumestems 	    = round_value(objectTaxation.liquidity		/objectBreed.numberstems,2);
                        
        
        }

        //заполним итоги по параметрам лесосеки
        for (let i = 0; i < this.optionsObjectTaxation.length; i++) {
            let row_objectTaxation = this.optionsObjectTaxation[i]; 
            for (var key in row_objectTaxation) {
                if((key == 'name') || (key == 'id')) {
                    continue;
                }				
                this.totaloptions[key] 				+= row_objectTaxation[key]
            }
        }

        this.totaloptions.total_perhectare 	        = round_value(this.totaloptions.total			/areacutting,0);
        this.totaloptions.liquidity_perhectare      = round_value(this.totaloptions.liquidity		/areacutting,0);
        this.totaloptions.totalbusiness_perhectare  = round_value(this.totaloptions.totalbusiness	/areacutting,0);
        this.totaloptions.firewood_perhectare 	    = round_value(this.totaloptions.firewood		/areacutting,0);
        
        this.totaloptions.numberstems 			    = this.totaloptions.numberstems;
        this.totaloptions.averagevolumestems	    = round_value(this.totaloptions.liquidity	    /this.totaloptions.numberstems,2);

    }    
}

//Строка расчета параметров делянки
class ClassOptions {

    constructor(options = {},roundingValues = undefined ) {
        this.id         	        = "";
        this.name    		        = "";
        this.areacutting 		    = 0;
        this.numberstems  		    = 0;
        this.total_perhectare	    = 0.00;
        this.liquidity_perhectare 	= 0.00;
        this.totalbusiness_perhectare 	= 0.00;
        this.firewood_perhectare    = 0.00;
        this.averagevolumestems	    = 0.00;
        this.total		            = 0.00;
        this.totalbusiness          = 0.00;
        this.liquidity              = 0.00;
        this.firewood		        = 0.00;        
        this.totalsumm 		        = 0.00;
        
        
        for (var key in options) {
            let value = options[key];
            //округление
            if(roundingValues){
                if(roundingValues == 3){
                    value = round_value(value,2);
                }
                if(roundingValues == 2){
                    value = round_value(value,1);			
                }
                if(roundingValues == 1){
                    value = round_value(value,0);			
                }
            }         
            this[key] = value
        }
    }
}

//Строка расчета сортиментной структура
class ClassAssortmentStructure {

    constructor(options = {},coefficient = undefined,roundingValues = undefined ) {
        this.step 			= 0;
        this.business 		= 0;
        this.firewood 		= 0;
        this.total  		= 0;
        this.large 			= 0.00;
        this.average 		= 0.00;
        this.small 			= 0.00;
        this.totalbusiness= 0.00;//всего деловая, 			в этом объекте не заполняется
        this.technical_b	= 0.00;
        this.firewood_b		= 0.00;
        this.totalfirewood_b= 0.00;//всего дрова от деловых,	заполняется если оценка по общему запасу дров!!!
        this.liquidity		= 0.00;//ликвид, 					в этом объекте не заполняется
        this.waste_b 		= 0.00;
        this.total_b 		= 0.00;//всего деловых деревьев, 	в этом объекте не заполняется
        
        this.technical_f	= 0.00;
        this.firewood_f		= 0.00;
        this.waste_f		= 0.00;
        this.totalfirewood_f= 0.00;//всего ликвидных дров от дровяных, заполняется если оценка по общему запасу дров!!!
        this.total_f 		= 0.00;//всего дровяных деревьев, 	в этом объекте не заполняется
        
        for (var key in options) {
            let value = options[key];
            if(coefficient){
                if(key == 'step') continue;
                value = round_value(options[key]*coefficient,2);
            }
            //округление
            if(roundingValues){
                if(roundingValues == 3){
                    value = round_value(value,2);
                }
                if(roundingValues == 2){
                    value = round_value(value,1);			
                }
                if(roundingValues == 1){
                    value = round_value(value,0);			
                }
            }         
            this[key] = value
        }
    }
}

function round_value(value, digits) {
    return parseFloat(value.toFixed(digits))
}