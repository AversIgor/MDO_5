import {BD} from "./dao";
import {CONSTANTS} from "./constants";


export var ALLCONSTANT = {};
	ALLCONSTANT.data = {};
	ALLCONSTANT.publication = [];//Все сортиментные таблицы
	ALLCONSTANT.foresttax = [];//Все лесотаксовые районы

ALLCONSTANT.get = function () {

	ALLCONSTANT.publication.splice(0, ALLCONSTANT.publication.length); 
	ALLCONSTANT.foresttax.splice(0, ALLCONSTANT.foresttax.length); 
	jQuery.get('resources/publications.xml', {},function(temp){
		ALLCONSTANT.fillpublication(temp);
	}, 'xml')

}

ALLCONSTANT.fillpublication = function (data) {
	
	
    $(data).find("ИзданиеСортиментныхИТоварныхТаблиц").children().each(function () {
		var data = {};
		data.id = $(this).find("Идентификатор").text();
		data.name = $(this).find("Наименование").text();
		data.text = $(this).find("Наименование").text()+'. Версия: '+$(this).find("Версия").text();
		data.fullname = $(this).find("НаименованиеПолное").text();
		data.version = $(this).find("Версия").text();
		data.official = $(this).find("РеквизитыОфициальногоИздания").text();
		data.developer = $(this).find("РазработчикВерсии").text();
		data.barklindenindividualreserves = $(this).find("КораЛипыВыделенаОтдельнымЗапасом").text();
		ALLCONSTANT.publication.push(data);		
    });	

	var conditions = {};
	
	//BD.fillListWithConditions(FORESTTAX,['recid', 'name'],conditions,ALLCONSTANT.fillforesttax);	

} 

ALLCONSTANT.fillforesttax = function (data) {	
	
	ALLCONSTANT.foresttax = data;
	
	BD.filldata(CONSTANTS, ALLCONSTANT.fillConstants);

} 

ALLCONSTANT.fillConstants = function (dataSet) {	

	if(dataSet.length != 0){
		var curentpublication = {};
		for (var i = 0; i < ALLCONSTANT.publication.length; i++) {	
			if (ALLCONSTANT.publication[i].id == dataSet[0].publication){
				curentpublication  = ALLCONSTANT.publication[i];	
			} 
		}
		var curentforesttax = {};
		for (var i = 0; i < ALLCONSTANT.foresttax.length; i++) {
			if (ALLCONSTANT.foresttax[i].id == dataSet[0].foresttax){
				curentforesttax  = ALLCONSTANT.foresttax[i];	
			} 
		}
		
		var curentdistributionhalfbusiness = {};
		/*for (var i = 0; i < ENUMERATIONS.distributionhalfbusiness.length; i++) {				
			if (ENUMERATIONS.distributionhalfbusiness[i].id == dataSet[0].distributionhalfbusiness){
				curentdistributionhalfbusiness  = ENUMERATIONS.distributionhalfbusiness[i];	
			} 
		}*/
		
		/*var curentorderRoundingRates = {};
		for (var i = 0; i < ENUMERATIONS.orderRoundingRates.length; i++) {				
			if (ENUMERATIONS.orderRoundingRates[i].id == dataSet[0].orderRoundingRates){
				curentorderRoundingRates  = ENUMERATIONS.orderRoundingRates[i];	
			} 
		}*/
		
	/*	var curentorderRoundingValues = {};
		for (var i = 0; i < ENUMERATIONS.orderRoundingValues.length; i++) {				
			if (ENUMERATIONS.orderRoundingValues[i].id == dataSet[0].orderRoundingValues){
				curentorderRoundingValues  = ENUMERATIONS.orderRoundingValues[i];	
			} 
		}*/
		
		ALLCONSTANT.data.distributionhalfbusiness    		= dataSet[0].distributionhalfbusiness;
		ALLCONSTANT.data.assessfirewoodcommonstock   		= dataSet[0].assessfirewoodcommonstock;
		ALLCONSTANT.data.assesswastefirewood   				= dataSet[0].assesswastefirewood;
		ALLCONSTANT.data.firewoodtrunkslindencountedinbark	= dataSet[0].firewoodtrunkslindencountedinbark;
		ALLCONSTANT.data.barklindenindividualreserves   	= dataSet[0].barklindenindividualreserves;
		ALLCONSTANT.data.orderRoundingValues 				= dataSet[0].orderRoundingValues;
		ALLCONSTANT.data.orderRoundingRates 				= dataSet[0].orderRoundingRates;	
		ALLCONSTANT.data.organization    					= dataSet[0].organization;
		ALLCONSTANT.data.responsible   						= dataSet[0].responsible;
		ALLCONSTANT.data.contacts   						= dataSet[0].contacts;
		ALLCONSTANT.data.state   							= dataSet[0].state;
		ALLCONSTANT.data.public_authority   				= dataSet[0].public_authority;
		ALLCONSTANT.data.individual   						= dataSet[0].individual;
		ALLCONSTANT.data.first_name   						= dataSet[0].first_name;
		ALLCONSTANT.data.last_name   						= dataSet[0].last_name;
		ALLCONSTANT.data.patronymic_name   					= dataSet[0].patronymic_name;
		ALLCONSTANT.data.id_db   							= dataSet[0].id_db;
	}
	

	ALLCONSTANT.data.curentpublication   				= curentpublication;
	ALLCONSTANT.data.curentforesttax					= curentforesttax;
	ALLCONSTANT.data.curentdistributionhalfbusiness		= curentdistributionhalfbusiness;	
	ALLCONSTANT.data.curentorderRoundingRates			= curentorderRoundingRates;
	ALLCONSTANT.data.curentorderRoundingValues			= curentorderRoundingValues;
	
}

//module.exports = ALLCONSTANT;