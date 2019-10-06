import {BD} from "./dao";
import {GRIDFORM} from "./gridform";
import {ENUMERATIONS} from "./enumerations";



//КОЭФФИЦИЕНТЫ НА СТЕПЕНЬ ПОВРЕЖДЕННОСТИ
export var COEFFICIENTSDAMAGE = {};
COEFFICIENTSDAMAGE.nameTables = "coefficientsdamage";
COEFFICIENTSDAMAGE.textQuery = "CREATE TABLE [coefficientsdamage] (" +
	"[recid] INTEGER PRIMARY KEY ASC, " +
	"[typesrates_id] INTEGER, " +
	"[damage] INTEGER, " +
	"[value] FLOAT);";

COEFFICIENTSDAMAGE.typesrates = [];

//Структура полей
COEFFICIENTSDAMAGE.structFields = function () {
    
	var structFields = [
		{ field: 'recid', caption: '№', size: '3%', sortable: true},
		{ 
			field: 'typesrates_id', caption: 'Вид ставки', size: '30%', sortable: true, resizable: true, hidden:true,
			editable: { type: 'select', items: COEFFICIENTSDAMAGE.typesrates, showAll: true },
		    render: function (record, index, col_index) {
		        var html = '';
		        for (var p in COEFFICIENTSDAMAGE.typesrates) {
				
		            if (COEFFICIENTSDAMAGE.typesrates[p].id == this.getCellValue(index, col_index)) {
						
						html = COEFFICIENTSDAMAGE.typesrates[p].text;
					}
		        }
		        return html;
		    }		
		},	
		{ 
			field: 'damage', caption: 'Степень поврежденности', size: '30%', sortable: true, resizable: true, 
			editable: { type: 'select', items: ENUMERATIONS.damage, showAll: true },
		    render: function (record, index, col_index) {
		        var html = '';
		        for (var p in ENUMERATIONS.damage) {
		            if (ENUMERATIONS.damage[p].id == this.getCellValue(index, col_index)) html = ENUMERATIONS.damage[p].text;
		        }
		        return html;
		    }		
		},		
		{ field: 'value', caption: 'Коэффициент', size: '10%', sortable: true, editable: { type: 'real' }, render: 'number:2' },		
    ];

    return structFields;
}

COEFFICIENTSDAMAGE.gridObject = function () {

	 var grid = {
		name: this.nameTables,
		header: 'Коэффициенты на степень поврежденности',
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
					row.typesrates_id = w2ui[COEFFICIENTSDAMAGE.nameTables].toolbar.get('typesrates').curentID;
					struct.push(row);
					BD.addArray(COEFFICIENTSDAMAGE, struct, GRIDFORM.confirmAdd);
				}
				if (event.target == 'save') {
					var records = w2ui[COEFFICIENTSDAMAGE.nameTables].getChanges();
					BD.edit(COEFFICIENTSDAMAGE, records, GRIDFORM.confirmEdit);
				}
				if (event.target == 'delete') {
					w2confirm('Удалить выбранные строки?', function (btn) {
						if (btn == 'Yes') {
							let selection = w2ui[COEFFICIENTSDAMAGE.nameTables].getSelection();
							var conditions = {};
							conditions.recid = selection;
							BD.deleteWithConditions(COEFFICIENTSDAMAGE, conditions, GRIDFORM.confirmDelete);
						 }
					})
				}
				if (event.target.substring(0, 10) == 'typesrates') {
					if ('subItem' in event) {
						GRIDFORM.setSelection(COEFFICIENTSDAMAGE, 'typesrates', 'typesrates_id', event.subItem);
					}
				}
			}
		},
		columns: this.structFields(),
	 }
	 return grid;
}

COEFFICIENTSDAMAGE.beforeOpening = function () {

	this.typesrates.splice(0, this.typesrates.length); 
    BD.fillList(TYPESRATES, this.typesrates, ['recid', 'name']);
    BD.filldata(this, this.whenOpening);

} 

COEFFICIENTSDAMAGE.whenOpening = function (dataSet) {

    GRIDFORM.showGrid('#content', this.gridObject(), dataSet);
    GRIDFORM.setSelection(this, 'typesrates', 'typesrates_id', this.typesrates[0]);
	
}

COEFFICIENTSDAMAGE.init = function () {
	
	COEFFICIENTSDAMAGE.beforeOpening();
	
}