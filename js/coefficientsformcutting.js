import {BD} from "./dao";
import {GRIDFORM} from "./gridform";
import {ENUMERATIONS} from "./enumerations";



//КОЭФФИЦИЕНТЫ НА ФОРМУ РУБКИ
export var COEFFICIENTSFORMCUTTING = {};
COEFFICIENTSFORMCUTTING.nameTables = "coefficientsformcutting";
COEFFICIENTSFORMCUTTING.textQuery = "CREATE TABLE [coefficientsformcutting] (" +
	"[recid] INTEGER PRIMARY KEY ASC, " +
	"[typesrates_id] INTEGER, " +
	"[formCutting] INTEGER, " +
	"[value] FLOAT);";

COEFFICIENTSFORMCUTTING.typesrates = [];


//Структура полей
COEFFICIENTSFORMCUTTING.structFields = function () {
    
	var structFields = [
		{ field: 'recid', caption: '№', size: '3%', sortable: true},
		{ 
			field: 'typesrates_id', caption: 'Вид ставки', size: '30%', sortable: true, resizable: true, hidden:true,
			editable: { type: 'select', items: COEFFICIENTSFORMCUTTING.typesrates, showAll: true },
		    render: function (record, index, col_index) {
		        var html = '';
		        for (var p in COEFFICIENTSFORMCUTTING.typesrates) {
				
		            if (COEFFICIENTSFORMCUTTING.typesrates[p].id == this.getCellValue(index, col_index)) {
						
						html = COEFFICIENTSFORMCUTTING.typesrates[p].text;
					}
		        }
		        return html;
		    }		
		},	
		{ 
			field: 'formCutting', caption: 'Форма рубки', size: '30%', sortable: true, resizable: true, 
			editable: { type: 'select', items: ENUMERATIONS.formCutting, showAll: true },
		    render: function (record, index, col_index) {
		        var html = '';
		        for (var p in ENUMERATIONS.formCutting) {
		            if (ENUMERATIONS.formCutting[p].id == this.getCellValue(index, col_index)) html = ENUMERATIONS.formCutting[p].text;
		        }
		        return html;
		    }		
		},		
		{ field: 'value', caption: 'Коэффициент', size: '10%', sortable: true, editable: { type: 'real' }, render: 'number:2' },		
    ];

    return structFields;
}

COEFFICIENTSFORMCUTTING.gridObject = function () {

	 var grid = {
		name: this.nameTables,
		header: 'Коэффициенты на форму рубки',
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
					row.typesrates_id = w2ui[COEFFICIENTSFORMCUTTING.nameTables].toolbar.get('typesrates').curentID;
					struct.push(row);
					BD.addArray(COEFFICIENTSFORMCUTTING, struct, GRIDFORM.confirmAdd);
				}
				if (event.target == 'save') {
					var records = w2ui[COEFFICIENTSFORMCUTTING.nameTables].getChanges();
					BD.edit(COEFFICIENTSFORMCUTTING, records, GRIDFORM.confirmEdit);
				}
				if (event.target == 'delete') {
					w2confirm('Удалить выбранные строки?', function (btn) {
						if (btn == 'Yes') {
							let selection = w2ui[COEFFICIENTSFORMCUTTING.nameTables].getSelection();
							var conditions = {};
							conditions.recid = selection;
							BD.deleteWithConditions(COEFFICIENTSFORMCUTTING, conditions, GRIDFORM.confirmDelete);
						 }
					})
				}
				if (event.target.substring(0, 10) == 'typesrates') {
					if ('subItem' in event) {
						GRIDFORM.setSelection(COEFFICIENTSFORMCUTTING, 'typesrates', 'typesrates_id', event.subItem);
					}
				}
			}
		},
		columns: this.structFields(),
	 }
	 return grid;
}

COEFFICIENTSFORMCUTTING.beforeOpening = function () {

	this.typesrates.splice(0, this.typesrates.length);
    BD.fillList(TYPESRATES, this.typesrates, ['recid', 'name']);
    BD.filldata(this, this.whenOpening);

} 

COEFFICIENTSFORMCUTTING.whenOpening = function (dataSet) {

    GRIDFORM.showGrid('#content', this.gridObject(), dataSet);
    GRIDFORM.setSelection(this, 'typesrates', 'typesrates_id', this.typesrates[0]);
}

COEFFICIENTSFORMCUTTING.init = function () {
	
	COEFFICIENTSFORMCUTTING.beforeOpening();
	
}