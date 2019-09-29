import {ENUMERATIONS} from "./enumerations";
import {TYPESRATES} from "./typesrates";
import {RECOUNTLAYOUT} from "./recountlayout";
import {BD} from "./dao";

import {store} from "../src/app";
import * as methodscleanings from "../actions/reference/methodscleanings";
import * as forestry from "../actions/reference/forestry";
import * as subforestry from "../actions/reference/subforestry";
import * as tract from "../actions/reference/tract";
import * as cuttingmethods from "../actions/reference/cuttingmethods";

var objectMDO;

export var PARAMETERS = {};
PARAMETERS.foresters = [];
PARAMETERS.subforestry = [];
PARAMETERS.tract = [];
PARAMETERS.cuttingmethods = [];
PARAMETERS.typesrates = [];
PARAMETERS.methodscleaning = [];
PARAMETERS.formCutting = [];
PARAMETERS.groupCutting = [];


PARAMETERS.config = {
    
	tabsPARAMETERS: {
        name: 'tabsPARAMETERS',
        active: 'cutting',
        tabs: [
            { id: 'cutting', caption: 'Параметры таксации' },
            { id: 'location', caption: 'Местоположение' }
        ],
		onClick: function (event) {
            $('#PARAMETERS .tabP').hide();
            $('#PARAMETERS #' + event.target).show();
			w2ui[PARAMETERS.config.formLocation.name].refresh();
			w2ui[PARAMETERS.config.formCutting.name].refresh();
        }
    },
	
	
	formCutting: {
        name   : 'formCutting',
		style: 'border: 0px;',
		focus  : -1,
		fields : [
			{ field: 'methodTaxation', type: 'list', options :{items: ENUMERATIONS.methodTaxation}, html: { caption: 'Метод таксации:', span: '8', attr: 'style="width: 100%"'}, required: true },
			{ field: 'property', type: 'list', options :{items: ENUMERATIONS.property}, html: { caption: 'Хозяйство:', span: '8', attr: 'style="width: 100%"'}, required: true},
			{ field: 'formCutting', type: 'list', options :{items: PARAMETERS.formCutting}, html: { caption: 'Форма рубки:', span: '8', attr: 'style="width: 100%"'}, required: true},
			{ field: 'groupCutting', type: 'list', options :{items: PARAMETERS.groupCutting}, html: { caption: 'Группа рубки:', span: '8', attr: 'style="width: 100%"'}, required: false},
			{ field: 'cuttingmethods', type: 'list',options :{items: PARAMETERS.cuttingmethods}, html: { caption: 'Способ рубки:', span: '8', attr: 'style="width: 100%"'} },
			{ field: 'methodscleaning', type: 'list',options :{items: PARAMETERS.methodscleaning}, html: { caption: 'Способ очистки:', span: '8', attr: 'style="width: 100%"'}},
			{ field: 'areacutting', type: 'float', html: { caption: 'Площадь лесосеки, га:', span: '8', attr: 'style="width: 100px"'}, required: true },
			{ field: 'typesrates', type: 'list',options :{items: PARAMETERS.typesrates}, html: { caption: 'Вид ставки:', span: '8', attr: 'style="width: 100%"'}, required: true },
			{ field: 'rankTax', type: 'list', options :{items: ENUMERATIONS.rankTax}, html: { caption: 'Разряд такс:', span: '8', attr: 'style="width: 100px"'}, required: true },
			{ field: 'releasedate', type: 'date', options :{ format: 'dd.mm.yyyy' }, html: { caption: 'Дата отвода:', span: '8', attr: 'style="width: 100px"'} },
			{ field: 'valuationdate', type: 'date', options :{ format: 'dd.mm.yyyy' }, html: { caption: 'Дата оценки:', span: '8', attr: 'style="width: 100px"'} },
			{ field: 'estimator', type: 'textarea',  html: { caption: 'Расчет произвел:', span: '8', attr: 'style="width: 100%"'} },
			
		],
		onChange: function (event) {
			if(event.target == 'areacutting'){
				objectMDO.areacutting = event.value_new;
			}
			if(event.target == 'property'){
				objectMDO.property = event.value_new;
			}
			if(event.target == 'formCutting'){
				objectMDO.formCutting = event.value_new;
				if(event.value_new.id != event.value_previous.id){
					w2ui[PARAMETERS.config.formCutting.name].record.cuttingmethods = null;
					var conditions = {
						status:0,
						formCutting:[event.value_new.id],
						groupCutting:[objectMDO.groupCutting.id]
					};
					PARAMETERS.fillCuttingmethods(conditions)
				}
			}	
			if(event.target == 'groupCutting'){
				objectMDO.groupCutting = event.value_new;
				if(event.value_new.id != event.value_previous.id){
					w2ui[PARAMETERS.config.formCutting.name].record.cuttingmethods = null;
					var conditions = {
						status:0,
						formCutting:[objectMDO.formCutting.id],
						groupCutting:[event.value_new.id]
					};
					PARAMETERS.fillCuttingmethods(conditions)
				}
			}
			if(event.target == 'cuttingmethods'){
				objectMDO.cuttingmethods = event.value_new;
			}
			if(event.target == 'methodscleaning'){
				objectMDO.methodscleaning = event.value_new;
			}
			if(event.target == 'methodTaxation'){
				objectMDO.methodTaxation = event.value_new;
				PARAMETERS.visibility();				
			}
			if(event.target == 'typesrates'){
				objectMDO.typesrates = event.value_new;
			}
			if(event.target == 'rankTax'){
				objectMDO.rankTax = event.value_new;
			}
			if(event.target == 'releasedate'){
				objectMDO.releasedate = event.value_new;
			}
			if(event.target == 'valuationdate'){
				objectMDO.valuationdate = event.value_new;
			}	
			if(event.target == 'estimator'){
				objectMDO.estimator = event.value_new;
			}

		},
			
    },
	
	formLocation: {
        name   : 'formLocation',
		style: 'border: 0px;',
		focus  : -1,
		fields : [
			{ field: 'forestry', type: 'list',options :{items: PARAMETERS.foresters}, html: { caption: 'Лесничество:', span: '8', attr: 'style="width: 100%"'} },
			{ field: 'subforestry', type: 'list',options :{items: PARAMETERS.subforestry}, html: { caption: 'Участковое лесничество:', span: '8', attr: 'style="width: 100%"'} },
			{ field: 'tract', type: 'list',options :{items: PARAMETERS.tract}, html: { caption: 'Урочище:', span: '8', attr: 'style="width: 100%"'} },
			{ field: 'quarter', type: 'int', html: { caption: 'Квартал:', span: '8', attr: 'style="width: 50px"'} },
			{ field: 'isolated', type: 'text', html: { caption: 'Выделы:', span: '8', attr: 'style="width: 100%"'} },
			{ field: 'cuttingarea', type: 'text', html: { caption: '№ лесосеки (делянки):', span: '8', attr: 'style="width: 100%"'} },
			{ field: 'purposeForests', type: 'list', options :{items: ENUMERATIONS.purposeForests}, html: { caption: 'Целевое назначение:', span: '8', attr: 'style="width: 100%"'} },
			{ field: 'undergrowth', type: 'textarea',  html: { caption: 'Подрост:', span: '8', attr: 'style="width: 100%"'} },
			{ field: 'seedtrees', type: 'textarea',  html: { caption: 'Семменники:', span: '8', attr: 'style="width: 100%"'} },

		],
		

		onChange: function (event) {
			if(event.target == 'forestry'){
				objectMDO.forestry = event.value_new;
				PARAMETERS.fillSubforestry(event.value_new.id)
			}
			if(event.target == 'subforestry'){
				objectMDO.subforestry = event.value_new;
				PARAMETERS.fillTract(event.value_new.id)
			}
			if(event.target == 'tract'){
				objectMDO.tract = event.value_new;
				//отбор урочищ 
			}
			if(event.target == 'quarter'){
				objectMDO.quarter = event.value_new;
			}
			if(event.target == 'quarter'){
				objectMDO.quarter = event.value_new;
			}
			if(event.target == 'isolated'){
				if(event.value_new != ''){
					var reg = /^[0-9,-]+$/;
					var rez = reg.test(event.value_new);				
					if(rez != true){
						var html = '<div style=\'padding: 10px\'>Допускается вводить только числа, запятые и тире!</div>';
						$('input[name*="'+event.target+'"]').w2overlay(html);					
						event.preventDefault();
						return; false
					}	
				}
				objectMDO.isolated = event.value_new;
			}
			if(event.target == 'cuttingarea'){
				objectMDO.cuttingarea = event.value_new;
			}
			if(event.target == 'purposeForests'){
				objectMDO.purposeForests = event.value_new;
			}
			if(event.target == 'undergrowth'){
				objectMDO.undergrowth = event.value_new;
			}
			if(event.target == 'seedtrees'){
				objectMDO.seedtrees = event.value_new;
			}			

		}
		
    },	
	
}

PARAMETERS.fillForestry = function () {

	PARAMETERS.foresters.splice(0,PARAMETERS.foresters.length);
	const asyncProcess = async (subforestry) => {
		await store.dispatch(forestry.fill_data({status:0}));
		let data = store.getState().forestry.data;
		for (var i = 0; i < data.length; i++) {
			var row = {};
			for (var property in data[i]) {
				if (property == "name") {
					row.text = data[i][property];
				} else {
					row[property] = data[i][property];
				}
			}
			PARAMETERS.foresters.push(row);
		}
	}
	asyncProcess(forestry);
} 


PARAMETERS.fillSubforestry = function (id) {

	const asyncProcess = async (subforestry) => {
		await store.dispatch(subforestry.fill_data({
			status:0,
			forestry:id
		}));
		let data 	= store.getState().subforestry.data;
		let items 	= [];
		for (var i = 0; i < data.length; i++) {
			var row = {};
			for (var property in data[i]) {
				if (property == "name") {
					row.text = data[i][property];
				} else {
					row[property] = data[i][property];
				}
			}
			items.push(row);
		}
		w2ui[PARAMETERS.config.formLocation.name].set('subforestry', { options :{items: items} });
		w2ui[PARAMETERS.config.formLocation.name].refresh();
	}

	asyncProcess(subforestry);

} 

PARAMETERS.fillTract = function (id) {

	const asyncProcess = async (tract) => {
		await store.dispatch(tract.fill_data({
			status:0,
			subforestry:id
		}));
		let data 	= store.getState().tract.data;
		let items 	= [];
		for (var i = 0; i < data.length; i++) {
			var row = {};
			for (var property in data[i]) {
				if (property == "name") {
					row.text = data[i][property];
				} else {
					row[property] = data[i][property];
				}
			}
			items.push(row);
		}
		w2ui[PARAMETERS.config.formLocation.name].set('tract', { options :{items: items} });
		w2ui[PARAMETERS.config.formLocation.name].refresh();
	}
	asyncProcess(tract);
}

PARAMETERS.fillMethodscleanings = function () {

	PARAMETERS.methodscleaning.splice(0,PARAMETERS.methodscleaning.length);
	const asyncProcess = async (methodscleanings) => {
		await store.dispatch(methodscleanings.fill_data({status:0}));
		let data = store.getState().methodscleanings.data;
		for (var i = 0; i < data.length; i++) {
			var row = {};
			for (var property in data[i]) {
				if (property == "name") {
					row.text = data[i][property];
				} else {
					row[property] = data[i][property];
				}
			}
			PARAMETERS.methodscleaning.push(row);
		}
	}
	asyncProcess(methodscleanings);
} 

PARAMETERS.fillCuttingmethods = function () {

	PARAMETERS.cuttingmethods.splice(0,PARAMETERS.cuttingmethods.length);
	const asyncProcess = async (cuttingmethods) => {
		await store.dispatch(cuttingmethods.fill_data({status:0}));
		let data = store.getState().cuttingmethods.data;
		for (var i = 0; i < data.length; i++) {
			var row = {};
			for (var property in data[i]) {
				if (property == "name") {
					row.text = data[i][property];
				} else {
					row[property] = data[i][property];
				}
			}
			PARAMETERS.cuttingmethods.push(row);
			w2ui[PARAMETERS.config.formCutting.name].set('cuttingmethods', { options :{items: PARAMETERS.cuttingmethods} });
			w2ui[PARAMETERS.config.formCutting.name].refresh();
		}
	}
	asyncProcess(cuttingmethods);
} 

 
PARAMETERS.beforeOpening = function () {

	PARAMETERS.typesrates.splice(0,PARAMETERS.typesrates.length);	
	BD.fillList(TYPESRATES, PARAMETERS.typesrates, ['recid', 'name', 'orderroundingrates', 'predefined', 'coefficientsindexing'],PARAMETERS.whenOpening);

}  

PARAMETERS.visibility = function () {

 	for (var i = 0; i < ENUMERATIONS.objectTaxation.length; i++) {
		if(objectMDO.methodTaxation.id == 1){
			if(ENUMERATIONS.objectTaxation[i].id == 5){
				ENUMERATIONS.objectTaxation[i].disabled = true;
			}else{
				ENUMERATIONS.objectTaxation[i].disabled = false;			
			}		
		}else
		{		
			if(ENUMERATIONS.objectTaxation[i].id == 5){
				ENUMERATIONS.objectTaxation[i].disabled = false;
			}else
			{
				ENUMERATIONS.objectTaxation[i].disabled = true;
			}
		}	
	} 

	var nodes = w2ui[RECOUNTLAYOUT.config.recountSidebar.name].nodes;
	for (var i = 0; i < nodes.length; i++) {
		if(objectMDO.methodTaxation.id == 1){
			if(nodes[i].ref.id == 5){
				w2ui[RECOUNTLAYOUT.config.recountSidebar.name].disable(nodes[i].id);
				w2ui[RECOUNTLAYOUT.config.recountSidebar.name].collapse(nodes[i].id);							
			}else{
				w2ui[RECOUNTLAYOUT.config.recountSidebar.name].enable(nodes[i].id);
				w2ui[RECOUNTLAYOUT.config.recountSidebar.name].expand(nodes[i].id);
			}
		}else{
			if(nodes[i].ref.id == 5){
				w2ui[RECOUNTLAYOUT.config.recountSidebar.name].enable(nodes[i].id);
				w2ui[RECOUNTLAYOUT.config.recountSidebar.name].expand(nodes[i].id);
			}else{
				w2ui[RECOUNTLAYOUT.config.recountSidebar.name].disable(nodes[i].id);
				w2ui[RECOUNTLAYOUT.config.recountSidebar.name].collapse(nodes[i].id);
			}
		}
	}
}  

PARAMETERS.whenOpening = function (dataSet) {

	
	if (w2ui.hasOwnProperty(PARAMETERS.config.tabsPARAMETERS.name)){
		w2ui[PARAMETERS.config.tabsPARAMETERS.name].destroy();
	} 
    $('#tabsPARAMETERS').w2tabs(PARAMETERS.config.tabsPARAMETERS);
	
	if (w2ui.hasOwnProperty(PARAMETERS.config.formLocation.name)){
		w2ui[PARAMETERS.config.formLocation.name].destroy();
	}; 	
	$('#locationForm').w2form(PARAMETERS.config.formLocation);
	
	if (w2ui.hasOwnProperty(PARAMETERS.config.formCutting.name)){
		w2ui[PARAMETERS.config.formCutting.name].destroy();
	}; 	
	$('#formCutting').w2form(PARAMETERS.config.formCutting);


	$('#location').hide();	
	$('#cutting').show();

	w2ui[PARAMETERS.config.formCutting.name].record = { 
		areacutting 	: objectMDO.areacutting,
		methodTaxation 	: objectMDO.methodTaxation,
		formCutting 	: objectMDO.formCutting,
		groupCutting 	: objectMDO.groupCutting,
		cuttingmethods 	: objectMDO.cuttingmethods,
		methodscleaning	: objectMDO.methodscleaning,
		property		: objectMDO.property,
		typesrates		: objectMDO.typesrates,
		rankTax			: objectMDO.rankTax,
		releasedate		: objectMDO.releasedate,
		valuationdate	: objectMDO.valuationdate,
		estimator		: objectMDO.estimator,
		
	}
	
	w2ui[PARAMETERS.config.formLocation.name].record = { 
		forestry    	: objectMDO.forestry,
		subforestry    	: objectMDO.subforestry,
		tract    		: objectMDO.tract,
		quarter    		: objectMDO.quarter,
		isolated    	: objectMDO.isolated,
		cuttingarea		: objectMDO.cuttingarea,
		purposeForests	: objectMDO.purposeForests,
		undergrowth		: objectMDO.undergrowth,
		seedtrees		: objectMDO.seedtrees,
	}


	if(store){
		PARAMETERS.fillForestry()
		PARAMETERS.fillSubforestry(objectMDO.forestry.id)
		PARAMETERS.fillTract(objectMDO.subforestry.id)
		PARAMETERS.fillMethodscleanings()
		PARAMETERS.fillCuttingmethods()	

		w2ui[PARAMETERS.config.formCutting.name].set('formCutting', { options :{items: store.getState().enumerations.formCutting} });		
		w2ui[PARAMETERS.config.formCutting.name].set('groupCutting', { options :{items: store.getState().enumerations.groupCutting} });

		w2ui[PARAMETERS.config.formCutting.name].refresh();


	}

	
	PARAMETERS.visibility();

	

}  

PARAMETERS.init = function (_objectMDO) {

	objectMDO = _objectMDO;
	PARAMETERS.beforeOpening();
	
}
