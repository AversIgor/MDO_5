import {BD} from "./dao";
import {GRIDFORM} from "./gridform";
import {ENUMERATIONS} from "./enumerations";
import {FEEDRATES} from "./feedrates";


//ВИДЫ СТАВОК ПЛАТЫ
export var TYPESRATES = {};
TYPESRATES.nameTables = "typesrates";
TYPESRATES.textQuery = "CREATE TABLE [typesrates] (" +
	"[recid] INTEGER PRIMARY KEY ASC, " +
	"[orderroundingrates] INTEGER, " +
	"[predefined] int DEFAULT (0), " +
	"[name] TEXT," +
	"[coefficientsindexing] FLOAT);";

TYPESRATES.structFields = function () {
    
	var structFields = [
		{ field: 'recid', caption: 'Код', size: '2%', sortable: true},	
		{ field: 'predefined', caption: '', size: '3%', sortable: true, attr: "align=center" ,
			render: function (record, index, col_index) {
		        var html = '';
				if(this.getCellValue(index, col_index) != ''){
					html = "<div style='color:red'>*</div>";
				}
		        return html;
		    }	
		},		
		{ field: 'name', caption: 'Наименование', size: '50%', sortable: true, editable: { type: 'text' } },
		{ 
			field: 'orderroundingrates', caption: 'Порядок округления ставки', size: '25%', sortable: true, resizable: true,
			editable: { type: 'select', items: ENUMERATIONS.orderRoundingRates, showAll: true },
		    render: function (record, index, col_index) {
		        var html = '';
		        for (var p in ENUMERATIONS.orderRoundingRates) {
		            if (ENUMERATIONS.orderRoundingRates[p].id == this.getCellValue(index, col_index)) html = ENUMERATIONS.orderRoundingRates[p].text;
		        }
		        return html;
		    }		
		},
		{ field: 'coefficientsindexing', caption: 'Коэффициент индексации', size: '25%', sortable: true, editable: { type: 'real' }, render: 'number:2' },		
    ];

    return structFields;
}

TYPESRATES.layout = function () {

	var layout = {
		name: 'TYPESRATESlayout',
		panels: [
			{ type: 'top', size: 150, content:'<div id="typesrates" style="height: 100%; width: 100%;"></div>',resizable: true },
			{ type: 'main',  content:'<div id="feedrates" style="height: 100%; width: 100%;"></div>' }
		]
	};
	return layout;
}

TYPESRATES.gridObject = function () {

    var grid = {
		name: this.nameTables,
		header  : 'Ставки платы',
		show: {
            header: false,
            toolbar: true,
            footer: false,
			toolbarSearch: false,
		},
		toolbar: {
			items: [
				{ id: 'add', type: 'button', caption: 'Добавить', icon: 'w2ui-icon-plus' },
				{ id: 'save', type: 'button', caption: 'Сохранить', icon: 'w2ui-icon-check' },
				{ id: 'delete', type: 'button', caption: 'Удалить', icon: 'w2ui-icon-cross' },									
			],
			onClick: function (event) {
				if (event.target == 'add') {
					var struct = [];
					var row = {};
					row.recid = null;
					row.name = 'Укажите название!';
					struct.push(row);
					BD.addArray(TYPESRATES, struct, GRIDFORM.confirmAdd);				
				}
				if (event.target == 'save') {
					var records = w2ui[TYPESRATES.nameTables].getChanges();
					BD.edit(TYPESRATES, records, GRIDFORM.confirmEdit);				
				}
				if (event.target == 'delete') {					
					var selection = w2ui[TYPESRATES.nameTables].getSelection();
					var isError = false;
					for (var i = 0; i < selection.length; i++) {
						var record = w2ui[TYPESRATES.nameTables].get(selection[i]);
						if(record.predefined == 1 ){
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
							var conditions = {};
							conditions.recid = selection;
							BD.deleteWithConditions(TYPESRATES, conditions, GRIDFORM.confirmDelete);							
						}
					})                    
				}			
			}
		},
		columns: this.structFields(),
		onSelect: function (event) {
			w2ui[FEEDRATES.nameTables].search('typesrates_id', event.recid);
		},
		onUnselect: function(event) {
			w2ui[FEEDRATES.nameTables].search('typesrates_id', -1);
		},
	}
	return grid;
}

TYPESRATES.beforeOpening = function () {

    BD.filldata(this, this.whenOpening);

}

TYPESRATES.whenOpening = function (dataSet) {

	if (w2ui.hasOwnProperty(this.layout().name)){
		w2ui[this.layout().name].destroy();
	}
	$('#content').w2layout(this.layout());

    GRIDFORM.showGrid('#typesrates', this.gridObject(), dataSet);

	FEEDRATES.init()

}

TYPESRATES.init = function () {
	
	TYPESRATES.beforeOpening();
	
}