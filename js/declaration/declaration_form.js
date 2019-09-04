import {BD} from "../dao";
import {ENUMERATIONS} from "../enumerations";
import * as DECLARATION from "./declaration";
import * as declaration_export from "./declaration_export";
import {PROTECTIONCATEGORY} from "../protectioncategory";
import {FORESTRY} from "../forestry";
import {SUBFORESTRY} from "../subforestry";
import {TRACT} from "../tract";
import {CUTTINGMETHODS} from "../cuttingmethods";
import {BREEDS} from "../breeds";
import {ACTIONUSAGEKIND} from "../actionusagekind";
import {USAGEKIND} from "../usageKind";
import {RESOURCEKIND} from "../resourcekind";

var DECLARATION_style = 'border: 1px solid #dfdfdf; padding: 3px; overflow: hidden;border-radius: 3px;';

var protectioncategory = [];
var forestry = [];
var subforestry = [];
var tract = [];
var cuttingmethods = [];
var breeds = [];
var actionUsageKind = [];
var usagekind = [];
var resourceKind = [];

export var DECLARATION_FORM = {

	declarationLayout: {
		name: 'declarationLayout',
		padding: 2,
		panels: [
			{ type: 'top', size: 40, style: DECLARATION_style, content:
				'<div id="toptoolbar" style="padding: 4px; background-color: rgba(250,250,250,0); "></div>' },
			{ type: 'main', resizable: true, style: DECLARATION_style, content: '<div id="declarationTabs" style="width: 100%; height: 100%;"></div>' },
			]
	},

	toptoolbar: {
		name: 'toptoolbar',
		items: [
			{ id: 'saveXML', type: 'button', caption: 'Сохранить в XML', icon: 'fa fa-file-code-o' },
		],
		onClick: function (event) {
			if (event.target == 'saveXML') {
				var models = {
					protectioncategory: protectioncategory,
					forestry: forestry,
					subforestry: subforestry,
					tract: tract,
					cuttingmethods: cuttingmethods,
					breeds: breeds,
					actionUsageKind:actionUsageKind,
					usagekind:usagekind,
					resourceKind:resourceKind,
				}
				declaration_export.saveXML(DECLARATION.objectDECLARATION,models,DECLARATION_FORM.alert)
			}
		}
	},

	tabsDECLARATION: {
		name: 'tabsDECLARATION',
		active: 'declarationHeader',
		tabs: [
			{ id: 'declarationHeader',caption: 'Общая информация' },
			{ id: 'wood_harvesting', caption: 'Заготовка древесины' },
			{ id: 'wood_harvesting_Infrastructure', caption: 'Лесная инфраструктура' },
			{ id: 'non_wood_harvesting_volumes', caption: 'Прочие виды использования' },
			{ id: 'non_wood_harvesting_infrastructure', caption: 'Не лесная инфраструктура' },
			{ id: 'files', caption: 'Файлы (схемы лесосек и объектов)' },
		],
		onClick: function (event) {
			$('#DECLARATION .tabP').hide();
			$('#DECLARATION #' + event.target).show();
			if(event.target == 'wood_harvesting'){
				w2ui[DECLARATION_FORM.wood_harvesting.name].refresh();
			}
			if(event.target == 'wood_harvesting_Infrastructure'){
				w2ui[DECLARATION_FORM.wood_harvesting_Infrastructure.name].refresh();
			}
			if(event.target == 'non_wood_harvesting_volumes'){
				w2ui[DECLARATION_FORM.non_wood_harvesting_volumes.name].refresh();
			}
			if(event.target == 'non_wood_harvesting_infrastructure'){
				w2ui[DECLARATION_FORM.non_wood_harvesting_infrastructure.name].refresh();
			}
			if(event.target == 'declarationHeader'){
				w2ui[DECLARATION_FORM.declarationHeader.name].refresh();
			}
		}
	},

	files_form:{
		container:"files",
		view:"form", rows: [
			{
				view: "uploader", id:"upl1",
				autosend:false, value: 'Добавить файлы',
				link:"mylist",
			},
			{
				view:"list",  id:"mylist", type:"uploader",
				autoheight:true, borderless:true
			},
		]
	},


	declarationHeader: {
		name   : 'declarationHeader',
		style: 'border: 0px;',
		focus  : -1,
		fields : [
			{ field: 'number', type: 'text', html: { caption: 'Номер лесной декларации:', span: '9', attr: 'style="width: 300px"'}, required: true },
			{ field: 'date', type: 'date', options :{ format: 'yyyy-mm-dd' }, html: { caption: 'Дата лесной декларации:', span: '9', attr: 'style="width: 100px"'},required: true  },
			{ field: 'begin', type: 'date', options :{ format: 'yyyy-mm-dd' }, html: { caption: 'Дата начала использования:', span: '9', attr: 'style="width: 100px"'},required: true  },
			{ field: 'end', type: 'date', options :{ format: 'yyyy-mm-dd' }, html: { caption: 'Дата окончания использования:', span: '9', attr: 'style="width: 100px"'},required: true  },
			{ field: 'forestry', type: 'list', options :{items: forestry}, html: { caption: 'Лесничество:', span: '9', attr: 'style="width: 300px"'}, required: true },
			{ field: 'docNumber', type: 'text', html: { caption: 'Номер договора:', span: '9', attr: 'style="width: 300px"'}, required: true },
			{ field: 'docDate', type: 'date', options :{ format: 'yyyy-mm-dd' }, html: { caption: 'Дата договора:', span: '9', attr: 'style="width: 100px"'},required: true  },
			{ field: 'docRegistration_number', type: 'text', html: { caption: 'Номер гос. регистрации:', span: '9', attr: 'style="width: 300px"'}},
			{ field: 'accept_organization', type: 'text', html: { caption: 'Орган утв. экспертизу ПОЛ:', span: '9', attr: 'style="width: 300px"'}, required: true },
			{ field: 'accept_date', type: 'date', options :{ format: 'yyyy-mm-dd' }, html: { caption: 'Дата экспертизы ПОЛ:', span: '9', attr: 'style="width: 100px"'},required: true  },
		],
		onChange: function (event) {
			DECLARATION.objectDECLARATION.header[event.target] = event.value_new;
		}
	},
	
	wood_harvesting:{
		name: 'wood_harvesting',
		show: {
			header: false,
			toolbar: true,
			footer: true,
			toolbarSearch: false,
			lineNumbers: true

		},
		toolbar: {
			items: [
				{ id: 'add', type: 'button', caption: 'Добавить', icon: 'w2ui-icon-plus' },
				{ id: 'copy', type: 'button', caption: 'Копировать', icon: 'fa fa-files-o' },
				{ id: 'delete', type: 'button', caption: 'Удалить', icon: 'w2ui-icon-cross' }
			],

			onClick: function (event) {
				if (event.target == 'add') {
					var options = {};
					var woodHarvesting = new DECLARATION.ClassArrayWoodHarvesting(options);
					DECLARATION.objectDECLARATION.add(DECLARATION.objectDECLARATION.arrayWoodHarvesting,woodHarvesting);
					w2ui[DECLARATION_FORM.wood_harvesting.name].add(woodHarvesting);
				}
				if (event.target == 'copy') {
					w2ui[DECLARATION_FORM.wood_harvesting.name].save();
					var selection 	= w2ui[DECLARATION_FORM.wood_harvesting.name].getSelection();
					if(selection.length == 0)return;
					var record 		= w2ui[DECLARATION_FORM.wood_harvesting.name].get(selection[0]);
					var woodHarvesting = new DECLARATION.ClassArrayWoodHarvesting(record);
					DECLARATION.objectDECLARATION.add(DECLARATION.objectDECLARATION.arrayWoodHarvesting,woodHarvesting);
					w2ui[DECLARATION_FORM.wood_harvesting.name].add(woodHarvesting);
				}
				if (event.target == 'delete') {
					w2confirm('Удалить выбранные строки?', function (btn) {
						if (btn == 'Yes') {
							var selection = w2ui[DECLARATION_FORM.wood_harvesting.name].getSelection();
							for (var i = 0; i < selection.length; i++) {
								var record 	= w2ui[DECLARATION_FORM.wood_harvesting.name].get(selection[i]);
								DECLARATION.objectDECLARATION.delete(DECLARATION.objectDECLARATION.arrayWoodHarvesting,record);
							}
							w2ui[DECLARATION_FORM.wood_harvesting.name].select(selection);
							w2ui[DECLARATION_FORM.wood_harvesting.name].delete(true);
						}
					})
				}
			}
		},

		onDblClick: function (event) {
			var field = w2ui[this.name].columns[event.column].field;
			if (field == 'protectioncategory' ) {
				var record = w2ui[this.name].get(event.recid);
				if(record.purposeForests != "2"){
					event.preventDefault();
					return;
				}
			}
			if (field == 'subforestry' ) {
				var filter = DECLARATION.objectDECLARATION.header.forestry.id;
				var newList = [];
				for (var i = 0; i < subforestry.length; i++) {
					if (subforestry[i].forestry_id == filter) {
						newList.push(subforestry[i]);
					}
				}
				w2ui[this.name].columns[event.column].editable.items = newList;
			}
			if (field == 'tract' ) {
				var record = w2ui[this.name].get(event.recid);
				var filter = record.subforestry;
				var newList = [];
				for (var i = 0; i < tract.length; i++) {
					if (tract[i].subforestry_id == filter) {
						newList.push(tract[i]);
					}
				}
				w2ui[this.name].columns[event.column].editable.items = newList;
			}
			if (field == 'cuttingmethods' ) {
				var record = w2ui[this.name].get(event.recid);
				var filter = record.formCutting;
				var newList = [];
				for (var i = 0; i < cuttingmethods.length; i++) {
					if (cuttingmethods[i].formCutting == filter) {
						newList.push(cuttingmethods[i]);
					}
				}
				w2ui[this.name].columns[event.column].editable.items = newList;
			}
		},

		columns: [
			{ field: 'recid', sortable: false, hidden:true},
			{
				field: 'purposeForests', caption: 'Целевое<br>назначение лесов', size: '10%',
				editable: { type: 'select', items: ENUMERATIONS.purposeForests, showAll: true },
				render: function (record, index, col_index) {
					var html = '';
					for (var p in ENUMERATIONS.purposeForests) {
						if (ENUMERATIONS.purposeForests[p].id == this.getCellValue(index, col_index)) html = ENUMERATIONS.purposeForests[p].text;
					}
					return html;
				}
			},
			{
				field: 'protectioncategory', caption: 'Категория <br>защитных лесов', size: '10%',
				editable: { type: 'select', items: protectioncategory, showAll: true },
				render: function (record, index, col_index) {
					var html = '';
					for (var p in protectioncategory) {
						if (protectioncategory[p].id == this.getCellValue(index, col_index)) html = protectioncategory[p].text;
					}
					return html;
				}
			},
			{
				field: 'subforestry', caption: 'Участковое<br>лесничество', size: '10%',
				editable: { type: 'select', items: subforestry, showAll: true },
				render: function (record, index, col_index) {
					var html = '';
					for (var p in subforestry) {
						if (subforestry[p].id == this.getCellValue(index, col_index)) html = subforestry[p].text;
					}
					return html;
				}
			},
			{
				field: 'tract', caption: 'Урочище', size: '10%',
				editable: { type: 'select', items: tract, showAll: true },
				render: function (record, index, col_index) {
					var html = '';
					for (var p in tract) {
						if (tract[p].id == this.getCellValue(index, col_index)) html = tract[p].text;
					}
					return html;
				}
			},
			{ field: 'quarter', caption: 'Квартал', size: '5%', sortable: false, editable: { type: 'int' },render: 'int',  style: "font-size:small" },
			{ field: 'taxation_unit', caption: 'Выдел', size: '5%', sortable: false, editable: { type: 'int' },render: 'int',  style: "font-size:small" },
			{ field: 'cutting_area', caption: 'Лесосека', size: '5%', sortable: false, editable: { type: 'int' },render: 'int',  style: "font-size:small" },
			{ field: 'square', caption: 'Площадь', size: '5%', sortable: false, editable: { type: 'float' },render: 'float:4',  style: "font-size:small" },
			{
				field: 'formCutting', caption: 'Форма<br>рубки', size: '10%',
				editable: { type: 'select', items: ENUMERATIONS.formCutting, showAll: true },
				render: function (record, index, col_index) {
					var html = '';
					for (var p in ENUMERATIONS.formCutting) {
						if (ENUMERATIONS.formCutting[p].id == this.getCellValue(index, col_index)) html = ENUMERATIONS.formCutting[p].text;
					}
					return html;
				}
			},
			{
				field: 'cuttingmethods', caption: 'Способ<br>рубки', size: '10%',
				editable: { type: 'select', items: cuttingmethods, showAll: true },
				render: function (record, index, col_index) {
					var html = '';
					for (var p in cuttingmethods) {
						if (cuttingmethods[p].id == this.getCellValue(index, col_index)) html = cuttingmethods[p].text;
					}
					return html;
				}
			},
			{
				field: 'property', caption: 'Хозяйство', size: '10%',
				editable: { type: 'select', items: ENUMERATIONS.property, showAll: true },
				render: function (record, index, col_index) {
					var html = '';
					for (var p in ENUMERATIONS.property) {
						if (ENUMERATIONS.property[p].id == this.getCellValue(index, col_index)) html = ENUMERATIONS.property[p].text;
					}
					return html;
				}
			},
			{
				field: 'breed', caption: 'Порода', size: '10%',
				editable: { type: 'select', items: breeds, showAll: true },
				render: function (record, index, col_index) {
					var html = '';
					for (var p in breeds) {
						if (breeds[p].id == this.getCellValue(index, col_index)) html = breeds[p].text;
					}
					return html;
				}
			},
			{
				field: 'unit', caption: 'Ед.изм', size: '10%',
				editable: { type: 'select', items: ENUMERATIONS.unit, showAll: true },
				render: function (record, index, col_index) {
					var html = '';
					for (var p in ENUMERATIONS.unit) {
						if (ENUMERATIONS.unit[p].id == this.getCellValue(index, col_index)) html = ENUMERATIONS.unit[p].text;
					}
					return html;
				}
			},
			{ field: 'value', caption: 'Объем<br>заготовки', size: '5%', sortable: false, editable: { type: 'float' },render: 'float:2',  style: "font-size:small" },

		],

		onChange: function(event) {
			event.onComplete = function () {
				w2ui[DECLARATION_FORM.wood_harvesting.name].save();
				var record 		= w2ui[DECLARATION_FORM.wood_harvesting.name].get(event.recid);
				var column 		= w2ui[DECLARATION_FORM.wood_harvesting.name].getColumn(event.recid);

				if(record.purposeForests != '2'){
					w2ui[DECLARATION_FORM.wood_harvesting.name].set(event.recid, { protectioncategory: '' });
				}

				if(!DECLARATION_FORM.checkNumber(record.quarter,true)){
					w2ui[DECLARATION_FORM.wood_harvesting.name].set(event.recid, { quarter: 0 });
					return
				}
				if(!DECLARATION_FORM.checkNumber(record.taxation_unit,true)){
					w2ui[DECLARATION_FORM.wood_harvesting.name].set(event.recid, { taxation_unit: 0 });
					return
				}
				if(!DECLARATION_FORM.checkNumber(record.cutting_area,true)){
					w2ui[DECLARATION_FORM.wood_harvesting.name].set(event.recid, { cutting_area: 0 });
					return
				}
				if(!DECLARATION_FORM.checkNumber(record.square,true)){
					w2ui[DECLARATION_FORM.wood_harvesting.name].set(event.recid, { square: 0 });
					return
				}

				DECLARATION.objectDECLARATION.edit(DECLARATION.objectDECLARATION.arrayWoodHarvesting,record);

			}

		}
	},

	wood_harvesting_Infrastructure:{
		name: 'wood_harvesting_Infrastructure',
		show: {
			header: false,
			toolbar: true,
			footer: true,
			toolbarSearch: false,
			lineNumbers: true

		},
		toolbar: {
			items: [
				{ id: 'add', type: 'button', caption: 'Добавить', icon: 'w2ui-icon-plus' },
				{ id: 'copy', type: 'button', caption: 'Копировать', icon: 'fa fa-files-o' },
				{ id: 'delete', type: 'button', caption: 'Удалить', icon: 'w2ui-icon-cross' }
			],

			onClick: function (event) {
				if (event.target == 'add') {
					var options = {};
					var woodHarvestingInfrastructure = new DECLARATION.ClassArrayWoodHarvestingInfrastructure(options);
					DECLARATION.objectDECLARATION.add(DECLARATION.objectDECLARATION.arrayWoodHarvestingInfrastructure,woodHarvestingInfrastructure);
					w2ui[DECLARATION_FORM.wood_harvesting_Infrastructure.name].add(woodHarvestingInfrastructure);
				}
				if (event.target == 'copy') {
					w2ui[DECLARATION_FORM.wood_harvesting_Infrastructure.name].save();
					var selection 	= w2ui[DECLARATION_FORM.wood_harvesting_Infrastructure.name].getSelection();
					if(selection.length == 0)return;
					var record 		= w2ui[DECLARATION_FORM.wood_harvesting_Infrastructure.name].get(selection[0]);
					var woodHarvestingInfrastructure = new DECLARATION.ClassArrayWoodHarvestingInfrastructure(record);
					DECLARATION.objectDECLARATION.add(DECLARATION.objectDECLARATION.arrayWoodHarvestingInfrastructure,woodHarvestingInfrastructure);
					w2ui[DECLARATION_FORM.wood_harvesting_Infrastructure.name].add(woodHarvestingInfrastructure);
				}
				if (event.target == 'delete') {
					w2confirm('Удалить выбранные строки?', function (btn) {
						if (btn == 'Yes') {
							var selection = w2ui[DECLARATION_FORM.wood_harvesting_Infrastructure.name].getSelection();
							for (var i = 0; i < selection.length; i++) {
								var record 	= w2ui[DECLARATION_FORM.wood_harvesting_Infrastructure.name].get(selection[i]);
								DECLARATION.objectDECLARATION.delete(DECLARATION.objectDECLARATION.arrayWoodHarvestingInfrastructure,record);
							}
							w2ui[DECLARATION_FORM.wood_harvesting_Infrastructure.name].select(selection);
							w2ui[DECLARATION_FORM.wood_harvesting_Infrastructure.name].delete(true);
						}
					})
				}
			}
		},

		onDblClick: function (event) {
			var field = w2ui[DECLARATION_FORM.wood_harvesting_Infrastructure.name].columns[event.column].field;
			if (field == 'subforestry' ) {
				var filter = DECLARATION.objectDECLARATION.header.forestry.id;
				var newList = [];
				for (var i = 0; i < subforestry.length; i++) {
					if (subforestry[i].forestry_id == filter) {
						newList.push(subforestry[i]);
					}
				}
				w2ui[DECLARATION_FORM.wood_harvesting_Infrastructure.name].columns[event.column].editable.items = newList;
			}
			if (field == 'tract' ) {
				var record = w2ui[DECLARATION_FORM.wood_harvesting_Infrastructure.name].get(event.recid);
				var filter = record.subforestry;
				var newList = [];
				for (var i = 0; i < tract.length; i++) {
					if (tract[i].subforestry_id == filter) {
						newList.push(tract[i]);
					}
				}
				w2ui[DECLARATION_FORM.wood_harvesting_Infrastructure.name].columns[event.column].editable.items = newList;
			}
			if (field == 'cuttingmethods' ) {
				var record = w2ui[DECLARATION_FORM.wood_harvesting_Infrastructure.name].get(event.recid);
				var filter = record.formCutting;
				var newList = [];
				for (var i = 0; i < cuttingmethods.length; i++) {
					if (cuttingmethods[i].formCutting == filter) {
						newList.push(cuttingmethods[i]);
					}
				}
				w2ui[DECLARATION_FORM.wood_harvesting_Infrastructure.name].columns[event.column].editable.items = newList;
			}
		},

		columns: [
			{ field: 'recid', sortable: false, hidden:true},
			{ field: 'infrastructureName', caption: 'Наименование<br>объекта', size: '10%', sortable: false, editable: { type: 'text' }, style: "font-size:small" },
			{ field: 'infrastructureID', caption: 'Номер<br>объекта', size: '10%', sortable: false, editable: { type: 'text' }, style: "font-size:small" },
			{
				field: 'actionUsageKind', caption: 'Строительство<br>и прочие мероприятия', size: '10%',
				editable: { type: 'select', items: actionUsageKind, showAll: true },
				render: function (record, index, col_index) {
					var html = '';
					for (var p in actionUsageKind) {
						if (actionUsageKind[p].id == this.getCellValue(index, col_index)) html = actionUsageKind[p].text;
					}
					return html;
				}
			},
			{
				field: 'subforestry', caption: 'Участковое<br>лесничество', size: '10%',
				editable: { type: 'select', items: subforestry, showAll: true },
				render: function (record, index, col_index) {
					var html = '';
					for (var p in subforestry) {
						if (subforestry[p].id == this.getCellValue(index, col_index)) html = subforestry[p].text;
					}
					return html;
				}
			},
			{
				field: 'tract', caption: 'Урочище', size: '10%',
				editable: { type: 'select', items: tract, showAll: true },
				render: function (record, index, col_index) {
					var html = '';
					for (var p in tract) {
						if (tract[p].id == this.getCellValue(index, col_index)) html = tract[p].text;
					}
					return html;
				}
			},
			{ field: 'quarter', caption: 'Квартал', size: '5%', sortable: false, editable: { type: 'int' },render: 'int',  style: "font-size:small" },
			{ field: 'taxation_range', caption: 'Выдел (а)', size: '5%', sortable: false, editable: { type: 'text' }, style: "font-size:small" },
			{ field: 'square', caption: 'Площадь', size: '5%', sortable: false, editable: { type: 'float' },render: 'float:4',  style: "font-size:small" },
			{
				field: 'formCutting', caption: 'Форма<br>рубки', size: '10%',
				editable: { type: 'select', items: ENUMERATIONS.formCutting, showAll: true },
				render: function (record, index, col_index) {
					var html = '';
					for (var p in ENUMERATIONS.formCutting) {
						if (ENUMERATIONS.formCutting[p].id == this.getCellValue(index, col_index)) html = ENUMERATIONS.formCutting[p].text;
					}
					return html;
				}
			},
			{
				field: 'cuttingmethods', caption: 'Способ<br>рубки', size: '10%',
				editable: { type: 'select', items: cuttingmethods, showAll: true },
				render: function (record, index, col_index) {
					var html = '';
					for (var p in cuttingmethods) {
						if (cuttingmethods[p].id == this.getCellValue(index, col_index)) html = cuttingmethods[p].text;
					}
					return html;
				}
			},
			{
				field: 'property', caption: 'Хозяйство', size: '10%',
				editable: { type: 'select', items: ENUMERATIONS.property, showAll: true },
				render: function (record, index, col_index) {
					var html = '';
					for (var p in ENUMERATIONS.property) {
						if (ENUMERATIONS.property[p].id == this.getCellValue(index, col_index)) html = ENUMERATIONS.property[p].text;
					}
					return html;
				}
			},
			{
				field: 'breed', caption: 'Порода', size: '10%',
				editable: { type: 'select', items: breeds, showAll: true },
				render: function (record, index, col_index) {
					var html = '';
					for (var p in breeds) {
						if (breeds[p].id == this.getCellValue(index, col_index)) html = breeds[p].text;
					}
					return html;
				}
			},
			{
				field: 'unit', caption: 'Ед.изм', size: '5%',
				editable: { type: 'select', items: ENUMERATIONS.unit, showAll: true },
				render: function (record, index, col_index) {
					var html = '';
					for (var p in ENUMERATIONS.unit) {
						if (ENUMERATIONS.unit[p].id == this.getCellValue(index, col_index)) html = ENUMERATIONS.unit[p].text;
					}
					return html;
				}
			},

			{ field: 'value', caption: 'Объем<br>заготовки', size: '5%', sortable: false, editable: { type: 'float' },render: 'float:2',  style: "font-size:small" },

		],

		onChange: function(event) {
			event.onComplete = function () {
				w2ui[DECLARATION_FORM.wood_harvesting_Infrastructure.name].save();
				var record 		= w2ui[DECLARATION_FORM.wood_harvesting_Infrastructure.name].get(event.recid);

				if(!DECLARATION_FORM.checkNumber(record.quarter,true)){
					w2ui[DECLARATION_FORM.wood_harvesting_Infrastructure.name].set(event.recid, { quarter: 0 });
					return
				}
				if(!DECLARATION_FORM.checkNumber(record.cutting_area,true)){
					w2ui[DECLARATION_FORM.wood_harvesting_Infrastructure.name].set(event.recid, { cutting_area: 0 });
					return
				}
				if(!DECLARATION_FORM.checkNumber(record.square,true)){
					w2ui[DECLARATION_FORM.wood_harvesting_Infrastructure.name].set(event.recid, { square: 0 });
					return
				}

				DECLARATION.objectDECLARATION.edit(DECLARATION.objectDECLARATION.arrayWoodHarvestingInfrastructure,record);
			}

		}
	},

	non_wood_harvesting_volumes:{
		name: 'non_wood_harvesting_volumes',
		show: {
			header: false,
			toolbar: true,
			footer: true,
			toolbarSearch: false,
			lineNumbers: true

		},
		toolbar: {
			items: [
				{ id: 'add', type: 'button', caption: 'Добавить', icon: 'w2ui-icon-plus' },
				{ id: 'copy', type: 'button', caption: 'Копировать', icon: 'fa fa-files-o' },
				{ id: 'delete', type: 'button', caption: 'Удалить', icon: 'w2ui-icon-cross' }
			],

			onClick: function (event) {
				if (event.target == 'add') {
					var options = {};
					var NonWoodHarvesting = new DECLARATION.ClassArrayNonWoodHarvesting(options);
					DECLARATION.objectDECLARATION.add(DECLARATION.objectDECLARATION.arrayNonWoodHarvesting,NonWoodHarvesting);
					w2ui[DECLARATION_FORM.non_wood_harvesting_volumes.name].add(NonWoodHarvesting);
				}
				if (event.target == 'copy') {
					w2ui[DECLARATION_FORM.non_wood_harvesting_volumes.name].save();
					var selection 	= w2ui[DECLARATION_FORM.non_wood_harvesting_volumes.name].getSelection();
					if(selection.length == 0)return;
					var record 		= w2ui[DECLARATION_FORM.non_wood_harvesting_volumes.name].get(selection[0]);
					var NonWoodHarvesting = new DECLARATION.ClassArrayNonWoodHarvesting(record);
					DECLARATION.objectDECLARATION.add(DECLARATION.objectDECLARATION.arrayNonWoodHarvesting,NonWoodHarvesting);
					w2ui[DECLARATION_FORM.non_wood_harvesting_volumes.name].add(NonWoodHarvesting);
				}
				if (event.target == 'delete') {
					w2confirm('Удалить выбранные строки?', function (btn) {
						if (btn == 'Yes') {
							var selection = w2ui[DECLARATION_FORM.non_wood_harvesting_volumes.name].getSelection();
							for (var i = 0; i < selection.length; i++) {
								var record 	= w2ui[DECLARATION_FORM.non_wood_harvesting_volumes.name].get(selection[i]);
								DECLARATION.objectDECLARATION.delete(DECLARATION.objectDECLARATION.arrayNonWoodHarvesting,record);
							}
							w2ui[DECLARATION_FORM.non_wood_harvesting_volumes.name].select(selection);
							w2ui[DECLARATION_FORM.non_wood_harvesting_volumes.name].delete(true);
						}
					})
				}
			}
		},

		onDblClick: function (event) {
			var field = w2ui[DECLARATION_FORM.non_wood_harvesting_volumes.name].columns[event.column].field;
			if (field == 'protectioncategory' ) {
				var record = w2ui[DECLARATION_FORM.non_wood_harvesting_volumes.name].get(event.recid);
				if(record.purposeForests != "2"){
					event.preventDefault();
					return;
				}
			}
			if (field == 'subforestry' ) {
				var filter = DECLARATION.objectDECLARATION.header.forestry.id;
				var newList = [];
				for (var i = 0; i < subforestry.length; i++) {
					if (subforestry[i].forestry_id == filter) {
						newList.push(subforestry[i]);
					}
				}
				w2ui[DECLARATION_FORM.non_wood_harvesting_volumes.name].columns[event.column].editable.items = newList;
			}
			if (field == 'tract' ) {
				var record = w2ui[DECLARATION_FORM.non_wood_harvesting_volumes.name].get(event.recid);
				var filter = record.subforestry;
				var newList = [];
				for (var i = 0; i < tract.length; i++) {
					if (tract[i].subforestry_id == filter) {
						newList.push(tract[i]);
					}
				}
				w2ui[DECLARATION_FORM.non_wood_harvesting_volumes.name].columns[event.column].editable.items = newList;
			}
			if (field == 'cuttingmethods' ) {
				var record = w2ui[DECLARATION_FORM.non_wood_harvesting_volumes.name].get(event.recid);
				var filter = record.formCutting;
				var newList = [];
				for (var i = 0; i < cuttingmethods.length; i++) {
					if (cuttingmethods[i].formCutting == filter) {
						newList.push(cuttingmethods[i]);
					}
				}
				w2ui[DECLARATION_FORM.non_wood_harvesting_volumes.name].columns[event.column].editable.items = newList;
			}
			if (field == 'resourceKind' ) {
				var record = w2ui[DECLARATION_FORM.non_wood_harvesting_volumes.name].get(event.recid);
				var filter = record.usagekind;
				var newList = [];
				for (var i = 0; i < resourceKind.length; i++) {
					if (resourceKind[i].usagekind_id == filter) {
						newList.push(resourceKind[i]);
					}
				}
				w2ui[DECLARATION_FORM.non_wood_harvesting_volumes.name].columns[event.column].editable.items = newList;
			}

		},

		columns: [
			{ field: 'recid', sortable: false, hidden:true},
			{
				field: 'usagekind', caption: 'Вид использования<br>лесов', size: '10%',
				editable: { type: 'select', items: usagekind, showAll: true },
				render: function (record, index, col_index) {
					var html = '';
					for (var p in usagekind) {
							if (usagekind[p].id == this.getCellValue(index, col_index)) html = usagekind[p].text;
					}
					return html;
				}
			},
			{
				field: 'purposeForests', caption: 'Целевое<br>назначение лесов', size: '10%',
				editable: { type: 'select', items: ENUMERATIONS.purposeForests, showAll: true },
				render: function (record, index, col_index) {
					var html = '';
					for (var p in ENUMERATIONS.purposeForests) {
						if (ENUMERATIONS.purposeForests[p].id == this.getCellValue(index, col_index)) html = ENUMERATIONS.purposeForests[p].text;
					}
					return html;
				}
			},
			{
				field: 'protectioncategory', caption: 'Категория <br>защитных лесов', size: '10%',
				editable: { type: 'select', items: protectioncategory, showAll: true },
				render: function (record, index, col_index) {
					var html = '';
					for (var p in protectioncategory) {
						if (protectioncategory[p].id == this.getCellValue(index, col_index)) html = protectioncategory[p].text;
					}
					return html;
				}
			},
			{
				field: 'subforestry', caption: 'Участковое<br>лесничество', size: '10%',
				editable: { type: 'select', items: subforestry, showAll: true },
				render: function (record, index, col_index) {
					var html = '';
					for (var p in subforestry) {
						if (subforestry[p].id == this.getCellValue(index, col_index)) html = subforestry[p].text;
					}
					return html;
				}
			},
			{
				field: 'tract', caption: 'Урочище', size: '10%',
				editable: { type: 'select', items: tract, showAll: true },
				render: function (record, index, col_index) {
					var html = '';
					for (var p in tract) {
						if (tract[p].id == this.getCellValue(index, col_index)) html = tract[p].text;
					}
					return html;
				}
			},
			{ field: 'quarter', caption: 'Квартал', size: '5%', sortable: false, editable: { type: 'int' },render: 'int',  style: "font-size:small" },
			{ field: 'taxation_range', caption: 'Выдел (а)', size: '5%', sortable: false, editable: { type: 'text' }, style: "font-size:small" },
			{ field: 'square', caption: 'Площадь', size: '5%', sortable: false, editable: { type: 'float' },render: 'float:4',  style: "font-size:small" },
			{
				field: 'resourceKind', caption: 'Вид заготовляемого<br>ресурса', size: '10%',
				editable: { type: 'select', items: resourceKind, showAll: true },
				render: function (record, index, col_index) {
					var html = '';
					for (var p in resourceKind) {
						if (resourceKind[p].id == this.getCellValue(index, col_index)) html = resourceKind[p].text;
					}
					return html;
				}
			},
			{
				field: 'unit', caption: 'Ед.изм', size: '5%',
				editable: { type: 'select', items: ENUMERATIONS.unit, showAll: true },
				render: function (record, index, col_index) {
					var html = '';
					for (var p in ENUMERATIONS.unit) {
						if (ENUMERATIONS.unit[p].id == this.getCellValue(index, col_index)) html = ENUMERATIONS.unit[p].text;
					}
					return html;
				}
			},
			{ field: 'value', caption: 'Объем<br>изъятия', size: '5%', sortable: false, editable: { type: 'float' },render: 'float:2',  style: "font-size:small" },
			{
				field: 'formCutting', caption: 'Форма<br>рубки', size: '10%',
				editable: { type: 'select', items: ENUMERATIONS.formCutting, showAll: true },
				render: function (record, index, col_index) {
					var html = '';
					for (var p in ENUMERATIONS.formCutting) {
						if (ENUMERATIONS.formCutting[p].id == this.getCellValue(index, col_index)) html = ENUMERATIONS.formCutting[p].text;
					}
					return html;
				}
			},
			{
				field: 'cuttingmethods', caption: 'Способ<br>рубки', size: '10%',
				editable: { type: 'select', items: cuttingmethods, showAll: true },
				render: function (record, index, col_index) {
					var html = '';
					for (var p in cuttingmethods) {
						if (cuttingmethods[p].id == this.getCellValue(index, col_index)) html = cuttingmethods[p].text;
					}
					return html;
				}
			},
			{
				field: 'breed', caption: 'Порода', size: '10%',
				editable: { type: 'select', items: breeds, showAll: true },
				render: function (record, index, col_index) {
					var html = '';
					for (var p in breeds) {
						if (breeds[p].id == this.getCellValue(index, col_index)) html = breeds[p].text;
					}
					return html;
				}
			},
			{ field: 'сuttingvalue', caption: 'Объем<br>древесины', size: '5%', sortable: false, editable: { type: 'float' },render: 'float:2',  style: "font-size:small" },

		],

		onChange: function(event) {
			event.onComplete = function () {
				w2ui[DECLARATION_FORM.non_wood_harvesting_volumes.name].save();
				var record 		= w2ui[DECLARATION_FORM.non_wood_harvesting_volumes.name].get(event.recid);

				if(record.purposeForests != '2'){
					w2ui[DECLARATION_FORM.non_wood_harvesting_volumes.name].set(event.recid, { protectioncategory: '' });
				}

				if(!DECLARATION_FORM.checkNumber(record.quarter,true)){
					w2ui[DECLARATION_FORM.non_wood_harvesting_volumes.name].set(event.recid, { quarter: 0 });
					return
				}
				if(!DECLARATION_FORM.checkNumber(record.cutting_area,true)){
					w2ui[DECLARATION_FORM.non_wood_harvesting_volumes.name].set(event.recid, { cutting_area: 0 });
					return
				}
				if(!DECLARATION_FORM.checkNumber(record.square,true)){
					w2ui[DECLARATION_FORM.non_wood_harvesting_volumes.name].set(event.recid, { square: 0 });
					return
				}

				DECLARATION.objectDECLARATION.edit(DECLARATION.objectDECLARATION.arrayNonWoodHarvesting,record);
			}

		}
	},

	non_wood_harvesting_infrastructure:{
		name: 'non_wood_harvesting_infrastructure',
		show: {
			header: false,
			toolbar: true,
			footer: true,
			toolbarSearch: false,
			lineNumbers: true

		},
		toolbar: {
			items: [
				{ id: 'add', type: 'button', caption: 'Добавить', icon: 'w2ui-icon-plus' },
				{ id: 'copy', type: 'button', caption: 'Копировать', icon: 'fa fa-files-o' },
				{ id: 'delete', type: 'button', caption: 'Удалить', icon: 'w2ui-icon-cross' }
			],

			onClick: function (event) {
				if (event.target == 'add') {
					var options = {};
					var woodHarvestingInfrastructure = new DECLARATION.ClassArrayNonWoodHarvestingInfrastructure(options);
					DECLARATION.objectDECLARATION.add(DECLARATION.objectDECLARATION.arrayNonWoodHarvestingInfrastructure,woodHarvestingInfrastructure);
					w2ui[DECLARATION_FORM.non_wood_harvesting_infrastructure.name].add(woodHarvestingInfrastructure);
				}
				if (event.target == 'copy') {
					w2ui[DECLARATION_FORM.non_wood_harvesting_infrastructure.name].save();
					var selection 	= w2ui[DECLARATION_FORM.non_wood_harvesting_infrastructure.name].getSelection();
					if(selection.length == 0)return;
					var record 		= w2ui[DECLARATION_FORM.non_wood_harvesting_infrastructure.name].get(selection[0]);
					var NonWoodHarvestingInfrastructure = new DECLARATION.ClassArrayNonWoodHarvestingInfrastructure(record);
					DECLARATION.objectDECLARATION.add(DECLARATION.objectDECLARATION.arrayNonWoodHarvestingInfrastructure,NonWoodHarvestingInfrastructure);
					w2ui[DECLARATION_FORM.non_wood_harvesting_infrastructure.name].add(woodHarvestingInfrastructure);
				}
				if (event.target == 'delete') {
					w2confirm('Удалить выбранные строки?', function (btn) {
						if (btn == 'Yes') {
							var selection = w2ui[DECLARATION_FORM.non_wood_harvesting_infrastructure.name].getSelection();
							for (var i = 0; i < selection.length; i++) {
								var record 	= w2ui[DECLARATION_FORM.non_wood_harvesting_infrastructure.name].get(selection[i]);
								DECLARATION.objectDECLARATION.delete(DECLARATION.objectDECLARATION.arrayNonWoodHarvestingInfrastructure,record);
							}
							w2ui[DECLARATION_FORM.non_wood_harvesting_infrastructure.name].select(selection);
							w2ui[DECLARATION_FORM.non_wood_harvesting_infrastructure.name].delete(true);
						}
					})
				}
			}
		},

		onDblClick: function (event) {
			var field = w2ui[DECLARATION_FORM.non_wood_harvesting_infrastructure.name].columns[event.column].field;
			if (field == 'subforestry' ) {
				var filter = DECLARATION.objectDECLARATION.header.forestry.id;
				var newList = [];
				for (var i = 0; i < subforestry.length; i++) {
					if (subforestry[i].forestry_id == filter) {
						newList.push(subforestry[i]);
					}
				}
				w2ui[DECLARATION_FORM.non_wood_harvesting_infrastructure.name].columns[event.column].editable.items = newList;
			}
			if (field == 'tract' ) {
				var record = w2ui[DECLARATION_FORM.non_wood_harvesting_infrastructure.name].get(event.recid);
				var filter = record.subforestry;
				var newList = [];
				for (var i = 0; i < tract.length; i++) {
					if (tract[i].subforestry_id == filter) {
						newList.push(tract[i]);
					}
				}
				w2ui[DECLARATION_FORM.non_wood_harvesting_infrastructure.name].columns[event.column].editable.items = newList;
			}
			if (field == 'cuttingmethods' ) {
				var record = w2ui[DECLARATION_FORM.non_wood_harvesting_infrastructure.name].get(event.recid);
				var filter = record.formCutting;
				var newList = [];
				for (var i = 0; i < cuttingmethods.length; i++) {
					if (cuttingmethods[i].formCutting == filter) {
						newList.push(cuttingmethods[i]);
					}
				}
				w2ui[DECLARATION_FORM.non_wood_harvesting_infrastructure.name].columns[event.column].editable.items = newList;
			}
		},

		columns: [
			{ field: 'recid', sortable: false, hidden:true},
			{ field: 'infrastructureName', caption: 'Наименование<br>объекта', size: '10%', sortable: false, editable: { type: 'text' }, style: "font-size:small" },
			{ field: 'infrastructureID', caption: 'Номер<br>объекта', size: '10%', sortable: false, editable: { type: 'text' }, style: "font-size:small" },
			{
				field: 'actionUsageKind', caption: 'Строительство<br>и прочие мероприятия', size: '10%',
				editable: { type: 'select', items: actionUsageKind, showAll: true },
				render: function (record, index, col_index) {
					var html = '';
					for (var p in actionUsageKind) {
						if (actionUsageKind[p].id == this.getCellValue(index, col_index)) html = actionUsageKind[p].text;
					}
					return html;
				}
			},
			{
				field: 'subforestry', caption: 'Участковое<br>лесничество', size: '10%',
				editable: { type: 'select', items: subforestry, showAll: true },
				render: function (record, index, col_index) {
					var html = '';
					for (var p in subforestry) {
						if (subforestry[p].id == this.getCellValue(index, col_index)) html = subforestry[p].text;
					}
					return html;
				}
			},
			{
				field: 'tract', caption: 'Урочище', size: '10%',
				editable: { type: 'select', items: tract, showAll: true },
				render: function (record, index, col_index) {
					var html = '';
					for (var p in tract) {
						if (tract[p].id == this.getCellValue(index, col_index)) html = tract[p].text;
					}
					return html;
				}
			},
			{ field: 'quarter', caption: 'Квартал', size: '5%', sortable: false, editable: { type: 'int' },render: 'int',  style: "font-size:small" },
			{ field: 'taxation_range', caption: 'Выдел (а)', size: '5%', sortable: false, editable: { type: 'text' }, style: "font-size:small" },
			{
				field: 'unit', caption: 'Ед.изм', size: '5%',
				editable: { type: 'select', items: ENUMERATIONS.unit, showAll: true },
				render: function (record, index, col_index) {
					var html = '';
					for (var p in ENUMERATIONS.unit) {
						if (ENUMERATIONS.unit[p].id == this.getCellValue(index, col_index)) html = ENUMERATIONS.unit[p].text;
					}
					return html;
				}
			},
			{ field: 'value', caption: 'Объем<br>использования', size: '5%', sortable: false, editable: { type: 'float' },render: 'float:2',  style: "font-size:small" },
			{
				field: 'formCutting', caption: 'Форма<br>рубки', size: '10%',
				editable: { type: 'select', items: ENUMERATIONS.formCutting, showAll: true },
				render: function (record, index, col_index) {
					var html = '';
					for (var p in ENUMERATIONS.formCutting) {
						if (ENUMERATIONS.formCutting[p].id == this.getCellValue(index, col_index)) html = ENUMERATIONS.formCutting[p].text;
					}
					return html;
				}
			},
			{
				field: 'cuttingmethods', caption: 'Способ<br>рубки', size: '10%',
				editable: { type: 'select', items: cuttingmethods, showAll: true },
				render: function (record, index, col_index) {
					var html = '';
					for (var p in cuttingmethods) {
						if (cuttingmethods[p].id == this.getCellValue(index, col_index)) html = cuttingmethods[p].text;
					}
					return html;
				}
			},
			{
				field: 'breed', caption: 'Порода', size: '10%',
				editable: { type: 'select', items: breeds, showAll: true },
				render: function (record, index, col_index) {
					var html = '';
					for (var p in breeds) {
						if (breeds[p].id == this.getCellValue(index, col_index)) html = breeds[p].text;
					}
					return html;
				}
			},
			{ field: 'сuttingvalue', caption: 'Объем<br>древесины', size: '5%', sortable: false, editable: { type: 'float' },render: 'float:2',  style: "font-size:small" },

		],

		onChange: function(event) {
			event.onComplete = function () {
				w2ui[DECLARATION_FORM.non_wood_harvesting_infrastructure.name].save();
				var record 		= w2ui[DECLARATION_FORM.non_wood_harvesting_infrastructure.name].get(event.recid);

				if(!DECLARATION_FORM.checkNumber(record.quarter,true)){
					w2ui[DECLARATION_FORM.non_wood_harvesting_infrastructure.name].set(event.recid, { quarter: 0 });
					return
				}
				if(!DECLARATION_FORM.checkNumber(record.cutting_area,true)){
					w2ui[DECLARATION_FORM.non_wood_harvesting_infrastructure.name].set(event.recid, { cutting_area: 0 });
					return
				}

				DECLARATION.objectDECLARATION.edit(DECLARATION.objectDECLARATION.arrayNonWoodHarvestingInfrastructure,record);
			}

		}
	},

	alert: function (text) {
		window.webix.modalbox({
			title:"Внимание!",
			buttons:["Ок"],
			width:500,
			text:text}
		)
	},

	checkNumber: function (znach,negative) {
		if( znach == 0){
			return true
		}
		if(negative){
			if( znach < 0){
				w2alert('Допускается вводить только положительные числа!');
				return false
			}
		}
		return true
	},

	fillObjects: function () {

		Object.assign(w2ui[this.declarationHeader.name].record, DECLARATION.objectDECLARATION.header);

		for (var i = 0; i < DECLARATION.objectDECLARATION.arrayWoodHarvesting.length; i++) {
			var elemWoodHarvesting = DECLARATION.objectDECLARATION.arrayWoodHarvesting[i];
			w2ui[DECLARATION_FORM.wood_harvesting.name].add(elemWoodHarvesting);
		}

		for (var i = 0; i < DECLARATION.objectDECLARATION.arrayWoodHarvestingInfrastructure.length; i++) {
			var elemWoodHarvestingInfrastructure = DECLARATION.objectDECLARATION.arrayWoodHarvestingInfrastructure[i];
			w2ui[DECLARATION_FORM.wood_harvesting_Infrastructure.name].add(elemWoodHarvestingInfrastructure);
		}
		for (var i = 0; i < DECLARATION.objectDECLARATION.arrayNonWoodHarvesting.length; i++) {
			var elemNonWoodHarvesting = DECLARATION.objectDECLARATION.arrayNonWoodHarvesting[i];
			w2ui[DECLARATION_FORM.non_wood_harvesting_volumes.name].add(elemNonWoodHarvesting);
		}

		for (var i = 0; i < DECLARATION.objectDECLARATION.arrayNonWoodHarvestingInfrastructure.length; i++) {
			var elemNonWoodHarvestingInfrastructure = DECLARATION.objectDECLARATION.arrayNonWoodHarvestingInfrastructure[i];
			w2ui[DECLARATION_FORM.non_wood_harvesting_infrastructure.name].add(elemNonWoodHarvestingInfrastructure);
		}

		//файлы
		var files = [];
		for (var i = 0; i < DECLARATION.objectDECLARATION.files.length; i++) {
			var file = {
				name:DECLARATION.objectDECLARATION.files[i].name,
				id:DECLARATION.objectDECLARATION.files[i].id,
				sizetext:DECLARATION.objectDECLARATION.files[i].sizetext,
			}
			files.push(file);
		}

		$$("upl1").files.parse(files);

	},

	beforeOpening: function () {

		protectioncategory.splice(0, protectioncategory.length);
		forestry.splice(0, forestry.length);
		subforestry.splice(0, subforestry.length);
		tract.splice(0, tract.length);
		breeds.splice(0, breeds.length);
		cuttingmethods.splice(0, cuttingmethods.length);
		actionUsageKind.splice(0, actionUsageKind.length);
		usagekind.splice(0, usagekind.length);
		resourceKind.splice(0, resourceKind.length);
		cuttingmethods.splice(0, cuttingmethods.length);
		BD.fillList(PROTECTIONCATEGORY, protectioncategory, ['recid', 'name','cod', ]);
		BD.fillList(FORESTRY, forestry, ['recid', 'name','cod', ]);
		BD.fillList(SUBFORESTRY, subforestry, ['recid', 'name', 'forestry_id','cod', ]);
		BD.fillList(TRACT, tract, ['recid', 'name', 'subforestry_id','cod', ]);
		BD.fillList(BREEDS, breeds, ['recid', 'name','kodGulf' ]);
		BD.fillList(ACTIONUSAGEKIND, actionUsageKind, ['recid', 'name', 'cod',]);
		BD.fillList(USAGEKIND, usagekind, ['recid', 'name', 'cod',]);
		BD.fillList(RESOURCEKIND, resourceKind, ['recid', 'name', 'usagekind_id','cod', ]);
		
		BD.fillList(CUTTINGMETHODS, cuttingmethods, ['recid', 'name', 'formCutting','idCutting' ],this.whenOpening,DECLARATION_FORM);

	},

	whenOpening: function () {

		if (w2ui.hasOwnProperty(this.declarationLayout.name)){
			w2ui[this.declarationLayout.name].destroy();
		}
		$('#content').w2layout(this.declarationLayout);

		if (w2ui.hasOwnProperty(this.toptoolbar.name)){
			w2ui[this.toptoolbar.name].destroy();
		}
		$('#toptoolbar').w2toolbar(this.toptoolbar);

		w2ui.declarationLayout.content('main', '<style>.tabP {border: 0px;width: 100%;height: 100%;overflow: hidden;}'+
			'.tabF {border: 0px;width: 100%;height: 100%;overflow: hidden;}</style>'+
			'<div id="DECLARATION">'+
			'<div id="tabsDECLARATION" style="width: 100%;"></div>'+
			'<div id="declarationHeader" class="tabP"><div id="declarationHeader_form" class="tabF" style="width: 100%; height: 100%;"></div></div>'+
			'<div id="wood_harvesting" class="tabP"><div id="wood_harvesting_form" style="width: 100%; height: 100%;"></div></div>'+
			'<div id="wood_harvesting_Infrastructure" class="tabP"><div id="wood_harvesting_Infrastructure_form" style="width: 100%; height: 100%;"></div></div>'+
			'<div id="non_wood_harvesting_volumes" class="tabP"><div id="non_wood_harvesting_volumes_form" style="width: 100%; height: 100%;"></div></div>'+
			'<div id="non_wood_harvesting_infrastructure" class="tabP"><div id="non_wood_harvesting_infrastructure_form" style="width: 100%; height: 100%;"></div></div>'+
			//'<div id="files" class="tabP"><div class="w2ui-field w2ui-span9"><label>Прикрепленные файлы:</label><div> <input id="file" style="width: 90%;"></div></div></div>'+
			'<div id="files" class="tabP"></div>'+
			'</div>');

		if (w2ui.hasOwnProperty(this.tabsDECLARATION.name)){
			w2ui[this.tabsDECLARATION.name].destroy();
		}
		$('#tabsDECLARATION').w2tabs(this.tabsDECLARATION);


		if (w2ui.hasOwnProperty(this.declarationHeader.name)){
			w2ui[this.declarationHeader.name].destroy();
		};
		$('#declarationHeader_form').w2form(this.declarationHeader);


		if (w2ui.hasOwnProperty(this.wood_harvesting.name)){
			w2ui[this.wood_harvesting.name].destroy();
		}
		$('#wood_harvesting_form').w2grid(this.wood_harvesting);

		if (w2ui.hasOwnProperty(this.wood_harvesting_Infrastructure.name)){
			w2ui[this.wood_harvesting_Infrastructure.name].destroy();
		}
		$('#wood_harvesting_Infrastructure_form').w2grid(this.wood_harvesting_Infrastructure);

		if (w2ui.hasOwnProperty(this.non_wood_harvesting_volumes.name)){
			w2ui[this.non_wood_harvesting_volumes.name].destroy();
		}
		$('#non_wood_harvesting_volumes_form').w2grid(this.non_wood_harvesting_volumes);


		if (w2ui.hasOwnProperty(this.non_wood_harvesting_infrastructure.name)){
			w2ui[this.non_wood_harvesting_infrastructure.name].destroy();
		}
		$('#non_wood_harvesting_infrastructure_form').w2grid(this.non_wood_harvesting_infrastructure);

		

		//$('#wood_harvesting').hide();
		//$('#wood_harvesting_Infrastructure').hide();
		//$('#header').show();

		window.webix.ui(this.files_form);


		$$("upl1").attachEvent("onAfterFileAdd", function(event){
			var fileReader = window.FileReader ? new FileReader() : null;
			fileReader.addEventListener("loadend", function(e){
				var data = e.target.result.split(',')[1];
				var temp1 = e.target.result.split(',')[0];
				var temp2 = temp1.split(':')[1];
				var mime = temp2.split(';')[0];
				var options = {
					id:event.id,//идентификатор
					name:event.name,//имя файла
					data:data,//base 64
					mime:mime,//base 64
					sizetext:event.sizetext,//описание размера
					size:event.size,//размер в  байтах
					type:event.type,//размер в  байтах
				}
				var objectFiles = new DECLARATION.ClassArrayFiles(options);
				DECLARATION.objectDECLARATION.add(DECLARATION.objectDECLARATION.files,objectFiles);				
			}, false);
			fileReader.readAsDataURL(event.file);
		});


		$$("upl1").files.attachEvent("onBeforeDelete", function(event){
			DECLARATION.objectDECLARATION.deleteFile(event);
		});

		//реализовать заполнение из модели
		this.fillObjects();
	},	

	init: function () {
		this.beforeOpening();
	},

}

