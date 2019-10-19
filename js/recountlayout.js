import * as MDO from "./mdo";
import {ENUMERATIONS} from "./enumerations";
import {BD} from "./dao";
import {PARAMETERS} from "./parameters";

import {store} from "../src/app";
import * as breed from "../actions/reference/breed";

export var RECOUNTLAYOUT = {};

RECOUNTLAYOUT.typescoefficients = []
RECOUNTLAYOUT.breeds = [];
var LAYOUTstyle = 'border: 1px solid #dfdfdf; padding: 1px; overflow: hidden;border-radius: 1px;';

RECOUNTLAYOUT.config = {
	recountLayout: {
        name: 'recountLayout',
        padding: 2,
        panels: [
			{ type: 'top', size: 40, style: LAYOUTstyle, content: 
			'<div id="toptoolbar" style="padding: 4px; background-color: rgba(250,250,250,0); "></div>' },
            { type: 'left', size: 270, minSize: 270, resizable: true, style: LAYOUTstyle,
				content: '<div id="recountSidebar" style="height: 100%; width: 100%; float: left"></div>' },
            { type: 'main', resizable: true, style: LAYOUTstyle, content: '<div id="recountGrid" style="width: 100%; height: 100%;"></div>' },
            { type: 'right', size: 440, resizable: true, style: LAYOUTstyle, content: ''},
			{ type: 'bottom', size: 25, resizable: false, style: LAYOUTstyle, content: '<div id="statusright" style="width: 100%; height: 100%;float: right;text-align: right;padding-right: 2px;  font-size: small"></div>'}
        ]
    },
	
	toptoolbar: {
        name: 'toptoolbar',
        items: [
				{ id: 'calculation', type: 'button', caption: 'Ведомость МДО', icon: 'fa fa-calculator icon-right-down' },
				{ type: 'break',  id: 'break1' },
				{ id: 'coefficients', type: 'button', caption: 'Коэффициенты', icon: 'fa fa-percent' },
				{ type: 'spacer' },
            ],
            onClick: function (event) {
				if (event.target == 'calculation') {
						MDO.calculation();
				}
				if (event.target == 'coefficients') {
					coefficientsOpen();
				}
			}
    },
	
	recountSidebar:{
		name: 'recountSidebar',
		topHTML    : 	'<button id ="addObjectTaxation", class="btn" onclick="RECOUNTLAYOUT_addObjectTaxation()">Добавить объект</button>'+
						'<button id ="addBreed", class="btn" onclick="RECOUNTLAYOUT_addBreed()">Добавить породу</button>',
		menu : [
			{ id: 'delete', text: 'Удалить', img: 'fa fa-trash-o' },
			{ id: 'edit', text: 'Изменить', img: 'fa fa-pencil' },			
		],
		onClick: function(event) {
			w2ui[RECOUNTLAYOUT.config.recountGrid.name].clear();
			if(event.object.ref instanceof MDO.ClassObjectBreed){
				fillOptionsForGrid(event.object.ref);
			}	
		},
		onMenuClick: function(event) {
			if(event.menuItem.id == 'delete'){			
				deleteItem();
			}
			if(event.menuItem.id == 'edit'){			
				editItem();
			}
		},
		onDblClick: function(event) {
			editItem();
		}		
	},
	
	recountGrid:{
		name: 'recountGrid',
		show: {
            header: false,
            toolbar: false,
            footer: false,
			toolbarSearch: false,
			columnHeaders  : true,
			toolbarReload  : false,
			toolbarColumns : true,
        },        
        columns: [
			{ field: 'recid', caption: 'ID', size: '10px', sortable: false, hidden:true },
			{ field: 'step', caption: 'Ступень толщины', size: '25%', sortable: false, attr: "align=center", style: "font-size:small"},
			{ field: 'business', caption: 'Деловые', size: '25%', sortable: false, editable: { type: 'real' }, render: 'number:0', min: 0, style: "font-size:small" },
			{ field: 'halfbusiness', caption: 'Полуделовые', size: '25%', sortable: false, editable: { type: 'real' }, render: 'number:0', min: 0, style: "font-size:small" },
			{ field: 'firewood', caption: 'Дровяные', size: '25%', sortable: false, editable: { type: 'real' }, render: 'number:0', min: 0, style: "font-size:small" },
		],
		onChange: function(event) {
			if(event.value_new == ''){
				event.preventDefault();
				return;
			}
			if(event.value_new < 0){
				w2alert('Допускается вводить только положительные числа!');	
				event.preventDefault();
				return;
			}			
			if(Number.isInteger(Number(event.value_new))){
				var row = w2ui[RECOUNTLAYOUT.config.recountGrid.name].get(event.recid);
				row.ref[this.columns[event.column].field] = event.value_new;
				event.onComplete = function () {
					w2ui[RECOUNTLAYOUT.config.recountGrid.name].save();	
				}	
			}else{
				w2alert('Допускается вводить только целые числа!');		
				event.preventDefault();
			}
		}
	},
	
	coefficientsGrid:{
		name: 'coefficientsGrid',
		show: {
            header: false,
            toolbar: true,
            footer: false,
			toolbarSearch: false,
			columnHeaders  : true,
			toolbarReload  : false,
			toolbarColumns : false,
		},
		

		toolbar: {
			items: [
				{ id: 'add', type: 'button', caption: 'Добавить', icon: 'w2ui-icon-plus' },
				{ id: 'delete', type: 'button', caption: 'Удалить', icon: 'w2ui-icon-cross' },
				{ type: 'break', id: 'break3' },				
				{ id: 'save', type: 'button', caption: 'Сохранить', icon: 'w2ui-icon-check' },											
			],			

			onClick: function (event) {
				if (event.target == 'add') {
					w2ui['coefficientsGrid'].add({ recid: w2ui['coefficientsGrid'].records.length + 1 });
				}
				if (event.target == 'save') {
					MDO.objectMDO.coefficients = w2ui['coefficientsGrid'].records;
					w2ui['coefficientsGrid'].save();					
				}
				if (event.target == 'delete') {					
					var selection = w2ui['coefficientsGrid'].getSelection();
					var isError = false;
					for (var i = 0; i < selection.length; i++) {
						var record = w2ui['coefficientsGrid'].get(selection[i]);
						if(record.predefined != null){
							w2alert("Нельзя удалять предопределенные элементы!");
							isError = true;
							break;
						}
					}						
					if(isError == true){
						return;
					}	
					
					w2confirm('Удалить выбранные строки?', function (btn) { 
						if(btn == 'Yes'){						
						    w2ui['coefficientsGrid'].select(selection);
							w2ui['coefficientsGrid'].delete(true);
							MDO.objectMDO.coefficients = w2ui['coefficientsGrid'].records;
						}
					})                     
				}			
			}
		},
		columns:[
			{ field: 'recid', caption: 'Код', size: '10%'},	
			{ field: 'predefined', caption: '', size: '5%', sortable: true, attr: "align=center" ,
				render: function (record, index, col_index) {
					var html = '';
					if(this.getCellValue(index, col_index) != ''){
						html = "<div style='color:red'>*</div>";
					}
					return html;
				}	
			},		
			{ field: 'name', caption: 'Коэффициент', size: '80%', sortable: true,

				editable: { type: 'select', items: RECOUNTLAYOUT.typescoefficients, showAll: true },
				render: function (record, index, col_index) {
					var html = '';
					for (var p in RECOUNTLAYOUT.typescoefficients) {
						if (RECOUNTLAYOUT.typescoefficients[p].id == this.getCellValue(index, col_index)) html = RECOUNTLAYOUT.typescoefficients[p].text;
					}
					return html;
				}

			},
			{ field: 'value', caption: 'Значение', size: '20%', sortable: true, editable: { type: 'float'}, render: 'float:2',  },
		]
	},
	
}		
						
function fillOptionsForGrid(objBreed) {

	var arrayOptions = [];
	for (var k = 0; k < objBreed.arrayStep.length; k++) {
		var elemStep = objBreed.arrayStep[k];
		var row = {};
		row.recid = elemStep.recid;
		row.step = elemStep.step;
		row.business = elemStep.business;
		row.halfbusiness = elemStep.halfbusiness;
		row.firewood = elemStep.firewood;
		row.ref = elemStep;	
		arrayOptions.push(row);		
	}
	
	addGrid(arrayOptions); 

}

window.RECOUNTLAYOUT_addObjectTaxation = function addObjectTaxation() {
	$('#addObjectTaxation').w2menu({
		align: 'left',
		name:'ObjectTaxation',
		items: ENUMERATIONS.objectTaxation,
		onSelect: function (event) { 
			var options = {	'uid':			'objTaxation'+(MDO.objectMDO.arrayObjectsTaxation.length+1),
							'name':			event.item.text,
							'id':			event.item.id,
							'areacutting':	0};
			var objTaxation = new MDO.ClassObjectTaxation(options);
			MDO.objectMDO.addObjectsTaxation(objTaxation);
			w2ui[RECOUNTLAYOUT.config.recountSidebar.name].add([
				{ id: objTaxation.uid, text: objTaxation.name, icon: 'fa fa-tree',ref:objTaxation}
			]); 
			selectingAreacutting(objTaxation);
		}
	});
}

function selectingAreacutting(objTaxation) {

    w2popup.open({
        title: 	'Укажите площадь объекта таксации',
		width: 	'330px',
		height: '150px',
		modal   : true,
		body    : '<div id="main" style="border: 0px;width: 100%;height: 100%;overflow: hidden;"></div>',
				
		onOpen  : function (event) {
            event.onComplete = function () {
				if (w2ui.hasOwnProperty('Areacutting')){
					w2ui['Areacutting'].destroy();
				}; 
				$('#w2ui-popup #main').w2form({
					name   : 'Areacutting',
					style: 'border: 0px;',
					focus  : 0,
					fields : [
						{ field: 'аreacutting', type: 'float', options :{precision: 4, autoFormat: true,min: 0},  html: { caption: 'Площадь объекта:', span: '6', attr: 'style="width: 100%"'}, required: true },
					],				
					onChange: function (event) {
						if(event.target == 'аreacutting'){
							if(event.value_new != 0){
								selectingAreacuttingComplit(event.value_new,objTaxation);
								w2popup.close();
							}							
						}							
					},
					actions: {
						'Выбрать': function (event) {
							var value = w2ui['Areacutting'].get('аreacutting').el.value;
							if(value != 0){								
								selectingAreacuttingComplit(value,objTaxation);
								w2popup.close();								
							}
						},
						'Отменить': function (event) {
							w2popup.close();
						},
					}					
				})
				if(objTaxation.areacutting != 0){
					w2ui['Areacutting'].record = { 
						аreacutting 	: objTaxation.areacutting
					}	
				}			
            }
		},
        showMax: false
    });
}

function selectingAreacuttingComplit(value,objTaxation) {				

	w2ui[RECOUNTLAYOUT.config.recountSidebar.name].select(objTaxation.uid);
	$('#recountSidebar').click();//эта хрень для снятия фокуса с кнопки	

	var curentNode = w2ui[RECOUNTLAYOUT.config.recountSidebar.name].selected;
	var node = w2ui[RECOUNTLAYOUT.config.recountSidebar.name].get(curentNode);
	node.ref.areacutting = parseFloat(value);	
	node.count = value+' га';	
	w2ui[RECOUNTLAYOUT.config.recountSidebar.name].refresh(curentNode);
	var html = '<div style=\'padding: 10px\'>Теперь добавьте породу.</div>';
	$('#addBreed').w2overlay(html);

}

window.RECOUNTLAYOUT_addBreed = function addBreed() {

	var curentNode = w2ui[RECOUNTLAYOUT.config.recountSidebar.name].selected;
	if(curentNode == null){
		w2alert('Не выбран объект таксации!');
		return;
	}
	
	if(RECOUNTLAYOUT.breeds.length == 0){
		w2alert('В справочнике пород нет ни одного элемента!');
		return;
	}

	var node = w2ui[RECOUNTLAYOUT.config.recountSidebar.name].get(curentNode);

	if(node.ref instanceof MDO.ClassObjectBreed){
		node = node.parent;
	}

	var objTaxation = node.ref;

	$('#addBreed').w2menu({
		align: 'left',
		name:'addBreed',
		items: RECOUNTLAYOUT.breeds,
		onSelect: function (event) {
			let tables_id 			= undefined
			let tablesfirewood_id 	= undefined
			if(event.item.table){
				tables_id = event.item.table.id
			}
			if(event.item.tablesfirewood){
				tablesfirewood_id = event.item.tablesfirewood.id
			}
			var options = {	'uid':		node.id+'-'+(objTaxation.arrayBreedTaxation.length+1),
							'name':		event.item.text,
							'id':		event.item.id,
							'tables_id':tables_id,
							'tablesfirewood_id':tablesfirewood_id,
							'kodGulf':event.item.kodGulf,
							'rank':		''};
			
			var objBreed = new MDO.ClassObjectBreed(options);
			objTaxation.addObjectBreed(objBreed);	

			w2ui[RECOUNTLAYOUT.config.recountSidebar.name].insert(node.id, null, [
				{ id: objBreed.uid, text: objBreed.name, icon: '',ref:objBreed }
			]); 
			w2ui[RECOUNTLAYOUT.config.recountSidebar.name].expand(node.id);
			w2ui[RECOUNTLAYOUT.config.recountSidebar.name].select(objBreed.uid);
			$('#recountSidebar').click();//эта хрень для снятия фокуса с кнопки	

			if(event.item.table){
				selectingCategoryHeights(event.item.table.sorttables)
			}
		}
	});

}

function selectingCategoryHeights(tables_sorttables) {
	var itemsCategoryHeights = [];
	for(let key in tables_sorttables) {
		itemsCategoryHeights.push({
			id:key,
			text:key
		});
	}
	w2popup.open({
		title: 	'Укажите разряд высот',
		width: 	'350px',
		height: '150px',
		modal   : true,
		body    : '<div id="main" style="position: absolute; left: 0px; top: 0px; right: 0px; bottom: 0px;"></div>',
		onOpen  : function (event) {
			event.onComplete = function () {
				if (w2ui.hasOwnProperty('popupForm')){
					w2ui['popupForm'].destroy();
				};
				$('#w2ui-popup #main').w2form({
					name   : 'popupForm',
					fields : [
						{ field: 'categoryHeights', type: 'list', options :{items: itemsCategoryHeights}, required: true, html: { caption: 'Разряд высот:'} },
					],
					actions: {
						'Выбрать': function (event) {
							var value = w2ui['popupForm'].get('categoryHeights').el.value;
							if(value != ""){
								selectingCategoryHeightsComplit(value,tables_sorttables);
								w2popup.close();
							}
						},
						'Отменить': function (event) {
							w2popup.close();
						},
					}
				});
			}
		},
		showMax: false
	});

}

function selectingCategoryHeightsComplit(value,tables_sorttables) {

	var curentNode = w2ui[RECOUNTLAYOUT.config.recountSidebar.name].selected;
	var node = w2ui[RECOUNTLAYOUT.config.recountSidebar.name].get(curentNode);
	node.ref.rank = value;
	node.count = 'разряд высот: '+value;
	w2ui[RECOUNTLAYOUT.config.recountSidebar.name].refresh(curentNode);
	//теперь можно вывести таблицу перечета

	fillSteps(value,tables_sorttables)

}

function fillSteps(value,tables_sorttables) {

	w2ui[RECOUNTLAYOUT.config.recountGrid.name].clear();

	var curentNode = w2ui[RECOUNTLAYOUT.config.recountSidebar.name].selected;
	var node = w2ui[RECOUNTLAYOUT.config.recountSidebar.name].get(curentNode);
	var objBreed = node.ref;

	objBreed.arrayStep.splice(0, objBreed.arrayStep.length);

	var arrayOptions = [];
	for(let key in tables_sorttables[value]) {
		var options = {	
			'recid':		node.id+'-'+(objBreed.arrayStep.length+1),
			'step':			key,
		};
		var objStep = new MDO.ClassObjecStep(options);
		objBreed.addObjectStep(objStep);
		options.ref = objStep;
		arrayOptions.push(options);
	}
	addGrid(arrayOptions);
}

function addGrid(options) {

	w2ui[RECOUNTLAYOUT.config.recountGrid.name].add(options);

}


function coefficientsOpen() {
	
    w2popup.open({
        title: 	'Коэффициенты на ставки платы',
		width: 	'600px',
		height: '300px',
		modal   : false,
		body    : '<div id="main" style="position: absolute; left: 0px; top: 0px; right: 0px; bottom: 0px;"></div>',
		onOpen  : function (event) {
            event.onComplete = function () {
				if (w2ui.hasOwnProperty('coefficientsGrid')){
					w2ui['coefficientsGrid'].destroy();
				}; 
				$('#w2ui-popup #main').w2grid(RECOUNTLAYOUT.config.coefficientsGrid);	
				w2ui['coefficientsGrid'].add(MDO.objectMDO.coefficients);
			}
		},
        showMax: false
    });	

}

function editItem() {

	var curentNode = w2ui[RECOUNTLAYOUT.config.recountSidebar.name].selected;
	if(curentNode == null){
		w2alert('Не выбран объект для редактирования!');
		return;
	}

	var node = w2ui[RECOUNTLAYOUT.config.recountSidebar.name].get(curentNode);

	if(node.ref instanceof MDO.ClassObjectBreed){
		for (var i = 0; i < RECOUNTLAYOUT.breeds.length; i++) {
			if(RECOUNTLAYOUT.breeds[i].table){
				if(RECOUNTLAYOUT.breeds[i].table.id == node.ref.tables_id){
					selectingCategoryHeights(RECOUNTLAYOUT.breeds[i].table.sorttables)
					break
				}
			}
		}
	}	
	
	if(node.ref instanceof MDO.ClassObjectTaxation){
		selectingAreacutting(node.ref);	
	}

}

function deleteItem() {

	var curentNode = w2ui[RECOUNTLAYOUT.config.recountSidebar.name].selected;
	if(curentNode == null){
		w2alert('Не выбран объект для удаления!');
		return;
	}

	var node = w2ui[RECOUNTLAYOUT.config.recountSidebar.name].get(curentNode);

	if(node.ref instanceof MDO.ClassObjectBreed){
		w2confirm('Удалить породу '+node.text+'?', function (btn) {
			if (btn == 'Yes') {
				//удалим породу
				var objTaxation = node.parent.ref;
				objTaxation.deleteObjectBreed(node.ref);
				w2ui[RECOUNTLAYOUT.config.recountSidebar.name].remove(curentNode);						
			}
		})

	}	
	
	if(node.ref instanceof MDO.ClassObjectTaxation){
		w2confirm('Удалить объект таксации '+node.text+'?', function (btn) {
			if (btn == 'Yes') {
				//удалим объект таксации
				MDO.objectMDO.deleteObjectsTaxation(node.ref);
				w2ui[RECOUNTLAYOUT.config.recountSidebar.name].remove(curentNode);					
			}
		})	
	}
	
}

RECOUNTLAYOUT.fillObjects = function () {

	for (var i = 0; i < MDO.objectMDO.arrayObjectsTaxation.length; i++) {
		var elemTaxation = MDO.objectMDO.arrayObjectsTaxation[i];
		w2ui[RECOUNTLAYOUT.config.recountSidebar.name].add([
			{ id: elemTaxation.uid, text: elemTaxation.name, icon: 'fa fa-tree',count: elemTaxation.areacutting+' га', ref:elemTaxation}
		]);
		for (var j = 0; j < elemTaxation.arrayBreedTaxation.length; j++) {
			var elemBreed = elemTaxation.arrayBreedTaxation[j];
			w2ui[RECOUNTLAYOUT.config.recountSidebar.name].insert(elemTaxation.uid, null, [
				{ id: elemBreed.uid, text: elemBreed.name, icon: '', count: 'разряд высот: '+elemBreed.rank,ref:elemBreed}
			])
			if(i == 0 && j == 0){
				w2ui[RECOUNTLAYOUT.config.recountSidebar.name].select(elemBreed.uid);
				fillOptionsForGrid(elemBreed);
			}
			w2ui[RECOUNTLAYOUT.config.recountSidebar.name].expand(elemTaxation.uid);
		}
	}

	
	var html = '<div style=\'padding: 10px\'>Для начала добавьте объект таксации.</div>';
	$('#addObjectTaxation').w2overlay(html);

}


RECOUNTLAYOUT.fillbreeds = function () {
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
			RECOUNTLAYOUT.breeds.push(row);
		}
	}
	RECOUNTLAYOUT.breeds.splice(0,RECOUNTLAYOUT.breeds.length);
	asyncProcess(breed);
}

RECOUNTLAYOUT.filltypescoefficients = function () {
	let data 	= store.getState().enumerations.typesCoefficients;	
	RECOUNTLAYOUT.typescoefficients.splice(0,RECOUNTLAYOUT.typescoefficients.length);
	RECOUNTLAYOUT.typescoefficients.push(...data);
}

RECOUNTLAYOUT.beforeOpening = function () {

    RECOUNTLAYOUT.fillbreeds();
	RECOUNTLAYOUT.filltypescoefficients();

    this.whenOpening();
	
}

RECOUNTLAYOUT.whenOpening = function () {
	
	if (w2ui.hasOwnProperty(this.config.recountLayout.name)){
		w2ui[this.config.recountLayout.name].destroy();
	} 
	$('#content').w2layout(this.config.recountLayout);
	
	if (w2ui.hasOwnProperty(this.config.toptoolbar.name)){
		w2ui[this.config.toptoolbar.name].destroy();
	} 
	$('#toptoolbar').w2toolbar(this.config.toptoolbar);	
	
	
	if (w2ui.hasOwnProperty(this.config.recountSidebar.name)){
		w2ui[this.config.recountSidebar.name].destroy();
	} 
	$('#recountSidebar').w2sidebar(this.config.recountSidebar);	
	
	
	if (w2ui.hasOwnProperty(this.config.recountGrid.name)){
		w2ui[this.config.recountGrid.name].destroy();
	} 
	$('#recountGrid').w2grid(this.config.recountGrid);
	
	
	w2ui.recountLayout.content('right', '<style>.tabP {border: 0px;width: 100%;height: 100%;overflow: hidden;}'+
								'.tabF {border: 0px;width: 100%;height: 100%;overflow: hidden;}</style>'+
								'<div id="PARAMETERS">'+
								'<div id="tabsPARAMETERS" style="width: 100%;"></div>'+
								'<div id="cutting" class="tabP"><div id="formCutting" class="tabF"></div></div>'+
								'<div id="location" class="tabP"><div id="locationForm"class="tabF" ></div></div>'+
								'</div>');
	PARAMETERS.init(MDO.objectMDO);
	
	RECOUNTLAYOUT.fillObjects();

}

RECOUNTLAYOUT.init = function () {
	RECOUNTLAYOUT.beforeOpening();
}