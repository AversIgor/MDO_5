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

        //заполним итоги объема по объектам таксации и по всейделянке
        this.objectsSteps.feelTotalValue()

        //Сформируем коэффциенты на ставки платы
        this.feelСoefficients()  
 
    }

    feelСoefficients(liquidity,firewoodwaste,totalbusiness) {
	
        //очистим основные коэффициенты
        this.plot.coefficients.main = {}

        console.log(this.typesrates)

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
            let liquidityOnAreacutting = this.totalValue.liquidity/this.plot.property.felling.areacutting;

            console.log(this.totalValue.liquidity,this.plot.property.felling.areacutting,liquidityOnAreacutting)

        }
        

        

        return

        
    
        //коэффициент на ликвидный запас
        if(objectMDO.formCutting.id == 1){
            var liquidityOnAreacutting = liquidity/objectMDO.areacutting;//arearecount;
            for (var i = 0; i < coefficientsrangesliquidationValues.length; i++) {
                if(		(liquidityOnAreacutting < 100 && coefficientsrangesliquidationValues[i].rangesLiquidation == 1)
                    || 	(liquidityOnAreacutting >= 100 && liquidityOnAreacutting < 150 && coefficientsrangesliquidationValues[i].rangesLiquidation == 2)
                    ||	(liquidityOnAreacutting >= 150 && coefficientsrangesliquidationValues[i].rangesLiquidation == 3)){
                    var rowCoefficient = {};
                    rowCoefficient.recid = objectMDO.coefficients.length+1;
                    rowCoefficient.predefined = 1;
                    rowCoefficient.name = 3;
                    rowCoefficient.value = coefficientsrangesliquidationValues[i].value;
                    objectMDO.coefficients.push(rowCoefficient);
                }
            }	
        }
        
        //коэффициент на поврежденность насаждения
        if(objectMDO.formCutting.id == 1 && objectMDO.groupCutting.id == 3){
            var damageCoefficient = firewoodwaste/(totalbusiness+firewoodwaste);
            for (var i = 0; i < coefficientsdamageValues.length; i++) {
                if(		(damageCoefficient > 0   	&& damageCoefficient < 0.1 && coefficientsdamageValues[i].damage == 1)
                    || 	(damageCoefficient >= 0.1   && damageCoefficient < 0.2 && coefficientsdamageValues[i].damage == 2)
                    || 	(damageCoefficient >= 0.2   && damageCoefficient < 0.3 && coefficientsdamageValues[i].damage == 3)
                    || 	(damageCoefficient >= 0.3   && damageCoefficient < 0.4 && coefficientsdamageValues[i].damage == 4)
                    || 	(damageCoefficient >= 0.4   && damageCoefficient < 0.5 && coefficientsdamageValues[i].damage == 5)
                    || 	(damageCoefficient >= 0.5   && damageCoefficient < 0.6 && coefficientsdamageValues[i].damage == 6)
                    || 	(damageCoefficient >= 0.6   && damageCoefficient < 0.7 && coefficientsdamageValues[i].damage == 7)
                    || 	(damageCoefficient >= 0.7   && damageCoefficient < 0.8 && coefficientsdamageValues[i].damage == 8)
                    || 	(damageCoefficient >= 0.8   && damageCoefficient < 0.9 && coefficientsdamageValues[i].damage == 9)
                    ||	(damageCoefficient >= 0.9 	&& coefficientsdamageValues[i].damage == 10)){
                    var rowCoefficient = {};
                    rowCoefficient.recid = objectMDO.coefficients.length+1;
                    rowCoefficient.predefined = 1;
                    rowCoefficient.text = "Коэффициент на степень повреждения насаждения";
                    rowCoefficient.value = coefficientsdamageValues[i].value;
                    objectMDO.coefficients.push(rowCoefficient);
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
                    objectTaxation:objectTaxation.value,
                    objectTaxationId:objectTaxation.id,
                    breed:objBreed.value, 
                    kodGulf:objBreed.kodGulf,
                    rank:row_objBreed.rank, 
                    areacutting:row_objectTaxation.areacutting,
                    steps:row_objBreed.objectsStep,
                    publication:objBreed.publication.name,
                    sortables:this.getSorttables(objBreed,row_objBreed.rank), 
                    barklindenindividualreserves:this.owner.getObject(objBreed.publication.id,this.owner.publications,'barklindenindividualreserves'),                                     
                })
            }
        }
    }

    getCoefficient(methodTaxation) {
        let coefficient = 1
        if(methodTaxation == 2){
            let areacutting = 0;
            for (let i = 0; i < this.rows.length; i++) {
                let row = this.rows[i];
                if(row.objectTaxationId == 5){
                    areacutting += row.areacutting
                }
            } 
            if(areacutting !=0){
                coefficient = round_value(this.owner.plot.property.felling.areacutting/areacutting,2)
            }           
        }
        return coefficient
    }
    

    check_methodTaxation(objectTaxationId) {	
        var result = true;	
        if(this.owner.plot.property.taxation.methodTaxation == 1){
            if(objectTaxationId == 5){
                result = false;
            }
        }else{
            if(objectTaxationId != 5){
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
        this.owner      = owner;
        this.steps      = []; 
        this.totalSteps = [];//итоги по ступеням толщины 
        this.totalValue = [];//итог на делянке с коэффциентом и округлением      
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
                        'totalbusiness_b':	round_value(large+average+small,2),
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

            total.totalbusiness_b = round_value(total.large + total.average + total.small,2);
        
            if(!this.owner.settings.assessfirewoodcommonstock) {
                total.totalfirewood_b = round_value(total.technical_b + total.firewood_b,2);
            }else{
                total.technical_b = 0;
                total.firewood_b = 0;
            }
            
            total.liquidity 		= round_value(total.totalbusiness_b	+ total.totalfirewood_b,2);
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

//Строка расчета сортиментной структура
class ClassAssortmentStructure {

    constructor(options = {},coefficient = undefined,orderRoundingValues = undefined ) {
        this.step 			= 0;
        this.business 		= 0;
        this.firewood 		= 0;
        this.total  		= 0;
        this.large 			= 0.00;
        this.average 		= 0.00;
        this.small 			= 0.00;
        this.totalbusiness_b= 0.00;//всего деловая, 			в этом объекте не заполняется
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
            if(orderRoundingValues){
                if(orderRoundingValues == 3){
                    value = round_value(value,2);
                }
                if(orderRoundingValues == 2){
                    value = round_value(value,1);			
                }
                if(orderRoundingValues == 1){
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