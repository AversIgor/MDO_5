import {BD} from "./dao";
import {GRIDFORM} from "./gridform";
import {USAGEKIND} from "./usageKind";

//Подвиды использования лесов (ресурсы)
export var RESOURCEKIND = {};
RESOURCEKIND.nameTables = "resourcekind";
RESOURCEKIND.textQuery = "CREATE TABLE [resourcekind] ("+
	"[recid] INTEGER PRIMARY KEY ASC, " +
	"[usagekind_id] INTEGER, " +
	"[name] TEXT, " +
	"[cod] TEXT);",


RESOURCEKIND.usagekind = [];

//Структура полей
RESOURCEKIND.structFields = function () {

    var structFields = [
		{ field: 'recid', caption: 'Код', size: '5%', sortable: true },

		{
		    field: 'usagekind_id', caption: 'Вид использования лесов', size: '30%', sortable: true, resizable: true,
		    editable: { type: 'select', items: RESOURCEKIND.usagekind, showAll: true },
		    render: function (record, index, col_index) {
		        var html = '';
		        for (var p in RESOURCEKIND.usagekind) {
		            if (RESOURCEKIND.usagekind[p].id == this.getCellValue(index, col_index)) html = RESOURCEKIND.usagekind[p].text;
		        }
		        return html;
		    }
		},

		{ field: 'name', caption: 'Наименование', size: '30%', sortable: true, editable: { type: 'text' } },
		{ field: 'cod', caption: 'Идентификатор', size: '30%', sortable: true, editable: { type: 'text' } },
    ];

    return structFields;
}

RESOURCEKIND.gridObject = function () {

    var grid = {
		name: this.nameTables,
		header  : 'Виды заготовляемых ресурсов',
		show: {
            header: false,
            toolbar: true,
            footer: true,
			toolbarSearch: true,
		},
		toolbar: {
			items: [
				{ id: 'add', type: 'button', caption: 'Добавить', icon: 'w2ui-icon-plus' },
				{ id: 'save', type: 'button', caption: 'Сохранить', icon: 'w2ui-icon-check' },
				{ id: 'delete', type: 'button', caption: 'Удалить', icon: 'w2ui-icon-cross' }
			],
			onClick: function (event) {
				if (event.target == 'add') {
					var struct = [];
					var row = {};
					row.recid = null;
					row.name = 'Укажите название!';
					struct.push(row);
					BD.addArray(RESOURCEKIND, struct, GRIDFORM.confirmAdd);
				}
				if (event.target == 'save') {
					var records = w2ui[RESOURCEKIND.nameTables].getChanges();
					BD.edit(RESOURCEKIND, records, GRIDFORM.confirmEdit);				
				}
				if (event.target == 'delete') {
					w2confirm('Удалить выбранные строки?', function (btn) { 
						if(btn == 'Yes'){
							var selection = w2ui[RESOURCEKIND.nameTables].getSelection();
							var conditions = {};
							conditions.recid = selection;
							BD.deleteWithConditions(RESOURCEKIND, conditions, GRIDFORM.confirmDelete);						
						}
					})                    
				}
			}
		},
		columns: this.structFields(),
		sortData: [
			{ field: 'recid', direction: 'asc' }
		],
		multiSearch: true,
        searches: [
		    { field: 'usagekind_id', caption: 'Лесничество', type: 'list', options: { items: RESOURCEKIND.usagekind } },
            { field: 'name', caption: 'Наименование', type: 'text' },
        ]
	}
	return grid;
}

RESOURCEKIND.beforeOpening = function () {

	this.usagekind.splice(0, this.usagekind.length);
    BD.fillList(USAGEKIND, this.usagekind, ['recid', 'name', 'cod']);
    BD.filldata(this, this.whenOpening);

}

RESOURCEKIND.whenOpening = function (dataSet) {

    GRIDFORM.showGrid('#grid', this.gridObject(), dataSet);

}

RESOURCEKIND.init = function () {

	RESOURCEKIND.beforeOpening();
	
}