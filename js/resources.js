import {DESKTOP} from "./desktop";
import {BD} from "./dao";
import {CONSTANTS} from "./constants";

//Ресурсы
export var RESOURCES 	= {};

RESOURCES.allQueryComplit = function (xml) {
	DESKTOP.serialConnectionScripts();
}

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