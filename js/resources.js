import {DESKTOP} from "./desktop";
import {BD} from "./dao";
import {TYPESCOEFFICIENTS} from "./typescoefficients";
import {COEFFICIENTSFORMCUTTING} from "./coefficientsformcutting";
import {COEFFICIENTSRANGESLIQUIDATION} from "./coefficientsrangesliquidation";
import {COEFFICIENTSDAMAGE} from "./coefficientsdamage";
import {CONSTANTS} from "./constants";


//Ресурсы
export var RESOURCES 	= {};

RESOURCES.allQueryComplit = function (xml) {
	DESKTOP.serialConnectionScripts();
}

//БЛОК ЗАГРУЗКИ ЛЕСОТАКСОВЫХ РАЙОНОВ


//БЛОК ЗАГРУЗКИ ПРЕДОПРЕДЕЛЕННЫХ КОЭФФИЦИЕНТОВ
RESOURCES.typescoefficientsLoad = function () {    
	
	var struct = [];
	
	var row = {};
	row.recid = 1;
	row.predefined = 1;
	row.name = "Коэффициент индексации ставок платы";
	struct.push(row);	
	
	var row = {};
	row.recid = 2;
	row.predefined = 1;
	row.name = "Коэффициент на форму рубки";
	struct.push(row);
	
	var row = {};
	row.recid = 3;
	row.predefined = 1;
	row.name = "Коэффициент на ликвидный запас";
	struct.push(row);	
	
	var row = {};
	row.recid = 4;
	row.predefined = 1;
	row.name = "Коэффициент на степень поврежденности насаждения";
	struct.push(row);	

	BD.addArray(TYPESCOEFFICIENTS, struct, RESOURCES.typescoefficientsComplit);
	

}

RESOURCES.typescoefficientsComplit = function () {
   
	RESOURCES.allQueryComplit();
	
}
//БЛОК ЗАГРУЗКИ ПРЕДОПРЕДЕЛЕННЫХ КОЭФФИЦИЕНТОВ - КОНЕЦ

//БЛОК ЗАГРУЗКИ КОЭФФИЦИЕНТОВ НА ФОРМУ РУБКИ
RESOURCES.coefficientsformcuttingLoad = function () {

	var struct = [];
	var row = {};
	row.recid = 1;
	row.typesrates_id = 1;
	row.formCutting = 2;
	row.value = 0.5;
	struct.push(row);
	
	BD.addArray(COEFFICIENTSFORMCUTTING, struct, RESOURCES.сheckRecidcoefficientsformcuttingComplit);	

}

RESOURCES.сheckRecidcoefficientsformcuttingComplit = function () {
   
	RESOURCES.allQueryComplit();
	
}

//БЛОК ЗАГРУЗКИ КОЭФФИЦИЕНТОВ ФОРМУ РУБКИ - конец

//БЛОК ЗАГРУЗКИ КОЭФФИЦИЕНТОВ НА ЛИКВИДНЫЙ ЗАПАС
RESOURCES.coefficientsrangesliquidationLoad = function () {    
	
	var struct = [];
	var row = {};
	row.recid = 1;
	row.typesrates_id = 1;
	row.rangesLiquidation = 1;
	row.value = 0.9;
	struct.push(row);	
	
	var row = {};
	row.recid = 2;
	row.typesrates_id = 1;
	row.rangesLiquidation = 2;
	row.value = 1.0;
	struct.push(row);
	
	var row = {};
	row.recid = 3;
	row.typesrates_id = 1;
	row.rangesLiquidation = 3;
	row.value = 1.05;
	struct.push(row);

	BD.addArray(COEFFICIENTSRANGESLIQUIDATION, struct, RESOURCES.coefficientsrangesliquidationComplit);

}


RESOURCES.coefficientsrangesliquidationComplit = function () {
   
	RESOURCES.allQueryComplit();
	
}
//БЛОК ЗАГРУЗКИ КОЭФФИЦИЕНТОВ НА ЛИКВИДНЫЙ ЗАПАС - КОНЕЦ


//БЛОК ЗАГРУЗКИ КОНСТАНТ
RESOURCES.constantsCheck = function () {

	var struct = [];
	var row = {};
	row.recid = 1;
	row.distributionhalfbusiness 			= 0;
	row.assessfirewoodcommonstock 			= 0;
	row.assesswastefirewood 				= 1;
	row.firewoodtrunkslindencountedinbark 	= 0;
	row.barklindenindividualreserves 		= 0;
	row.orderRoundingValues			 		= 1;
	row.orderRoundingRates			 		= 1;
	row.any 								= "Другая константа";
	struct.push(row);
	
	BD.addArray(CONSTANTS, struct, RESOURCES.constantsComplit);

}


RESOURCES.constantsComplit = function () {
   
	RESOURCES.allQueryComplit();
	
}

//БЛОК ЗАГРУЗКИ КОНСТАНТ - КОНЕЦ

//БЛОК ЗАГРУЗКИ КОЭФФИЦИЕНТОВ НА ПОВРЕЖДЕННОСТЬ
RESOURCES.coefficientsdamageLoad = function () {    
	
	var struct = [];
	var row = {};
	row.recid = 1;
	row.typesrates_id = 1;
	row.damage = 1;
	row.value = 0.9;
	struct.push(row);	
	
	var row = {};
	row.recid = 2;
	row.typesrates_id = 1;
	row.damage = 2;
	row.value = 0.8;
	struct.push(row);	
	
	var row = {};
	row.recid = 3;
	row.typesrates_id = 1;
	row.damage = 3;
	row.value = 0.7;
	struct.push(row);	

	var row = {};
	row.recid = 4;
	row.typesrates_id = 1;
	row.damage = 4;
	row.value = 0.6;
	struct.push(row);	
	
	var row = {};
	row.recid = 5;
	row.typesrates_id = 1;
	row.damage = 5;
	row.value = 0.5;
	struct.push(row);
	
	var row = {};
	row.recid = 6;
	row.typesrates_id = 1;
	row.damage = 6;
	row.value = 0.4;
	struct.push(row);

	var row = {};
	row.recid = 7;
	row.typesrates_id = 1;
	row.damage = 7;
	row.value = 0.3;
	struct.push(row);
	
	var row = {};
	row.recid = 8;
	row.typesrates_id = 1;
	row.damage = 8;
	row.value = 0.2;
	struct.push(row);
	
	var row = {};
	row.recid = 9;
	row.typesrates_id = 1;
	row.damage = 9;
	row.value = 0.1;
	struct.push(row);
	
	var row = {};
	row.recid = 10;
	row.typesrates_id = 1;
	row.damage = 10;
	row.value = 0.0;
	struct.push(row);
	
	BD.addArray(COEFFICIENTSDAMAGE, struct, RESOURCES.coefficientsdamageComplit);

}


RESOURCES.coefficientsdamageComplit = function () {
   
	RESOURCES.allQueryComplit();
	
}
//БЛОК ЗАГРУЗКИ КОЭФФИЦИЕНТОВ НА ПОВРЕЖДЕННОСТЬ - КОНЕЦ