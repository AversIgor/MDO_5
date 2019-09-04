import {BD} from "./dao";
import {GRIDFORM} from "./gridform";
import {COEFFICIENTSFORMCUTTING} from "./coefficientsformcutting";
import {ENUMERATIONS} from "./enumerations";
import {TYPESRATES} from "./typesrates";


//КОЭФФИЦИЕНТЫ НА ЛИКВИДНЫЙ ЗАПАС
export var COEFFICIENTSRANGESLIQUIDATION = {};
COEFFICIENTSRANGESLIQUIDATION.nameTables = "coefficientsrangesliquidation";
COEFFICIENTSRANGESLIQUIDATION.textQuery = "CREATE TABLE [coefficientsrangesliquidation] (" +
	"[recid] INTEGER PRIMARY KEY ASC, " +
	"[typesrates_id] INTEGER, " +
	"[rangesLiquidation] INTEGER, " +
	"[value] FLOAT);";

COEFFICIENTSRANGESLIQUIDATION.typesrates = [];

//Структура полей
COEFFICIENTSRANGESLIQUIDATION.structFields = function () {
    
	var structFields = [
		{ field: 'recid', caption: '№', size: '3%', sortable: true},
		{ 
			field: 'typesrates_id', caption: 'Вид ставки', size: '30%', sortable: true, resizable: true, hidden:true,
			editable: { type: 'select', items: COEFFICIENTSFORMCUTTING.typesrates, showAll: true },
		    render: function (record, index, col_index) {
		        var html = '';
		        for (var p in COEFFICIENTSFORMCUTTING.typesrates) {
		            if (COEFFICIENTSFORMCUTTING.typesrates[p].id == this.getCellValue(index, col_index)) html = COEFFICIENTSFORMCUTTING.typesrates[p].text;
		        }
		        return html;
		    }		
		},	
		{ 
			field: 'rangesLiquidation', caption: 'Выход ликвидного запаса', size: '30%', sortable: true, resizable: true, 
			editable: { type: 'select', items: ENUMERATIONS.rangesLiquidation, showAll: true },
		    render: function (record, index, col_index) {
		        var html = '';
		        for (var p in ENUMERATIONS.rangesLiquidation) {
		            if (ENUMERATIONS.rangesLiquidation[p].id == this.getCellValue(index, col_index)) html = ENUMERATIONS.rangesLiquidation[p].text;
		        }
		        return html;
		    }		
		},		
		{ field: 'value', caption: 'Коэффициент', size: '10%', sortable: true, editable: { type: 'real' }, render: 'number:2' },		
    ];

    return structFields;
}

COEFFICIENTSRANGESLIQUIDATION.gridObject = function () {

	 var grid = {
		name: this.nameTables,
		header: 'Коэффициенты на ликвидный запас',
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
				{ type: 'spacer' },
				{ type: 'menu', id: 'typesrates', caption: 'Вид ставки: ', count: '', items: this.typesrates },
			],
			onClick: function (event) {
				if (event.target == 'add') {
					var struct = [];
					var row = {};
					row.recid = null;
					row.typesrates_id = w2ui[COEFFICIENTSRANGESLIQUIDATION.nameTables].toolbar.get('typesrates').curentID;
					struct.push(row);
					BD.addArray(COEFFICIENTSRANGESLIQUIDATION, struct, GRIDFORM.confirmAdd);
				}
				if (event.target == 'save') {
					var records = w2ui[COEFFICIENTSRANGESLIQUIDATION.nameTables].getChanges();
					BD.edit(COEFFICIENTSRANGESLIQUIDATION, records, GRIDFORM.confirmEdit);
				}
				if (event.target == 'delete') {
					w2confirm('Удалить выбранные строки?', function (btn) {
						if (btn == 'Yes') {
							let selection = w2ui[COEFFICIENTSRANGESLIQUIDATION.nameTables].getSelection();
							var conditions = {};
							conditions.recid = selection;
							BD.deleteWithConditions(COEFFICIENTSRANGESLIQUIDATION, conditions, GRIDFORM.confirmDelete);
						 }
					})
				}
				if (event.target.substring(0, 10) == 'typesrates') {
					if ('subItem' in event) {
						GRIDFORM.setSelection(COEFFICIENTSRANGESLIQUIDATION, 'typesrates', 'typesrates_id', event.subItem);
					}
				}
			}
		},
		columns: this.structFields(),
	 }
	 return grid;
}

COEFFICIENTSRANGESLIQUIDATION.beforeOpening = function () {
	
	this.typesrates.splice(0, this.typesrates.length);
    BD.fillList(TYPESRATES, this.typesrates, ['recid', 'name']);
    BD.filldata(this, this.whenOpening);

} 

COEFFICIENTSRANGESLIQUIDATION.whenOpening = function (dataSet) {

    GRIDFORM.showGrid('#content', this.gridObject(), dataSet);
    GRIDFORM.setSelection(this, 'typesrates', 'typesrates_id', this.typesrates[0]);
}

COEFFICIENTSRANGESLIQUIDATION.init = function () {
	
	COEFFICIENTSRANGESLIQUIDATION.beforeOpening();
	
}