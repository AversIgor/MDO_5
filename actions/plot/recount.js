export class Recount {
    constructor() {
        this.plot = undefined
        this.setting = undefined
        this.enumerations = undefined
        this.breed = undefined
        this.publications = undefined

        this.objectsTaxation    = undefined//коллекция объектов таксации
        this.objectsSteps       = undefined//коллекция ступеней толщшины с сортиментной структурой
        this.totalSteps         = [];//итоги по ступеням толщины
        this.totalValue         = [];//итог на делянке с коэффциентом и округлением




 
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
        this.objectsTaxation    = new ClassObjectsTaxation(this)
        this.objectsTaxation.feel(this.plot.recount)
        
        //рассчитае коэффциент для ленточного перечета
        this.plot.property.taxation.coefficient = this.objectsTaxation.getCoefficient(this.plot.property.taxation.methodTaxation)

        //по каждой ступени толщины заполним сортиментную структуру
        this.objectsSteps       = new ClassObjectsSteps(this)
        this.objectsSteps.feel()

        //заполним итоги по ступеням толщины
        this.objectsSteps.feelTotalSteps(this.totalSteps)

        //заполним итоги по делянке
        this.objectsSteps.feelTotalValue(this.totalValue)
   
 
    }

}

class ClassObjectsTaxation {
    constructor(owner) {
        this.owner = owner;
        this.rows = [];        
    }

    round_value(value, digits) {
        return parseFloat(value.toFixed(digits))
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
                coefficient = this.round_value(this.owner.plot.property.felling.areacutting/areacutting,2)
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
        this.owner = owner;
        this.steps = [];        
    }

    round_value(value, digits) {
        return parseFloat(value.toFixed(digits))
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
        
        
        var average 	= this.round_value((parseFloat(rowSortTable.average1)+parseFloat(rowSortTable.average2))*business,2);
        var large 		= this.round_value(parseFloat(rowSortTable.large)*business,2);
        var small 		= this.round_value(parseFloat(rowSortTable.small)*business,2);
        var waste_b		= this.round_value(parseFloat(rowSortTable.waste_b)*business,2);
        var technical_b = this.round_value(parseFloat(rowSortTable.technical_b)*business,2);
        var firewood_b 	= this.round_value(parseFloat(rowSortTable.firewood_b)*business,2);
        
        if(rowSortFirewoodTable){
            large 		= large			+	this.round_value(parseFloat(rowSortFirewoodTable.large)*firewood,2);
            small 		= small			+	this.round_value(parseFloat(rowSortFirewoodTable.small)*firewood,2);
            average 	= average		+	this.round_value((parseFloat(rowSortFirewoodTable.average1)+parseFloat(rowSortFirewoodTable.average2))*firewood,2);
            waste_b		= waste_b		+	this.round_value(parseFloat(rowSortFirewoodTable.waste_b)*firewood,2);
            technical_b	= technical_b	+	this.round_value(parseFloat(rowSortFirewoodTable.technical_b)*firewood,2);
            firewood_b	= firewood_b	+	this.round_value(parseFloat(rowSortFirewoodTable.firewood_b)*firewood,2);
        }
    
        var totalfirewood_b 	= 0;
        if(this.owner.settings.assessfirewoodcommonstock == 1) {
            totalfirewood_b	= technical_b + firewood_b;
        }	
    
        var options = {	'step'	:			rowStep.step,
                        'business'	:		business,
                        'firewood'	:		firewood,
                        'total'			:	business + firewood,
                        'large'	:			large,
                        'average'	:		average,
                        'small'	:			small,
                        'totalbusiness_b':	this.round_value(large+average+small,2),
                        'technical_b':		technical_b,
                        'firewood_b':		firewood_b,
                        'totalfirewood_b':	totalfirewood_b,
                        'waste_b':			waste_b,
                        
                        'technical_f':		this.round_value(technical_f*firewood,2),
                        'firewood_f':		this.round_value(firewood_f*firewood,2),
                        'waste_f':			this.round_value(waste_f*firewood,2),
                        'totalfirewood_f':	this.round_value(totalfirewood_f*firewood,2),
                    };
    
        return new ClassAssortmentStructure(options)
    
    }

    feelTotalSteps(totalSteps) {

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
            //окургление
            for (var key in total) {
                if(key == 'step') {
                    continue;
                }
                total[key] = this.round_value(total[key],2);
            }
            totalSteps.push({
                id:     row_objectTaxation.id,
                total:  total
            })
        }
    }

    feelTotalValue(totalValue) {
        
        for (var key in objTotalStep) {
            if(	key == 'recid' || 
                key == 'step' ||
                key == 'business' ||
                key == 'halfbusiness' ||
                key == 'firewood' ||
                key == 'business_r' ||
                key == 'firewood_r'){
                continue;
            }
            var value = 0;
            if(objTaxation.id == 5){
                //ленточный перечет
                value = Math.round(objTotalStep[key]*objectMDO.coefficient*1000)/1000;
            }else{
                value = objTotalStep[key];
            }	
            //округление
            if(constantValues.orderRoundingValues == 3){
                value = Math.round(value*100)/100;			
            }
            if(constantValues.orderRoundingValues == 2){
                value = Math.round(value*10)/10;			
            }
            if(constantValues.orderRoundingValues == 1){
                value = Math.round(value);			
            }		
            obgTotalValue[key] = value;
                
        }
        
        obgTotalValue.totalbusiness_b 	= obgTotalValue.large 			+ obgTotalValue.average 	+ obgTotalValue.small;
        
        if(constantValues.assessfirewoodcommonstock == 0) {
            obgTotalValue.totalfirewood_b = obgTotalValue.technical_b + obgTotalValue.firewood_b;
        }else{
            obgTotalValue.technical_b = 0;
            obgTotalValue.firewood_b = 0;
        }
        
        obgTotalValue.liquidity 		= obgTotalValue.totalbusiness_b	+ obgTotalValue.totalfirewood_b;
        obgTotalValue.total_b 			= obgTotalValue.liquidity		+ obgTotalValue.waste_b;
        
        if(constantValues.assessfirewoodcommonstock == 0) {
            obgTotalValue.total_f 			= obgTotalValue.technical_f + obgTotalValue.firewood_f + obgTotalValue.waste_f;
            obgTotalValue.totalfirewood_f 	= obgTotalValue.technical_f + obgTotalValue.firewood_f;	
            if(constantValues.assesswastefirewood == 1){
                obgTotalValue.totalfirewood_f 		= obgTotalValue.totalfirewood_f + obgTotalValue.waste_f;	
            }		
        }else{
            obgTotalValue.total_f	= obgTotalValue.totalfirewood_f;
            if(constantValues.assesswastefirewood == 0){
                obgTotalValue.total_f 		= obgTotalValue.total_f + obgTotalValue.waste_f;	
            }			
            obgTotalValue.technical_f = 0;
            obgTotalValue.firewood_f = 0;
            obgTotalValue.waste_f = 0;
        }
        
        for (var key in obgTotalValue) {
            objectMDO.obgTotalsValue[key] = objectMDO.obgTotalsValue[key]+obgTotalValue[key];
        }	
        
        return obgTotalValue; 
    }




}


//Строка расчета сортиментной структура
class ClassAssortmentStructure {

    constructor(options) {
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
            this[key] = options[key];
        }
    }
}