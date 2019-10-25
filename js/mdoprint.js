import * as MDO from "./mdo";
import {PRINT} from "./print";
import * as FileSaver from "file-saver";

import {store} from "../src/app";

var LAYOUTstyle = 'border: 1px solid #dfdfdf; padding: 3px; overflow: hidden;border-radius: 3px;';

//ПЕЧАТЬ МДО ВЕДОМОСТИ
export var MDOPRINT = {

	callback:undefined,

	printLayout: {
		name: 'printLayout',
		padding: 2,
		panels: [
			{ type: 'top', size: 40, style: LAYOUTstyle, content:
				'<div id="toptoolbar" style="padding: 4px; background-color: rgba(250,250,250,0); "></div>' },
			{ type: 'main', resizable: true,  content: '<div id="printarea"></div>' },
		]
	},

	toptoolbar: {
		name: 'toptoolbar',
		items: [
			{ id: 'print', type: 'button', caption: 'Печать', icon: 'fa fa-print' },
			{ type: 'break',  id: 'break1' },			
			{ id: 'save', type: 'button', caption: 'Сохранить', icon: 'fa fa-floppy-o' },
			{ type: 'break',  id: 'break2' },
			{ id: 'close', type: 'button', caption: 'Закрыть', icon: 'fa fa-times' },
			{ type: 'spacer' },
		],
		onClick: function (event) {
			if (event.target == 'print') {
				var divToPrint=document.getElementById('printarea');
				var newWin= window.open("");
				newWin.document.write(divToPrint.outerHTML);
				newWin.print();
				newWin.close();
			}	
			if (event.target == 'save') {
				var data =  $('#printarea').html();
				var blob = new Blob([data], {type: "html;charset=utf-8"});
				FileSaver.saveAs(blob, "MDO.html");
			}
			if (event.target == 'close') {
				MDOPRINT.callback();
			}
		}
	},	
		
		
	
	mdoPrint: function () {
		
		var params = {};
		PRINT.add_section("headtable", "row0", params,);


		var params = {};
		params.left1 	=  MDO.objectMDO.forestry.fullname;
		params.right1 	=  MDO.objectMDO.areacutting;
		PRINT.add_section("headtable", "row1", params,);


		var params = {};
		params.left1 	=  MDO.objectMDO.subforestry.fullname;
		params.right1 	=  MDO.objectMDO.methodTaxation.text;
		PRINT.add_section("headtable", "row2", params);
		
		var params = {};
		params.left1 	=  MDO.objectMDO.tract.fullname;
		params.right1 	=  MDO.objectMDO.coefficient;
		PRINT.add_section("headtable", "row3", params);
		
		var params = {};
		params.left1 	=  MDO.objectMDO.quarter;
		params.right1 	=  MDO.objectMDO.rankTax.text;
		PRINT.add_section("headtable", "row4", params);
		
		var params = {};
		params.left1 	=  MDO.objectMDO.isolated;
		params.right1 	=  MDO.objectMDO.seedtrees;
		PRINT.add_section("headtable", "row5", params);
		
		var params = {};
		params.left1 	=  MDO.objectMDO.cuttingarea;
		params.right1 	=  MDO.objectMDO.parameters.curentpublication.name;
		PRINT.add_section("headtable", "row6", params);
		

		var params = {};
		params.left1 	= MDO.objectMDO.cuttingmethods.text;
		params.right1 	=  '';
		PRINT.add_section("headtable", "row7", params);
		
		var params = {};
		params.left1 	=  MDO.objectMDO.purposeForests.text;
		params.right1 	=  '';
		PRINT.add_section("headtable", "row8", params);
		
		var params = {};	
		params.left1 	=  MDO.objectMDO.property.text;
		params.right1 	=  MDO.objectMDO.parameters.curentforesttax.text;
		PRINT.add_section("headtable", "row9", params);
		
		var params = {};	
		params.left1 	=  MDO.objectMDO.undergrowth;
		params.right1 	=  MDO.objectMDO.methodscleaning.fullname;
		PRINT.add_section("headtable", "row10", params);



		for (var i = 0; i < MDO.objectMDO.arrayObjectsTaxation.length; i++) {
			
			if(MDO.check_methodTaxation(MDO.objectMDO.methodTaxation,MDO.objectMDO.arrayObjectsTaxation[i]) == false) {continue;}
			
			var elemTaxation = MDO.objectMDO.arrayObjectsTaxation[i];
			for (var j = 0; j < elemTaxation.arrayBreedTaxation.length; j++) {
				var elemBreed = elemTaxation.arrayBreedTaxation[j];
				var params = {};
				params.poroda = 'Порода: '+elemBreed.name+', разряд высот: '+elemBreed.rank;
				params.taxobject = 'Объект таксации: '+ elemTaxation.name+', площадь перечета: '+elemTaxation.areacutting+' га.';	
				PRINT.add_section("maintable", "row_poroda", params);
				
				for (var k = 0; k < elemBreed.arrayAssortmentStructure.length; k++) {
					var elemAssortmentStructure = elemBreed.arrayAssortmentStructure[k];
					PRINT.add_section("maintable", "row_detail", elemAssortmentStructure);
				} 
				var totalStep = elemBreed.totalStep;
				PRINT.add_section("maintable", "itog", elemBreed.totalStep);
				PRINT.add_section("maintable", "itog_videl", elemBreed.totalValue);
				PRINT.add_section("maintable", "stavki", elemBreed.feedrates);
				PRINT.add_section("maintable", "stoimost", elemBreed.totalSumm);
			}	
		}


		var params = {};
		params.poroda = 'Общие итоги';
		params.taxobject = '';	
		PRINT.add_section("maintable", "row_poroda", params);		
		PRINT.add_section("maintable", "itog_videl", MDO.objectMDO.obgTotalsValue);	
		PRINT.add_section("maintable", "stoimost", MDO.objectMDO.obgTotalsSumm);
		

		
		if(MDO.objectMDO.arrayOptionsplots.length == 2){
			//значит только один объект таксации и первая итоговая строка, выведем только итог
			PRINT.add_section("parameters", "totaloptionsplots", MDO.objectMDO.arrayOptionsplots[0]);		
		}else{
			for (var i = 0; i < MDO.objectMDO.arrayOptionsplots.length; i++) {
				if(i == 0){
					PRINT.add_section("parameters", "totaloptionsplots", MDO.objectMDO.arrayOptionsplots[i]);
				}else{
					PRINT.add_section("parameters", "optionsplots", MDO.objectMDO.arrayOptionsplots[i]);
				}			
			}		
		}
		
		if(MDO.objectMDO.arrayOptionbreeds.length == 2){
			//значит только один объект таксации и первая итоговая строка, выведем только итог
			PRINT.add_section("breeds_total", "totaloptionsplots", MDO.objectMDO.arrayOptionbreeds[0]);		
		}else{
			for (var i = 0; i < MDO.objectMDO.arrayOptionbreeds.length; i++) {
				if(i == 0){
					PRINT.add_section("breeds_total", "totaloptionsplots", MDO.objectMDO.arrayOptionbreeds[i]);
				}else{
					PRINT.add_section("breeds_total", "optionsplots", MDO.objectMDO.arrayOptionbreeds[i]);
				}			
			}		
		}
		
		PRINT.add_section("section_bootom", "coefficientshead", []);
		for (var i = 0; i < MDO.objectMDO.coefficients.length; i++) {		
			PRINT.add_section("section_bootom", "coefficients", MDO.objectMDO.coefficients[i]);			
		}
			
		PRINT.add_section("section_bootom", "parameters", []);

		var params = {};
		params.text = 'Порядок распределения полуделовых деревьев';
		params.value = MDO.objectMDO.parameters.curentdistributionhalfbusiness.text.toLowerCase();
		PRINT.add_section("section_bootom", "parametersrow", params);

		var params = {};
		params.text = 'Оценивать дровяную древесину по общему запасу';
		if(MDO.objectMDO.parameters.assessfirewoodcommonstock == 1){
			params.value = 'да';
		}else{
			params.value = 'нет';
		}
		PRINT.add_section("section_bootom", "parametersrow", params);

		var params = {};
		params.text = 'Оценивать отходы от дровяных стволов';
		if(MDO.objectMDO.parameters.assesswastefirewood == 1){
			params.value = 'да';
		}else{
			params.value = 'нет';
		}
		PRINT.add_section("section_bootom", "parametersrow", params,this.document);

		var params = {};
		params.text = 'Дровяные стволы липы учитывать в коре';
		if(MDO.objectMDO.parameters.firewoodtrunkslindencountedinbark == 1){
			params.value = 'да';
		}else{
			params.value = 'нет';
		}
		PRINT.add_section("section_bootom", "parametersrow", params);

		var params = {};
		params.text = 'Порядок округления объема';
		params.value = MDO.objectMDO.parameters.curentorderRoundingValues.text.toLowerCase();
		PRINT.add_section("section_bootom", "parametersrow", params);

		var params = {};
		params.text = 'Порядок округления сумм';
		params.value = MDO.objectMDO.parameters.curentorderRoundingRates.text.toLowerCase();
		PRINT.add_section("section_bootom", "parametersrow", params);


		var params = {};
		var estimator = "";
		if(MDO.objectMDO.estimator != undefined){
			estimator = MDO.objectMDO.estimator;
		}
		params.value = 'Ответственный __________________________ '+estimator;
		PRINT.add_section("section_bootom", "row", params);


		let contacts = store.getState().contactinformation.data;

		if(contacts != null){
			var params = {};
			params.value = 'Адрес: '+contacts.adress;
			PRINT.add_section("section_bootom", "contacts", params);
			var params = {};
			params.value = 'Телефон: '+contacts.fon;
			PRINT.add_section("section_bootom", "contacts", params);
			var params = {};
			params.value = 'E-mail: '+contacts.email;
			PRINT.add_section("section_bootom", "contacts", params);
			var params = {};
			params.value = 'Сайт: '+contacts.site;
			PRINT.add_section("section_bootom", "contacts", params);
		}else{
			var params = {};
			params.value = 'Адрес: не указан';
			PRINT.add_section("section_bootom", "contacts", params);
			var params = {};
			params.value = 'Телефон: не указан';
			PRINT.add_section("section_bootom", "contacts", params);
			var params = {};
			params.value = 'E-mail: не указан';
			PRINT.add_section("section_bootom", "contacts", params);
			var params = {};
			params.value = 'Сайт: не указан';
			PRINT.add_section("section_bootom", "contacts", params);
		}


		var params = {};
		params.value = 'Дата оценки: '+MDO.objectMDO.valuationdate+' г.';
		PRINT.add_section("section_bootom", "row", params);


		var params = {};
		params.value = 'Подготовлено в системе "АВЕРС: МДО лесосек #5". Сайт: http://mdoles.ru. Версия релиза '// + curentVersion;
		PRINT.add_section("section_copyright", "copyright", params);
	},

	beforeOpening: function () {
		this.whenOpening();
	},

	whenOpening: function () {
		if (w2ui.hasOwnProperty(this.printLayout.name)){
			w2ui[this.printLayout.name].destroy();
		}
		$('#content').w2layout(this.printLayout);

		if (w2ui.hasOwnProperty(this.toptoolbar.name)){
			w2ui[this.toptoolbar.name].destroy();
		}
		$('#toptoolbar').w2toolbar(this.toptoolbar);


		var url 	= '/print/vedomdo.html';
		PRINT.load_maket($("#printarea"), url, this.mdoPrint);

	},		
		
		
	init: function (callback) {
		this.callback = callback;
		this.beforeOpening();
	},
	
}

