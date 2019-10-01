import {BD} from "./dao";
import {ALLCONSTANT} from "./allconstant";
import {ENUMERATIONS} from "./enumerations";
import {PARAMETERS} from "./parameters";
import {COEFFICIENTSRANGESLIQUIDATION} from "./coefficientsrangesliquidation";
import {COEFFICIENTSFORMCUTTING} from "./coefficientsformcutting";
import {COEFFICIENTSDAMAGE} from "./coefficientsdamage";
import {FEEDRATES} from "./feedrates";
import {RECOUNTLAYOUT} from "./recountlayout";
import {CONSTANTS} from "./constants";
import {MDOPRINT} from "./mdoprint";
import * as FileSaver from "file-saver";

import {store} from "../src/app";
import * as breed from "../actions/reference/breed";

export var objectMDO;

export function newMDO(){

	let _objectMDO = new classMDO();

	objectMDO = new Proxy(_objectMDO, {
		get(target, prop) {
			return target[prop];
		},
		set(target, prop, value) {
			if(prop!="projectModified"){
				target.projectModified = true;
			}
			target[prop] = value;
			return true;
		}
	});
}


//главный объект для МДО
export function classMDO() {

	this.projectModified 	= false; //признак изменения данных объекта
	this.filename 			= '';
	
	this.parameters = {}; //все константы

	this.forestry = {};
	this.subforestry = {};
	this.tract = {};
	this.quarter = 0;	
	this.isolated = '';
	this.cuttingarea = '';	
	this.purposeForests = {};
	this.property = {};
	this.undergrowth = '';
	this.seedtrees = '';	
	
	this.areacutting = 0;//площадь лесосеки+
	this.arearecount = 0;//площадь перечета общая+
	this.methodTaxation = {};//+
	this.coefficient = 1;//+
	this.typesrates = {};//+
	this.rankTax = {};//+
	this.releasedate = '';//+
	this.valuationdate = '';//+
	this.estimator = '';//+
	this.formCutting = {};//+
	this.groupCutting = {};//+
	this.cuttingmethods = {};//+
	this.methodscleaning = {};//+
	
	this.coefficients = [];// коллекция коэффициентов таксации  +
	this.arrayObjectsTaxation = [];// коллекция объектов таксации
	
	//общие итоги по всем породам и объектам таксации
	this.obgTotalsValue = {};
	this.obgTotalsSumm = {};
	
	this.arrayOptionsplots = []; //параметры делянки
	this.arrayOptionbreeds = []; //параметры попородно

	//Абрис v2
	this.background = {};
	this.polygons = {};
	
}


//заполним поля пустыми значениями
classMDO.prototype.startMDO = function() {

	 ALLCONSTANT.get();
	
	var date  = (new Date()).getDate();
	if (date<10) date = "0"+date;	
	var month = (new Date()).getMonth()+1;
	if (month<10) month = "0"+month;
	var year  = (new Date()).getFullYear();

	this.methodTaxation = ENUMERATIONS.methodTaxation[0];
	this.property 		= ENUMERATIONS.property[0];
	this.formCutting 	= store.getState().enumerations.formCutting;
	this.rankTax 		= ENUMERATIONS.rankTax[0];
	this.areacutting	= 1;
	this.releasedate	= date+'.'+ month+'.' + year;
	this.valuationdate	= date+'.'+ month+'.' + year;
	this.typesrates		= PARAMETERS.typesrates[0];
	this.estimator		= ALLCONSTANT.data.responsible;

	this.parameters		= ALLCONSTANT.data;

	this.projectModified = false;	
	
};

classMDO.prototype.reloadMDO = function(data) {
		
	for (var key in data) {
		if (key == "arrayObjectsTaxation") {
			continue;
		}
		if (key == "arrayOptionsplots") {
			continue;
		}
		if (key == "arrayOptionbreeds") {
			continue;
		}
        this[key] = data[key];
    }	
	
	for (var i = 0; i < data.arrayObjectsTaxation.length; i++) {
		var elemTaxation = data.arrayObjectsTaxation[i];
		var objTaxation = new ClassObjectTaxation(elemTaxation);
		this.addObjectsTaxation(objTaxation);
		for (var j = 0; j < elemTaxation.arrayBreedTaxation.length; j++) {
			var elemBreed = elemTaxation.arrayBreedTaxation[j];
			var objBreed = new ClassObjectBreed(elemBreed);
			objTaxation.addObjectBreed(objBreed);
			for (var k = 0; k < elemBreed.arrayStep.length; k++) {
				var elemStep = elemBreed.arrayStep[k];
				var objStep = new ClassObjecStep(elemStep);
				objBreed.addObjectStep(objStep);		
			}
			for (var k = 0; k < elemBreed.arrayAssortmentStructure.length; k++) {
				var elemAssortmentStructure = elemBreed.arrayAssortmentStructure[k];
				var AssortmentStructure = new ClassAssortmentStructure(elemAssortmentStructure);
				objBreed.addAssortmentStructure(AssortmentStructure);		
			}			
		
			objBreed.totalStep = new ClassAssortmentStructure(elemBreed.totalStep);		

			objBreed.totalValue = new ClassAssortmentStructure(elemBreed.totalValue);
			objBreed.feedrates = new ClassAssortmentStructure(elemBreed.feedrates);
			objBreed.totalSumm = new ClassAssortmentStructure(elemBreed.totalSumm);			
		}	
	} 	
	
	if(data.arrayOptionsplots != undefined) {
		for (var i = 0; i < data.arrayOptionsplots.length; i++) {
			var elemOptionsPlots = data.arrayOptionsplots[i];
			var objOptionsPlots = new ClassOptionsPlots(elemOptionsPlots);
			this.addOptionsPlots(objOptionsPlots);
		}
	}
	
	if(data.arrayOptionbreeds != undefined) {
		for (var i = 0; i < data.arrayOptionbreeds.length; i++) {
			var elemOptionsBreeds = data.arrayOptionbreeds[i];
			var objOptionsBreeds = new ClassOptionsPlots(elemOptionsBreeds);
			this.addOptionsBreeds(objOptionsBreeds);
		}
	}

	this.projectModified = false;
	
};

classMDO.prototype.addObjectsTaxation = function(objectTaxation) {

	this.arrayObjectsTaxation.push(objectTaxation);
	
};

classMDO.prototype.addOptionsPlots = function(optionsPlots) {

	this.arrayOptionsplots.push(optionsPlots);
	
};

classMDO.prototype.addOptionsBreeds = function(optionsBreeds) {

	var updateIndex = -1;
	for(var i = 0; i < this.arrayOptionbreeds.length; i++) {
		if(this.arrayOptionbreeds[i].nameobjectTaxation == optionsBreeds.nameobjectTaxation) {
			updateIndex = i;
			break;
		}
	}
	
	if(updateIndex > -1)  { //добавляем данные к существующей породе:
		for (var key in optionsBreeds) {
			if(	key == 'nameobjectTaxation') {
				continue;
			}				
			this.arrayOptionbreeds[updateIndex][key] += optionsBreeds[key];
		}
	} else
		this.arrayOptionbreeds.push(optionsBreeds);
	
};

classMDO.prototype.deleteObjectsTaxation = function(objectTaxation) {

	var indexElem = this.arrayObjectsTaxation.indexOf(objectTaxation);
	if(indexElem != -1){
		this.arrayObjectsTaxation.splice(indexElem, 1);	
	}
	
};

classMDO.prototype.getObjectsTaxation = function(uid) {
	var obj = null;
	for (var i = 0; i < this.arrayObjectsTaxation.length; i++) {
		if(this.arrayObjectsTaxation[i].uid == uid){
			var obj = this.arrayObjectsTaxation[i];
			break;
		}
	}
	return obj;
};

//Объект таксации
export function ClassObjectTaxation(options) {

	this.uid			= '';
	this.name 			= '';
	this.id 			= 0;
	this.areacutting 	= 0;
	this.arrayBreedTaxation = [];// коллекция пород в объекте таксации

	for (var key in options) {
		if (typeof options[key] == "object") {
			continue;
		}
        this[key] = options[key];
    }
}

ClassObjectTaxation.prototype.addObjectBreed = function(objectBreed) {
	this.arrayBreedTaxation.push(objectBreed);
};

ClassObjectTaxation.prototype.deleteObjectBreed = function(objectBreed) {

	var indexElem = this.arrayBreedTaxation.indexOf(objectBreed);
	if(indexElem != -1){
		this.arrayBreedTaxation.splice(indexElem, 1);	
	}
	
};

//Порода
export function ClassObjectBreed(options) {

	this.uid				= '';
	this.name 				= '';
	this.id 				= 0;
	this.publication_id		= 0;
	this.tables_id			= 0;
	this.tablesfirewood_id	= 0;
	this.kodGulf			= 0;
	this.rank 				= '';
	this.arrayStep					= [];// коллекция ступеней толщины для перечета
	this.arrayAssortmentStructure	= [];// коллекция для расчета сортиментой структуры
	this.totalStep = {} //итоги по ступеням толщины
	this.totalValue = {} //итоги с учетом округдения и коэффициентом перечета для ленточного перечета
	this.feedrates = {} //ставки платы с учетом коэфициентов и округлением
	this.totalSumm = {} //итоги сумм
	
	for (var key in options) {
		if (typeof options[key] == "object") {
			continue;
		}
        this[key] = options[key];
    }

}

ClassObjectBreed.prototype.addObjectStep = function(ObjectStep) {
	this.arrayStep.push(ObjectStep);
};

ClassObjectBreed.prototype.addAssortmentStructure = function(AssortmentStructure) {
	this.arrayAssortmentStructure.push(AssortmentStructure);
};

//Ступень толщины
export function ClassObjecStep(options) {

	this.recid			= '';
	this.step 			= 0;
	this.business 		= 0;
	this.halfbusiness	= 0;
	this.firewood 		= 0;
	
	for (var key in options) {
		if (typeof options[key] == "object") {
			continue;
		}
        this[key] = options[key];
    }

}

//Строка расчета сортиментной структура
export function ClassAssortmentStructure(options) {

	this.recid			= '';
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
		if (typeof options[key] == "object") {
			continue;
		}
        this[key] = options[key];
    }

}

//Строка параметров делянки
export function ClassOptionsPlots(options) {
	
	this.nameobjectTaxation	 	= '';
	this.total	 				= 0;
	this.total_perhectare		= 0;
	this.liquidity	 			= 0;
	this.liquidity_perhectare	= 0;
	this.business	 			= 0;
	this.business_perhectare	= 0;	
	this.firewood	 			= 0;
	this.firewood_perhectare	= 0;
	
	this.numberstems	 		= 0;
	this.averagevolumestems		= 0;
	this.totalsumm				= 0;
	
	for (var key in options) {
		if (typeof options[key] == "object") {
			continue;
		}
        this[key] = options[key];
    }

}


var allQuery = 0;								//счетчик всех ассинхронных запросов
var breeds = []									//породы с осртиментками
var constantValues = {}; 						//значения констант и их расшифровок
var coefficientsformcuttingValues = []; 		//коэффициенты на форму рубки
var coefficientsrangesliquidationValues = []; 	//коэффициенты на ликвид
var coefficientsdamageValues = []; 				//коэффициенты на поврежденность
var feedratesValues = []; 						//ставки платы

var arrayError = []; 							//контейнер ошибок расчета

function fixError(textError) {

	var error = {};
	error.text = textError;
	arrayError.push(error);
	
}

export function save(callback) {
	var data = JSON.stringify(objectMDO, null, '\t');
	if(NODE_ENV == 'node-webkit'){
		var fs = require('fs');
		if(objectMDO.filename == "") {
			var input = $("<input/>", {
				style:"display:none",
				id:"outputFile",
				type:"file",
				nwsaveas:"Расчет.json",
				accept:".json"
			}).appendTo("body");
			input.unbind('change');
			input.change(function(evt) {
				objectMDO.filename = input.val();
				fs.writeFile(objectMDO.filename,data, function(err) {
					if(err) {
						w2alert(err);
					} else {
						callback();
					}
				});
				this.files.clear();
			});
			input.trigger('click');
		} else {
			fs.writeFile(objectMDO.filename, data, function(err) {
				if(err) {
					w2alert(err);
				} else {
					callback();
				}
			});
		}

	}else {
		if(objectMDO.filename == ""){
			objectMDO.filename = "Расчет.json";
		}
		var blob = new Blob([data], {type: "json;charset=utf-8"});
		FileSaver.saveAs(blob, objectMDO.filename);
	}

	objectMDO.projectModified = false;	
}

export function calculation() {

	var arrayErrorFill = w2ui['formCutting'].validate(false);

	if(arrayErrorFill.length != 0){
		$('#location').hide();	
		$('#cutting').show("fast", function(){
			for (var i = 0; i < arrayErrorFill.length; i++) {	
				var id = arrayErrorFill[i].field.name;
				$('input#'+id).w2overlay({name:id, html: '<div style="padding: 10px; line-height: 150%">Обязательное поле</div>'});	
			}
		});
		return;
	}
	
	allQuery = 6;
	
	//запросим все учетные настройки
	BD.filldata(CONSTANTS, fillConstantValues);

	//запросим все сортиментные таблицы
	fillSortablesValuesValues()

	//запросим все коэффициенты
	var conditions 	= {};
	conditions.typesrates_id = [objectMDO.typesrates.id];
	conditions.formCutting = [objectMDO.formCutting.id];
	var arrayField 	= ['value'];
	BD.fillListWithConditions(COEFFICIENTSFORMCUTTING,arrayField,conditions,fillCoefficientsformcutting);
	
	var conditions 	= {};
	conditions.typesrates_id = [objectMDO.typesrates.id];
	var arrayField 	= ['rangesLiquidation','value'];
	BD.fillListWithConditions(COEFFICIENTSRANGESLIQUIDATION,arrayField,conditions,fillCoefficientsrangesliquidation);
	
	var conditions 	= {};
	conditions.typesrates_id = [objectMDO.typesrates.id];
	var arrayField 	= ['damage','value'];
	BD.fillListWithConditions(COEFFICIENTSDAMAGE,arrayField,conditions,fillСoefficientsdamage);
	
	var conditions 	= {};
	conditions.typesrates_id = [objectMDO.typesrates.id];
	conditions.ranktax_id = [objectMDO.rankTax.id];
	var arrayField 	= ['breeds_id','large','average','small','firewood'];
	BD.fillListWithConditions(FEEDRATES,arrayField,conditions,fillFeedrates);
 
}

function fillConstantValues(data) {

	//заполним константы
	constantValues.distributionhalfbusiness 			= data[0].distributionhalfbusiness;
	constantValues.assessfirewoodcommonstock 			= data[0].assessfirewoodcommonstock;
	constantValues.assesswastefirewood 					= data[0].assesswastefirewood;
	constantValues.firewoodtrunkslindencountedinbark 	= data[0].firewoodtrunkslindencountedinbark;
	constantValues.barklindenindividualreserves 		= data[0].barklindenindividualreserves;
	constantValues.orderRoundingValues 					= data[0].orderRoundingValues;
	constantValues.orderRoundingValues 					= data[0].orderRoundingValues;
	constantValues.orderRoundingRates 					= data[0].orderRoundingRates;
	
	allQueryComplit();		
  
}

function fillSortablesValuesValues(data) {

	const asyncProcess = async (breed) => {
		await store.dispatch(breed.fill_data({
			status:0,
		}));
		let data 	= store.getState().breed.data;
		for (var i = 0; i < data.length; i++) {
			var row = {};
			for (var property in data[i]) {
				if (property == "name") {
					row.text = data[i][property];
				} else {
					row[property] = data[i][property];
				}
			}
			breeds.push(row);
		}
		allQueryComplit();
	}
	breeds.splice(0,breeds.length);
	asyncProcess(breed);

}

function fillCoefficientsformcutting(data) {

	coefficientsformcuttingValues = data;
	allQueryComplit();	

}

function fillCoefficientsrangesliquidation(data) {

	coefficientsrangesliquidationValues = data;
	allQueryComplit();	

}

function fillСoefficientsdamage(data) {

	coefficientsdamageValues = data;
	allQueryComplit();		
	
}

function fillFeedrates(data) {

	feedratesValues = data;
	allQueryComplit();
	
}

function allQueryComplit() {
	
	allQuery = allQuery-1;
	
	if(allQuery == 0){

		objectMDO.parameters		= ALLCONSTANT.data;
		
		//очистим все вспомогательные объекты
		clear_arrayMDO();  

		//перенесем из перечетной ведомости все данные в сортиментную структуру
		fill_arrayAssortmentStructure();
		
		if(arrayError.length != 0){
			var texterror = '';			
			for (var i = 0; i < arrayError.length; i++) {				
				texterror = texterror+arrayError[i].text+'\n';				
			}
			w2alert(texterror);
		}else{
			MDOPRINT.init(RECOUNTLAYOUT.init);
		}	
	}

}

function clear_arrayMDO() {
  
	for (var i = 0; i < objectMDO.arrayObjectsTaxation.length; i++) {
		var objTaxation = objectMDO.arrayObjectsTaxation[i];
		for (var j = 0; j < objTaxation.arrayBreedTaxation.length; j++) {
			var objBreed = objTaxation.arrayBreedTaxation[j];
			objBreed.arrayAssortmentStructure.splice(0, objBreed.arrayAssortmentStructure.length); 
			objBreed.totalStep = {} //итоги по ступеням толщины
			objBreed.totalValue = {} //итоги с учетом округдения и коэффициентом перечета для ленточного перечета
			objBreed.feedrates = {} //ставки платы с учетом коэфициентов и округлением
			objBreed.totalSumm = {} //итоги сумм
		}	
	}

	objectMDO.arrayOptionsplots.splice(0, objectMDO.arrayOptionsplots.length);
	objectMDO.arrayOptionbreeds.splice(0, objectMDO.arrayOptionbreeds.length);
	
	arrayError.splice(0, arrayError.length);
  
}

export function check_methodTaxation(methodTaxation,ObjectsTaxation) {
	
	var result = true;	
	if(methodTaxation.id == 1){
		if(ObjectsTaxation.id == 5){
			result = false;
		}
	}else{
		if(ObjectsTaxation.id != 5){
			result = false;
		}	
	} 	
	return result;
	
}

function fill_arrayAssortmentStructure() {  
  
	// соберем итоги для расчета коэффициентов
	var firewoodwaste	= 0;//дрова и отходы
	var totalbusiness	= 0;//деловая древесина
	var liquidity 		= 0;//ликвид
	objectMDO.arearecount     = 0;//площадь перечета
	
	//контейнеры итогов
	objectMDO.obgTotalsValue 	= new ClassAssortmentStructure({});
	objectMDO.obgTotalsSumm 	= new ClassAssortmentStructure({});
	
	
	for (var i = 0; i < objectMDO.arrayObjectsTaxation.length; i++) {
		
		if(check_methodTaxation(objectMDO.methodTaxation,objectMDO.arrayObjectsTaxation[i]) == false) {continue;}
		
		var objTaxation = objectMDO.arrayObjectsTaxation[i];
		for (var j = 0; j < objTaxation.arrayBreedTaxation.length; j++) {
			var objBreed = objTaxation.arrayBreedTaxation[j];
			
			//сформируем итоговую строку по ступеням толщины
			var objTotalStep = new ClassAssortmentStructure({});			
			for (var k = 0; k < objBreed.arrayStep.length; k++) {
				var objStep 			= objBreed.arrayStep[k];
				//на этом уровне заполним сортиментную структуру на основе сортиментных таблиц и настроек МДО				
				var objAssortmentStructure = fillStepFromSortTablesAndSettings(objBreed,objStep,objTotalStep);
				if(objAssortmentStructure != null){
					objBreed.addAssortmentStructure(objAssortmentStructure);
				}
			}
			objBreed.totalStep = objTotalStep;
			//сформируем итоги по ступеням толщины
			var objTotalValue = fillTotalValue(objTaxation,objTotalStep);
			objBreed.totalValue = objTotalValue;			
			//итог ликвида
			liquidity		= liquidity + objTotalValue.liquidity + objTotalValue.totalfirewood_f;			
			//итог дрова и отходы
			firewoodwaste = firewoodwaste + objTotalValue.totalfirewood_b + objTotalValue.waste_b + objTotalValue.total_f;	
			totalbusiness = totalbusiness + objTotalValue.totalbusiness_b;				
		}
		//итог площади перечета
		objectMDO.arearecount		= objectMDO.arearecount + objTaxation.areacutting;
	}
	
	//расчет коэффциентов на ставки платы

	calculationСoefficients(liquidity,firewoodwaste,totalbusiness);
	
	//поиск и пересчет ставок платы
	
	var totalСoefficient = 1;
	for(var i = 0; i < objectMDO.coefficients.length; i++){
		totalСoefficient = totalСoefficient * objectMDO.coefficients[i].value;
	}
	
	if(objectMDO.typesrates.coefficientsindexing > 0){
		var rowCoefficient = {};
		rowCoefficient.recid = objectMDO.coefficients.length+1;
		rowCoefficient.predefined = 1;
		rowCoefficient.name = 1;
		rowCoefficient.value = objectMDO.typesrates.coefficientsindexing;
		objectMDO.coefficients.push(rowCoefficient);
	}
	
	setCoefficientsNames();
		
	//расчет сумм
	
	var objOptionsPlotsTotal 					= new ClassOptionsPlots({});//итоговая строка параметров лесосеки
	objOptionsPlotsTotal.nameobjectTaxation 	= 'Всего';
	//первая строка параметров лесосеки итоговая
	objectMDO.addOptionsPlots(objOptionsPlotsTotal);
	objectMDO.addOptionsBreeds(objOptionsPlotsTotal);
	
	for (var i = 0; i < objectMDO.arrayObjectsTaxation.length; i++) {
		
		if(check_methodTaxation(objectMDO.methodTaxation,objectMDO.arrayObjectsTaxation[i]) == false) {continue;}

		objTaxation = objectMDO.arrayObjectsTaxation[i];
		var objOptionsPlots = new ClassOptionsPlots({});
		for (var j = 0; j < objTaxation.arrayBreedTaxation.length; j++) {
			var objOptionsBreeds = new ClassOptionsPlots({});
			objBreed = objTaxation.arrayBreedTaxation[j];
			//проставим ставки по каждой породе
			var objFeedrates = fillFeedratesForBreeds(objBreed,totalСoefficient);
			objBreed.feedrates = objFeedrates;	
			//проставим суммы по каждой породе
			var objtotalSumm = filltotalSumm(objBreed);
			objBreed.totalSumm = objtotalSumm;
			
			//вычислим параметры объекта таксации
			objOptionsBreeds.total 				= objBreed.totalValue.total_b			+objBreed.totalValue.total_f;
			objOptionsBreeds.liquidity 			= objBreed.totalValue.liquidity			+objBreed.totalValue.totalfirewood_f;
			objOptionsBreeds.business 			= objBreed.totalValue.totalbusiness_b;
			objOptionsBreeds.firewood 			= objBreed.totalValue.totalfirewood_b	+objBreed.totalValue.totalfirewood_f;
			objOptionsBreeds.numberstems 		= objBreed.totalStep.total;
			objOptionsBreeds.totalsumm 			= objBreed.totalSumm.liquidity			+objBreed.totalSumm.totalfirewood_f;
			
			//заполним параметры объекта таксации
			objOptionsPlots.total 				+= objOptionsBreeds.total;
			objOptionsPlots.liquidity 			+= objOptionsBreeds.liquidity;
			objOptionsPlots.business 			+= objOptionsBreeds.business;
			objOptionsPlots.firewood 			+= objOptionsBreeds.firewood;
			objOptionsPlots.numberstems 		+= objOptionsBreeds.numberstems;
			objOptionsPlots.totalsumm 			+= objOptionsBreeds.totalsumm;
			
			//заполним параметры породы
			objOptionsBreeds.nameobjectTaxation 	= objBreed.name;
			objOptionsBreeds.total_perhectare 		= objOptionsBreeds.total			/objTaxation.areacutting;
			objOptionsBreeds.liquidity_perhectare 	= objOptionsBreeds.liquidity		/objTaxation.areacutting;
			objOptionsBreeds.business_perhectare 	= objOptionsBreeds.business			/objTaxation.areacutting;
			objOptionsBreeds.firewood_perhectare 	= objOptionsBreeds.firewood			/objTaxation.areacutting;
			objOptionsBreeds.averagevolumestems 	= objOptionsBreeds.liquidity		/objOptionsBreeds.numberstems;
			objectMDO.addOptionsBreeds(objOptionsBreeds);
		}	
		
		//заполним параметры лесосеки
		objOptionsPlots.nameobjectTaxation 		= objTaxation.name;
		objOptionsPlots.total_perhectare 		= objOptionsPlots.total					/objTaxation.areacutting;
		objOptionsPlots.liquidity_perhectare 	= objOptionsPlots.liquidity				/objTaxation.areacutting;
		objOptionsPlots.business_perhectare 	= objOptionsPlots.business				/objTaxation.areacutting;
		objOptionsPlots.firewood_perhectare 	= objOptionsPlots.firewood				/objTaxation.areacutting;
		objOptionsPlots.averagevolumestems 		= objOptionsPlots.liquidity				/objOptionsPlots.numberstems;


		objectMDO.addOptionsPlots(objOptionsPlots);

		//заполним итоги по параметрам лесосеки
		for (var key in objOptionsPlots) {
			if(	key == 'nameobjectTaxation') {
				continue;
			}				
			objOptionsPlotsTotal[key] 				= objOptionsPlotsTotal[key]+objOptionsPlots[key];
		}
	}
	
	objOptionsPlotsTotal['total_perhectare'] 		= Math.round(objOptionsPlotsTotal['total']		/objectMDO.arearecount/objectMDO.coefficient);
	objOptionsPlotsTotal['liquidity_perhectare'] 	= Math.round(objOptionsPlotsTotal['liquidity']	/objectMDO.arearecount/objectMDO.coefficient);
	objOptionsPlotsTotal['business_perhectare'] 	= Math.round(objOptionsPlotsTotal['business']	/objectMDO.arearecount/objectMDO.coefficient);
	objOptionsPlotsTotal['firewood_perhectare'] 	= Math.round(objOptionsPlotsTotal['firewood']	/objectMDO.arearecount/objectMDO.coefficient);
	objOptionsPlotsTotal['numberstems'] 			= objOptionsPlotsTotal['numberstems']	*objectMDO.coefficient;
	objOptionsPlotsTotal['averagevolumestems'] 		= objOptionsPlotsTotal['liquidity']	/objOptionsPlotsTotal['numberstems'];

}

function calculationСoefficients(liquidity,firewoodwaste,totalbusiness) {
	
	//удалим автоматические коэффициенты
	for(var i = 0; i < objectMDO.coefficients.length; i++){
		if(objectMDO.coefficients[i].predefined == 1){
			objectMDO.coefficients.splice(i, 1);
			i--;
		}
	}
	

	//найдем коэффициент на форму рубки
	if(coefficientsformcuttingValues.length != 0){
		var rowCoefficient = {};
		rowCoefficient.recid = objectMDO.coefficients.length+1;
		rowCoefficient.predefined = 1;
		rowCoefficient.name = 2;
		rowCoefficient.value = coefficientsformcuttingValues[0].value;
		objectMDO.coefficients.push(rowCoefficient);
	}
	

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

function setCoefficientsNames() {//проставим название коэффициентов
	
	for(var i = 0; i < objectMDO.coefficients.length; i++){
		for(var j = 0; j < RECOUNTLAYOUT.typescoefficients.length; j++){
			if(objectMDO.coefficients[i].name == RECOUNTLAYOUT.typescoefficients[j].id){
				objectMDO.coefficients[i].text = RECOUNTLAYOUT.typescoefficients[j].text;
				break;
			}
		}
	}
}

// к инциденту 3161
function applyСoefficients(value,totalСoefficient) {
	var result = value;
	if(objectMDO.typesrates.coefficientsindexing > 0) {
		result *= objectMDO.typesrates.coefficientsindexing;
		result  = Math.round(result*100)/100;
	}
	result *= totalСoefficient;
	
	return result;
}

function fillFeedratesForBreeds(objBreed,totalСoefficient) {	

	var obgFeedrates = new ClassAssortmentStructure({});
	
	for (var i = 0; i < feedratesValues.length; i++) {
		if(feedratesValues[i].breeds_id == objBreed.id){
		
			obgFeedrates.large 		= applyСoefficients(feedratesValues[i].large,					totalСoefficient);
			obgFeedrates.average 	= applyСoefficients(feedratesValues[i].average,					totalСoefficient);
			obgFeedrates.small 		= applyСoefficients(feedratesValues[i].small,					totalСoefficient);


			if(constantValues.assessfirewoodcommonstock == 0) {
				obgFeedrates.technical_b 		= applyСoefficients(feedratesValues[i].firewood,	totalСoefficient);
				obgFeedrates.firewood_b 		= applyСoefficients(feedratesValues[i].firewood,	totalСoefficient);
				obgFeedrates.technical_f 		= applyСoefficients(feedratesValues[i].firewood,	totalСoefficient);
				obgFeedrates.firewood_f 		= applyСoefficients(feedratesValues[i].firewood,	totalСoefficient);
				if(constantValues.assesswastefirewood == 1){
					obgFeedrates.waste_f 		= applyСoefficients(feedratesValues[i].firewood,	totalСoefficient);	
				}				
			}else{
				obgFeedrates.totalfirewood_b	= applyСoefficients(feedratesValues[i].firewood,	totalСoefficient);
				obgFeedrates.totalfirewood_f	= applyСoefficients(feedratesValues[i].firewood,	totalСoefficient);
			}		
		}	
	}
	//округление
	for (var key in obgFeedrates) {
		if(	key != 'large' && 
			key != 'average' &&
			key != 'small' &&
			key != 'technical_b' &&
			key != 'firewood_b' &&
			key != 'technical_f' &&
			key != 'firewood_f' &&
			key != 'waste_f' &&
			key != 'totalfirewood_b' &&
			key != 'totalfirewood_f') {
			continue;
		}

		var value = obgFeedrates[key];
		//округление
		 
		if(objectMDO.typesrates.orderroundingrates == 3){
			value = Math.round(value*100)/100;			
		}
		if(objectMDO.typesrates.orderroundingrates == 2){
			value = Math.round(value*10)/10;			
		}
		if(objectMDO.typesrates.orderroundingrates == 1){
			value = Math.round(value);			
		}		
		obgFeedrates[key] = value;			
	}

	return obgFeedrates;	
	
}

function filltotalSumm(objBreed) {	

	var objtotalSumm = new ClassAssortmentStructure({});
	
	objtotalSumm.large 		= objBreed.totalValue.large		*objBreed.feedrates.large;
	objtotalSumm.average 	= objBreed.totalValue.average	*objBreed.feedrates.average;
	objtotalSumm.small 		= objBreed.totalValue.small		*objBreed.feedrates.small;
	
	if(constantValues.assessfirewoodcommonstock == 0) {
		objtotalSumm.technical_b 		= objBreed.totalValue.technical_b		*objBreed.feedrates.technical_b;
		objtotalSumm.firewood_b 		= objBreed.totalValue.firewood_b		*objBreed.feedrates.firewood_b;
		objtotalSumm.technical_f 		= objBreed.totalValue.technical_f		*objBreed.feedrates.technical_f;
		objtotalSumm.firewood_f 		= objBreed.totalValue.firewood_f		*objBreed.feedrates.firewood_f;
		if(constantValues.assesswastefirewood == 1){
			objtotalSumm.waste_f 		= objBreed.totalValue.waste_f			*objBreed.feedrates.waste_f;
		}				
	}else{
		objtotalSumm.totalfirewood_b 	= objBreed.totalValue.totalfirewood_b	*objBreed.feedrates.totalfirewood_b;
		objtotalSumm.totalfirewood_f 	= objBreed.totalValue.totalfirewood_f	*objBreed.feedrates.totalfirewood_f;
	}
	
	//округление
	for (var key in objtotalSumm) {
		if(	key == 'recid' || 
			key == 'step' ||
			key == 'business' ||
			key == 'halfbusiness' ||			
			key == 'firewood' ||
			key == 'total' ||
			key == 'business_r' ||
			key == 'firewood_r'){
			continue;
		}

		var value = objtotalSumm[key];
		//округление
		if(constantValues.orderRoundingRates == 3){
			value = Math.round(value*100)/100;			
		}
		if(constantValues.orderRoundingRates == 2){
			value = Math.round(value*10)/10;			
		}
		if(constantValues.orderRoundingRates == 1){
			value = Math.round(value);			
		}		
		objtotalSumm[key] = value;			
	}
	
	//ИТОГИ
	
	objtotalSumm.totalbusiness_b 	= objtotalSumm.large 			+ objtotalSumm.average 	+ objtotalSumm.small;
	if(constantValues.assessfirewoodcommonstock == 0) {
		objtotalSumm.totalfirewood_b = objtotalSumm.technical_b + objtotalSumm.firewood_b;
	}else{
		objtotalSumm.technical_b = 0;
		objtotalSumm.firewood_b = 0;
	}
	
	objtotalSumm.liquidity 		= objtotalSumm.totalbusiness_b	+ objtotalSumm.totalfirewood_b;
	
	if(constantValues.assessfirewoodcommonstock == 0) {
		objtotalSumm.totalfirewood_f 	= objtotalSumm.technical_f + objtotalSumm.firewood_f;	
		if(constantValues.assesswastefirewood == 1){
			objtotalSumm.totalfirewood_f 		= objtotalSumm.totalfirewood_f + objtotalSumm.waste_f;	
		}		
	}else{
		objtotalSumm.technical_f = 0;
		objtotalSumm.firewood_f = 0;
		objtotalSumm.waste_f = 0;
	}	
	
	for (var key in objtotalSumm) {
		objectMDO.obgTotalsSumm[key] = objectMDO.obgTotalsSumm[key]+objtotalSumm[key];
    }	
	
	return objtotalSumm;	
	
}

function fillTotalValue(objTaxation,objTotalStep) {
	
	//если ленточный перечет посчитаем все площади объектов таксации с ленточным перечетом
	//и расчитаем коэффициент через общую площадь лесосеки
	var obgTotalValue = new ClassAssortmentStructure({});
	
	if(objectMDO.methodTaxation.id == 1){
		objectMDO.coefficient = 1;
	}else{
		if(objTaxation.areacutting !=0){
			objectMDO.coefficient = Math.round((objectMDO.areacutting/objTaxation.areacutting)*100)/100;
		}else{		
			fixError('Не указана площадь объекта таксации!');
			objectMDO.coefficient = 1;
		}		
	}	
	
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

function round_value(in_number, in_digits, in_do_preround) {

	if(!in_do_preround) in_number = round_value(in_number, in_digits + 1, true);

	var multiplier = 1;
	for(var i = 0; i < in_digits; i++) {
		multiplier *= 10;
	}
	var pre_multiplier = multiplier * 10;

	return Math.round(in_number * pre_multiplier / 10) / multiplier;
}

function fillStepFromSortTablesAndSettings(objBreed,objStep,totalStep) { 

	var business 		= Number(objStep.business);
	var halfbusiness 	= Number(objStep.halfbusiness);
	var firewood 		= Number(objStep.firewood);
	if(business+halfbusiness+firewood == 0){
		return null;
	}	
	//распределим полуделовые				
	var halfbusinessFor = (halfbusiness-halfbusiness%2)/2; //целочилостное деление

	if(constantValues.distributionhalfbusiness == 0){
		var business_r = business+halfbusiness-halfbusinessFor;
		var firewood_r = firewood+halfbusinessFor;
	}
	if(constantValues.distributionhalfbusiness == 1){
		business_r = business+halfbusinessFor;
		firewood_r = firewood+halfbusiness-halfbusinessFor;
	}

	var rowSortTable 			= null;
	var rowSortFirewoodTable 	= null; //сортиментная таблица для дровяных стволов
	for (var i = 0; i < breeds.length; i++) {
		//console.log(breeds[i].table.id,objBreed.tables_id)
		if(breeds[i].table){
			if(breeds[i].table.id == objBreed.tables_id){
				rowSortTable = breeds[i].table.sorttables[objBreed.rank][objStep.step];
			}
		}
		if(breeds[i].tablefirewood){
			if(breeds[i].tablefirewood.id == objBreed.tablesfirewood_id){
				rowSortFirewoodTable = breeds[i].tablefirewood.sorttables[objBreed.rank][objStep.step];
			}
		}
		if(rowSortTable){
			break
		}
	}

	if(rowSortTable == null){
		fixError('Не найдено данных в сортиментной таблице для породы "'+objBreed.name+'", разряда высот: "'+
				objBreed.rank+', ступени толщины: "'+objStep.step+'"!');				
		return null;
	} 	
	
	
	//Учет дров от дровяных деревьев в зависимости от настроек	
	var technical_f 		= parseFloat(rowSortTable.technical_f);
	var	firewood_f 			= parseFloat(rowSortTable.firewood_f);	
	
	var totalfirewood_f 	= 0;				
	if(constantValues.assessfirewoodcommonstock == 1) {
		totalfirewood_f	= technical_f + firewood_f;
	}
	
	//отходы
	var waste_f		= parseFloat(rowSortTable.waste_f);

	if(objBreed.kodGulf == '304200'){
		if(constantValues.firewoodtrunkslindencountedinbark == 1 && constantValues.barklindenindividualreserves == 1) {
			//добавим кору если она отдельно и учет в коре
			firewood_f += parseFloat(rowSortTable.bark);
			waste_f += parseFloat(rowSortTable.bark);
		}
		if(constantValues.firewoodtrunkslindencountedinbark == 0 && constantValues.barklindenindividualreserves == 0) {
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

	//данные по ступени добавим в итоги
	
	for (var key in options) {
		if(	key == 'recid' || 
			key == 'step') {
			continue;
		}
		totalStep[key] = totalStep[key]+options[key];
    }	
	return objAssortmentStructure;

}