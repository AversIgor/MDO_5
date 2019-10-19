import {BD} from "./dao";
import {RESOURCES} from "./resources";
import {RECOUNTLAYOUT} from "./recountlayout";
import {MASTER} from "./master";
import * as MDO from "./mdo";


import splashscreen from '../img/splashscreen.png'

export var DESKTOP = {};
var scriptsarray = [];
var runSerialConnectionScripts = false;



DESKTOP.serialConnectionScripts = function (){

	if(scriptsarray.length == 0){
		w2popup.close();
		MASTER.checklicense = true;
		MASTER.init();
		return;
	}

	var curentfunction 		= scriptsarray[0].curentfunction;
	var description 		= scriptsarray[0].description;

	//окно приветствия
	var startpopup 			= $("#startpopup");
	var startpopupstatus 	= $("#startpopupstatus");
	startpopupstatus.html(description);
	w2popup.set({body:startpopup.html()});
	//окно приветствия - конец


	scriptsarray.splice(0, 1);
	curentfunction();

}

DESKTOP.init = function (){

	//ПЕРВЫЙ СТАРТ
	if(BD.db.version == ''){
		var script = {
			curentfunction : function() {
				BD.checkTabls();
			},
			description: 'Инициализация базы данных...'
		}
		scriptsarray.push(script);



		var script = {
			curentfunction : function() {
				RESOURCES.coefficientsformcuttingLoad();
			},
			description: 'Обновление коэффициентов на форму рубки...'
		}
		scriptsarray.push(script);
		var script = {
			curentfunction : function() {
				RESOURCES.coefficientsrangesliquidationLoad();
			},
			description: 'Обновление коэффициентов на ликвидный запас...'
		}
		scriptsarray.push(script);
		var script = {
			curentfunction : function() {
				RESOURCES.coefficientsdamageLoad();
			},
			description: 'Обновление коэффициентов на степень поврежденности насаждения...'
		}
		scriptsarray.push(script);
		var script = {
			curentfunction : function() {
				RESOURCES.constantsCheck();
			},
			description: 'Обновление основных констант...'
		}
		scriptsarray.push(script);
	}


	//ОБНОВЛЕНИЕ
 	if(BD.db.version != BD.curentVersion){
		var script = {
			curentfunction : function() {
				BD.checkTabls();
			},
			description: 'Обновление базы данных...'
		}
		scriptsarray.push(script);
	}
	//КОНЕЦ ОБНОВЛЕНИЯ


	var script = {
		curentfunction : function() {
			MDO.newMDO();
			MDO.objectMDO.startMDO();
			RECOUNTLAYOUT.init();
			setTimeout(DESKTOP.serialConnectionScripts,1000);
		},
		description: 'Инициализация интерфейса...'
	}
	scriptsarray.push(script);

	var startpopup;
	startpopup = $("<div/>", {
		style:"display: none; overflow: hidden",
		id:"startpopup"}
	).appendTo("body");
	var cont = $("<div/>", {
		style:"text-align: center; height: 100%;overflow: hidden"}
	).appendTo(startpopup);
	var cont = $("<img/>", {
		style:"position: absolute;top: 0;bottom: 0;left: 0;right: 0;margin: auto;",
		id:"img_logo",
		src:splashscreen
	}
	).appendTo(cont);
	var startpopupstatus = $("<div/>", {
		style:"position: absolute; top: 50%; left:8%; font-size: small; color: white;",
		id:"startpopupstatus"}
	).appendTo(startpopup);

	 w2popup.open({
		body:startpopup.html(),
		modal    : true,
		opacity  : 0.1,
		width:412,
		height:270,
		onOpen : function (event) {
			event.onComplete = function () {
				$('.w2ui-msg-no-buttons').css({'background-color':'#006EAE',"overflow":"hidden"});
				if(runSerialConnectionScripts == false){
					DESKTOP.serialConnectionScripts();
					runSerialConnectionScripts = true;
				}
			}
		}
	});


}

