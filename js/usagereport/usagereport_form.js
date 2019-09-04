import {BD} from "../dao";
import {ENUMERATIONS} from "../enumerations";
import * as USAGEREPORT from "./usagereport";
import * as usagereport_export from "./usagereport_export";
import {FORESTRY} from "../forestry";
import {SUBFORESTRY} from "../subforestry";
import {TRACT} from "../tract";
import {CUTTINGMETHODS} from "../cuttingmethods";
import {BREEDS} from "../breeds";
import {ACTIONUSAGEKIND} from "../actionusagekind";
import {USAGEKIND} from "../usageKind";
import {RESOURCEKIND} from "../resourcekind";
import {SORTIMENT} from "../sortiment";

var USAGEREPORT_style = 'border: 1px solid #dfdfdf; padding: 3px; overflow: hidden;border-radius: 3px;';

var forestry = [];
var subforestry = [];
var tract = [];
var cuttingmethods = [];
var breeds = [];
var actionUsageKind = [];
var usagekind = [];
var resourceKind = [];
var sortiments = [];


export var USAGEREPORT_FORM = {

	usagereportLayout: {
		name: 'usagereportLayout',
		padding: 2,
		panels: [
			{ type: 'top', size: 40, style: USAGEREPORT_style, content:
				'<div id="toptoolbar" style="padding: 4px; background-color: rgba(250,250,250,0); "></div>' },
			{ type: 'main', resizable: true, style: USAGEREPORT_style, content: '<div id="usagereportTabs" style="width: 100%; height: 100%;"></div>' },
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
					forestry: forestry,
					subforestry: subforestry,
					tract: tract,
					cuttingmethods: cuttingmethods,
					breeds: breeds,
					actionUsageKind:actionUsageKind,
					usagekind:usagekind,
					resourceKind:resourceKind,
					sortiments:sortiments,
				}
				usagereport_export.saveXML(USAGEREPORT.objectUSAGEREPORT,models,USAGEREPORT_FORM.alert)
			}
		}
	},

	tabsUSAGEREPORT: {
		name: 'tabsUSAGEREPORT',
		active: 'usagereportHeader',
		tabs: [
			{ id: 'usagereportHeader',caption: 'Общая информация' },
			{ id: 'wood_harvesting', caption: 'Заготовка древесины' },
			{ id: 'non_wood_harvesting_volumes', caption: 'Прочие виды использования' },
			{ id: 'events', caption: 'Мероприятия' },
			{ id: 'files', caption: 'Файлы (схемы лесосек и объектов)' },
		],
		onClick: function (event) {
			$('#USAGEREPORT .tabP').hide();
			$('#USAGEREPORT #' + event.target).show();
			if(event.target == 'wood_harvesting'){
				w2ui[USAGEREPORT_FORM.wood_harvesting.name].refresh();
			}
			if(event.target == 'non_wood_harvesting_volumes'){
				w2ui[USAGEREPORT_FORM.non_wood_harvesting_volumes.name].refresh();
			}
			if(event.target == 'non_wood_harvesting_infrastructure'){
				w2ui[USAGEREPORT_FORM.events.name].refresh();
			}
			if(event.target == 'usagereportHeader'){
				w2ui[USAGEREPORT_FORM.usagereportHeader.name].refresh();
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


	usagereportHeader: {
		name   : 'usagereportHeader',
		style: 'border: 0px;',
		focus  : -1,
		fields : [
			{ field: 'year', type: 'list', options :{items: ENUMERATIONS.year}, html: { caption: 'Отчетный год:', span: '9', attr: 'style="width: 300px"'},required: true  },
			{ field: 'months', type: 'list', options :{items: ENUMERATIONS.months}, html: { caption: 'Отчетный месяц:', span: '9', attr: 'style="width: 300px"'},required: true  },
			{ field: 'forestry', type: 'list', options :{items: forestry}, html: { caption: 'Лесничество:', span: '9', attr: 'style="width: 300px"'}, required: true },
			{ field: 'docType', type: 'list', options :{items: ENUMERATIONS.docType}, html: { caption: 'Вид договора:', span: '9', attr: 'style="width: 300px"'},required: true  },
			{ field: 'docNumber', type: 'text', html: { caption: 'Номер договора:', span: '9', attr: 'style="width: 300px"'}, required: true },
			{ field: 'docDate', type: 'date', options :{ format: 'yyyy-mm-dd' }, html: { caption: 'Дата договора:', span: '9', attr: 'style="width: 100px"'},required: true  },
			{ field: 'docRegistration_number', type: 'text', html: { caption: 'Номер гос. регистрации:', span: '9', attr: 'style="width: 300px"'}},
		],
		onChange: function (event) {
			USAGEREPORT.objectUSAGEREPORT.header[event.target] = event.value_new;
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
					var woodHarvesting = new USAGEREPORT.ClassArrayWoodHarvesting(options);
					USAGEREPORT.objectUSAGEREPORT.add(USAGEREPORT.objectUSAGEREPORT.arrayWoodHarvesting,woodHarvesting);
					w2ui[USAGEREPORT_FORM.wood_harvesting.name].add(woodHarvesting);
				}
				if (event.target == 'copy') {
					w2ui[USAGEREPORT_FORM.wood_harvesting.name].save();
					var selection 	= w2ui[USAGEREPORT_FORM.wood_harvesting.name].getSelection();
					if(selection.length == 0)return;
					var record 		= w2ui[USAGEREPORT_FORM.wood_harvesting.name].get(selection[0]);
					var woodHarvesting = new USAGEREPORT.ClassArrayWoodHarvesting(record);
					USAGEREPORT.objectUSAGEREPORT.add(USAGEREPORT.objectUSAGEREPORT.arrayWoodHarvesting,woodHarvesting);
					w2ui[USAGEREPORT_FORM.wood_harvesting.name].add(woodHarvesting);
				}
				if (event.target == 'delete') {
					w2confirm('Удалить выбранные строки?', function (btn) {
						if (btn == 'Yes') {
							var selection = w2ui[USAGEREPORT_FORM.wood_harvesting.name].getSelection();
							for (var i = 0; i < selection.length; i++) {
								var record 	= w2ui[USAGEREPORT_FORM.wood_harvesting.name].get(selection[i]);
								USAGEREPORT.objectUSAGEREPORT.delete(USAGEREPORT.objectUSAGEREPORT.arrayWoodHarvesting,record);
							}
							w2ui[USAGEREPORT_FORM.wood_harvesting.name].select(selection);
							w2ui[USAGEREPORT_FORM.wood_harvesting.name].delete(true);
						}
					})
				}
			}
		},

		onDblClick: function (event) {
			var field = w2ui[this.name].columns[event.column].field;
			if (field == 'subforestry' ) {
				var filter = USAGEREPORT.objectUSAGEREPORT.header.forestry.id;
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
			if (field == 'sortiment' ) {
				var record = w2ui[this.name].get(event.recid);
				var filter = record.breed;
				var newList = [];
				for (var i = 0; i < sortiments.length; i++) {
					if (sortiments[i].breed_id == filter) {
						newList.push(sortiments[i]);
					}
					if (sortiments[i].breed_id == 'null') {
						newList.push(sortiments[i]);
					}
				}
				w2ui[this.name].columns[event.column].editable.items = newList;
			}

		},


		columns: [
			{ field: 'recid', sortable: false, hidden:true},
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
			{ field: 'area_size', caption: 'Площадь<br>лесосеки', size: '5%', sortable: false, editable: { type: 'float' },render: 'float:4',  style: "font-size:small" },
			{ field: 'square', caption: 'Площадь<br>заготовки', size: '5%', sortable: false, editable: { type: 'float' },render: 'float:4',  style: "font-size:small" },
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
			{
				field: 'sortiment', caption: 'Сортимент', size: '10%',
				editable: { type: 'select', items: sortiments, showAll: true },
				render: function (record, index, col_index) {
					var html = '';
					for (var p in sortiments) {
						if (sortiments[p].id == this.getCellValue(index, col_index)) html = sortiments[p].text;
					}
					return html;
				}
			},
			{ field: 'value', caption: 'Объем<br>заготовки', size: '5%', sortable: false, editable: { type: 'float' },render: 'float:2',  style: "font-size:small" },

		],

		onChange: function(event) {
			event.onComplete = function () {
				w2ui[USAGEREPORT_FORM.wood_harvesting.name].save();
				var record 		= w2ui[USAGEREPORT_FORM.wood_harvesting.name].get(event.recid);
				var column 		= w2ui[USAGEREPORT_FORM.wood_harvesting.name].getColumn(event.recid);


				if(!USAGEREPORT_FORM.checkNumber(record.quarter,true)){
					w2ui[USAGEREPORT_FORM.wood_harvesting.name].set(event.recid, { quarter: 0 });
					return
				}
				if(!USAGEREPORT_FORM.checkNumber(record.taxation_unit,true)){
					w2ui[USAGEREPORT_FORM.wood_harvesting.name].set(event.recid, { taxation_unit: 0 });
					return
				}
				if(!USAGEREPORT_FORM.checkNumber(record.value,true)){
					w2ui[USAGEREPORT_FORM.wood_harvesting.name].set(event.recid, { value: 0 });
					return
				}
				if(!USAGEREPORT_FORM.checkNumber(record.area_size,true)){
					w2ui[USAGEREPORT_FORM.wood_harvesting.name].set(event.recid, { area_size: 0 });
					return
				}
				if(!USAGEREPORT_FORM.checkNumber(record.square,true)){
					w2ui[USAGEREPORT_FORM.wood_harvesting.name].set(event.recid, { square: 0 });
					return
				}

				USAGEREPORT.objectUSAGEREPORT.edit(USAGEREPORT.objectUSAGEREPORT.arrayWoodHarvesting,record);

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
					var NonWoodHarvesting = new USAGEREPORT.ClassArrayNonWoodHarvesting(options);
					USAGEREPORT.objectUSAGEREPORT.add(USAGEREPORT.objectUSAGEREPORT.arrayNonWoodHarvesting,NonWoodHarvesting);
					w2ui[USAGEREPORT_FORM.non_wood_harvesting_volumes.name].add(NonWoodHarvesting);
				}
				if (event.target == 'copy') {
					w2ui[USAGEREPORT_FORM.non_wood_harvesting_volumes.name].save();
					var selection 	= w2ui[USAGEREPORT_FORM.non_wood_harvesting_volumes.name].getSelection();
					if(selection.length == 0)return;
					var record 		= w2ui[USAGEREPORT_FORM.non_wood_harvesting_volumes.name].get(selection[0]);
					var NonWoodHarvesting = new USAGEREPORT.ClassArrayNonWoodHarvesting(record);
					USAGEREPORT.objectUSAGEREPORT.add(USAGEREPORT.objectUSAGEREPORT.arrayNonWoodHarvesting,NonWoodHarvesting);
					w2ui[USAGEREPORT_FORM.non_wood_harvesting_volumes.name].add(NonWoodHarvesting);
				}
				if (event.target == 'delete') {
					w2confirm('Удалить выбранные строки?', function (btn) {
						if (btn == 'Yes') {
							var selection = w2ui[USAGEREPORT_FORM.non_wood_harvesting_volumes.name].getSelection();
							for (var i = 0; i < selection.length; i++) {
								var record 	= w2ui[USAGEREPORT_FORM.non_wood_harvesting_volumes.name].get(selection[i]);
								USAGEREPORT.objectUSAGEREPORT.delete(USAGEREPORT.objectUSAGEREPORT.arrayNonWoodHarvesting,record);
							}
							w2ui[USAGEREPORT_FORM.non_wood_harvesting_volumes.name].select(selection);
							w2ui[USAGEREPORT_FORM.non_wood_harvesting_volumes.name].delete(true);
						}
					})
				}
			}
		},

		onDblClick: function (event) {
			var field = w2ui[USAGEREPORT_FORM.non_wood_harvesting_volumes.name].columns[event.column].field;

			if (field == 'subforestry' ) {
				var filter = USAGEREPORT.objectUSAGEREPORT.header.forestry.id;
				var newList = [];
				for (var i = 0; i < subforestry.length; i++) {
					if (subforestry[i].forestry_id == filter) {
						newList.push(subforestry[i]);
					}
				}
				w2ui[USAGEREPORT_FORM.non_wood_harvesting_volumes.name].columns[event.column].editable.items = newList;
			}
			if (field == 'tract' ) {
				var record = w2ui[USAGEREPORT_FORM.non_wood_harvesting_volumes.name].get(event.recid);
				var filter = record.subforestry;
				var newList = [];
				for (var i = 0; i < tract.length; i++) {
					if (tract[i].subforestry_id == filter) {
						newList.push(tract[i]);
					}
				}
				w2ui[USAGEREPORT_FORM.non_wood_harvesting_volumes.name].columns[event.column].editable.items = newList;
			}
			if (field == 'resourceKind' ) {
				var record = w2ui[USAGEREPORT_FORM.non_wood_harvesting_volumes.name].get(event.recid);
				var filter = record.usagekind;
				var newList = [];
				for (var i = 0; i < resourceKind.length; i++) {
					if (resourceKind[i].usagekind_id == filter) {
						newList.push(resourceKind[i]);
					}
				}
				w2ui[USAGEREPORT_FORM.non_wood_harvesting_volumes.name].columns[event.column].editable.items = newList;
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
			{ field: 'value', caption: 'Объем<br>использования', size: '5%', sortable: false, editable: { type: 'float' },render: 'float:2',  style: "font-size:small" },
		],

		onChange: function(event) {
			event.onComplete = function () {
				w2ui[USAGEREPORT_FORM.non_wood_harvesting_volumes.name].save();
				var record 		= w2ui[USAGEREPORT_FORM.non_wood_harvesting_volumes.name].get(event.recid);

				if(!USAGEREPORT_FORM.checkNumber(record.quarter,true)){
					w2ui[USAGEREPORT_FORM.non_wood_harvesting_volumes.name].set(event.recid, { quarter: 0 });
					return
				}
				if(!USAGEREPORT_FORM.checkNumber(record.cutting_area,true)){
					w2ui[USAGEREPORT_FORM.non_wood_harvesting_volumes.name].set(event.recid, { cutting_area: 0 });
					return
				}
				if(!USAGEREPORT_FORM.checkNumber(record.value,true)){
					w2ui[USAGEREPORT_FORM.non_wood_harvesting_volumes.name].set(event.recid, { value: 0 });
					return
				}

				USAGEREPORT.objectUSAGEREPORT.edit(USAGEREPORT.objectUSAGEREPORT.arrayNonWoodHarvesting,record);
			}

		}
	},

	 events:{
		name: 'events',
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
					var Events = new USAGEREPORT.ClassEvents(options);
					USAGEREPORT.objectUSAGEREPORT.add(USAGEREPORT.objectUSAGEREPORT.arrayEvents,Events);
					w2ui[USAGEREPORT_FORM.events.name].add(Events);
				}
				if (event.target == 'copy') {
					w2ui[USAGEREPORT_FORM.events.name].save();
					var selection 	= w2ui[USAGEREPORT_FORM.events.name].getSelection();
					if(selection.length == 0)return;
					var record 		= w2ui[USAGEREPORT_FORM.events.name].get(selection[0]);
					var Events = new USAGEREPORT.ClassEvents(record);
					USAGEREPORT.objectUSAGEREPORT.add(USAGEREPORT.objectUSAGEREPORT.arrayEvents,Events);
					w2ui[USAGEREPORT_FORM.events.name].add(Events);
				}
				if (event.target == 'delete') {
					w2confirm('Удалить выбранные строки?', function (btn) {
						if (btn == 'Yes') {
							var selection = w2ui[USAGEREPORT_FORM.events.name].getSelection();
							for (var i = 0; i < selection.length; i++) {
								var record 	= w2ui[USAGEREPORT_FORM.events.name].get(selection[i]);
								USAGEREPORT.objectUSAGEREPORT.delete(USAGEREPORT.objectUSAGEREPORT.arrayEvents,record);
							}
							w2ui[USAGEREPORT_FORM.events.name].select(selection);
							w2ui[USAGEREPORT_FORM.events.name].delete(true);
						}
					})
				}
			}
		},

		onDblClick: function (event) {
			var field = w2ui[USAGEREPORT_FORM.events.name].columns[event.column].field;
			if (field == 'subforestry' ) {
				var filter = USAGEREPORT.objectUSAGEREPORT.header.forestry.id;
				var newList = [];
				for (var i = 0; i < subforestry.length; i++) {
					if (subforestry[i].forestry_id == filter) {
						newList.push(subforestry[i]);
					}
				}
				w2ui[USAGEREPORT_FORM.events.name].columns[event.column].editable.items = newList;
			}
			if (field == 'tract' ) {
				var record = w2ui[USAGEREPORT_FORM.events.name].get(event.recid);
				var filter = record.subforestry;
				var newList = [];
				for (var i = 0; i < tract.length; i++) {
					if (tract[i].subforestry_id == filter) {
						newList.push(tract[i]);
					}
				}
				w2ui[USAGEREPORT_FORM.events.name].columns[event.column].editable.items = newList;
			}
			if (field == 'cuttingmethods' ) {
				var record = w2ui[USAGEREPORT_FORM.events.name].get(event.recid);
				var filter = record.formCutting;
				var newList = [];
				for (var i = 0; i < cuttingmethods.length; i++) {
					if (cuttingmethods[i].formCutting == filter) {
						newList.push(cuttingmethods[i]);
					}
				}
				w2ui[USAGEREPORT_FORM.events.name].columns[event.column].editable.items = newList;
			}
			if (field == 'sortiment' ) {
				var record = w2ui[this.name].get(event.recid);
				var filter = record.breed;
				var newList = [];
				for (var i = 0; i < sortiments.length; i++) {
					if (sortiments[i].breed_id == filter) {
						newList.push(sortiments[i]);
					}
				}
				w2ui[this.name].columns[event.column].editable.items = newList;
			}
		},


		columns: [
			{ field: 'recid', sortable: false, hidden:true},
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
			{ field: 'infrastructureName', caption: 'Наименование<br>объекта', size: '10%', sortable: false, editable: { type: 'text' }, style: "font-size:small" },
			{ field: 'infrastructureID', caption: 'Номер<br>объекта', size: '10%', sortable: false, editable: { type: 'text' }, style: "font-size:small" },
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
			{ field: 'area_size', caption: 'Площадь<br>лесосеки', size: '5%', sortable: false, editable: { type: 'float' },render: 'float:4',  style: "font-size:small" },
			{ field: 'square', caption: 'Площадь<br>заготовки', size: '5%', sortable: false, editable: { type: 'float' },render: 'float:4',  style: "font-size:small" },
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
			{
				field: 'sortiment', caption: 'Сортимент', size: '10%',
				editable: { type: 'select', items: sortiments, showAll: true },
				render: function (record, index, col_index) {
					var html = '';
					for (var p in sortiments) {
						if (sortiments[p].id == this.getCellValue(index, col_index)) html = sortiments[p].text;
					}
					return html;
				}
			},
			{ field: 'value', caption: 'Объем<br>древесины', size: '5%', sortable: false, editable: { type: 'float' },render: 'float:2',  style: "font-size:small" },

		],

		onChange: function(event) {
			event.onComplete = function () {
				w2ui[USAGEREPORT_FORM.events.name].save();
				var record 		= w2ui[USAGEREPORT_FORM.events.name].get(event.recid);

				if(!USAGEREPORT_FORM.checkNumber(record.quarter,true)){
					w2ui[USAGEREPORT_FORM.events.name].set(event.recid, { quarter: 0 });
					return
				}
				if(!USAGEREPORT_FORM.checkNumber(record.cutting_area,true)){
					w2ui[USAGEREPORT_FORM.events.name].set(event.recid, { cutting_area: 0 });
					return
				}

				USAGEREPORT.objectUSAGEREPORT.edit(USAGEREPORT.objectUSAGEREPORT.arrayEvents,record);
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

		Object.assign(w2ui[this.usagereportHeader.name].record, USAGEREPORT.objectUSAGEREPORT.header);

		for (var i = 0; i < USAGEREPORT.objectUSAGEREPORT.arrayWoodHarvesting.length; i++) {
			var elemWoodHarvesting = USAGEREPORT.objectUSAGEREPORT.arrayWoodHarvesting[i];
			w2ui[USAGEREPORT_FORM.wood_harvesting.name].add(elemWoodHarvesting);
		}


		for (var i = 0; i < USAGEREPORT.objectUSAGEREPORT.arrayNonWoodHarvesting.length; i++) {
			var elemNonWoodHarvesting = USAGEREPORT.objectUSAGEREPORT.arrayNonWoodHarvesting[i];
			w2ui[USAGEREPORT_FORM.non_wood_harvesting_volumes.name].add(elemNonWoodHarvesting);
		}

		for (var i = 0; i < USAGEREPORT.objectUSAGEREPORT.arrayEvents.length; i++) {
			var elemEvents = USAGEREPORT.objectUSAGEREPORT.arrayEvents[i];
			w2ui[USAGEREPORT_FORM.events.name].add(elemEvents);
		}

		//файлы
		var files = [];
		for (var i = 0; i < USAGEREPORT.objectUSAGEREPORT.files.length; i++) {
			var file = {
				name:USAGEREPORT.objectUSAGEREPORT.files[i].name,
				id:USAGEREPORT.objectUSAGEREPORT.files[i].id,
				sizetext:USAGEREPORT.objectUSAGEREPORT.files[i].sizetext,
			}
			files.push(file);
		}

		$$("upl1").files.parse(files);

	},

	beforeOpening: function () {

		forestry.splice(0, forestry.length);
		subforestry.splice(0, subforestry.length);
		tract.splice(0, tract.length);
		breeds.splice(0, breeds.length);
		cuttingmethods.splice(0, cuttingmethods.length);
		actionUsageKind.splice(0, actionUsageKind.length);
		usagekind.splice(0, usagekind.length);
		resourceKind.splice(0, resourceKind.length);
		cuttingmethods.splice(0, cuttingmethods.length);
		sortiments.splice(0, sortiments.length);

		BD.fillList(FORESTRY, forestry, ['recid', 'name','cod', ]);
		BD.fillList(SUBFORESTRY, subforestry, ['recid', 'name', 'forestry_id','cod', ]);
		BD.fillList(TRACT, tract, ['recid', 'name', 'subforestry_id','cod', ]);
		BD.fillList(BREEDS, breeds, ['recid', 'name','kodGulf' ]);
		BD.fillList(ACTIONUSAGEKIND, actionUsageKind, ['recid', 'name', 'cod',]);
		BD.fillList(USAGEKIND, usagekind, ['recid', 'name', 'cod',]);
		BD.fillList(RESOURCEKIND, resourceKind, ['recid', 'name', 'usagekind_id','cod', ]);
		BD.fillList(SORTIMENT, sortiments, ['recid', 'name', 'cod','breed_id' ]);
		
		BD.fillList(CUTTINGMETHODS, cuttingmethods, ['recid', 'name', 'formCutting','idCutting' ],this.whenOpening,USAGEREPORT_FORM);

	},

	whenOpening: function () {

		if (w2ui.hasOwnProperty(this.usagereportLayout.name)){
			w2ui[this.usagereportLayout.name].destroy();
		}
		$('#content').w2layout(this.usagereportLayout);

		if (w2ui.hasOwnProperty(this.toptoolbar.name)){
			w2ui[this.toptoolbar.name].destroy();
		}
		$('#toptoolbar').w2toolbar(this.toptoolbar);


		w2ui.usagereportLayout.content('main', '<style>.tabP {border: 0px;width: 100%;height: 100%;overflow: hidden;}'+
			'.tabF {border: 0px;width: 100%;height: 100%;overflow: hidden;}</style>'+
			'<div id="USAGEREPORT">'+
			'<div id="tabsUSAGEREPORT" style="width: 100%;"></div>'+
			'<div id="usagereportHeader" class="tabP"><div id="usagereportHeader_form" class="tabF" style="width: 100%; height: 100%;"></div></div>'+
			'<div id="wood_harvesting" class="tabP"><div id="wood_harvesting_form" style="width: 100%; height: 100%;"></div></div>'+
			'<div id="non_wood_harvesting_volumes" class="tabP"><div id="non_wood_harvesting_volumes_form" style="width: 100%; height: 100%;"></div></div>'+
			'<div id="events" class="tabP"><div id="events_form" style="width: 100%; height: 100%;"></div></div>'+
			'<div id="files" class="tabP"></div>'+
			'</div>');

		if (w2ui.hasOwnProperty(this.tabsUSAGEREPORT.name)){
			w2ui[this.tabsUSAGEREPORT.name].destroy();
		}
		$('#tabsUSAGEREPORT').w2tabs(this.tabsUSAGEREPORT);


		if (w2ui.hasOwnProperty(this.usagereportHeader.name)){
			w2ui[this.usagereportHeader.name].destroy();
		};
		$('#usagereportHeader_form').w2form(this.usagereportHeader);


		if (w2ui.hasOwnProperty(this.wood_harvesting.name)){
			w2ui[this.wood_harvesting.name].destroy();
		}
		$('#wood_harvesting_form').w2grid(this.wood_harvesting);

		if (w2ui.hasOwnProperty(this.non_wood_harvesting_volumes.name)){
			w2ui[this.non_wood_harvesting_volumes.name].destroy();
		}
		$('#non_wood_harvesting_volumes_form').w2grid(this.non_wood_harvesting_volumes);

		if (w2ui.hasOwnProperty(this.events.name)){
			w2ui[this.events.name].destroy();
		}
		$('#events_form').w2grid(this.events);


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
				var objectFiles = new USAGEREPORT.ClassArrayFiles(options);
				USAGEREPORT.objectUSAGEREPORT.add(USAGEREPORT.objectUSAGEREPORT.files,objectFiles);
			}, false);
			fileReader.readAsDataURL(event.file);
		});


		$$("upl1").files.attachEvent("onBeforeDelete", function(event){
			USAGEREPORT.objectUSAGEREPORT.deleteFile(event);
		});

		//реализовать заполнение из модели
		this.fillObjects();
	},	

	init: function () {
		this.beforeOpening();
	},

}

