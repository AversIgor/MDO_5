import {BD} from "./dao";
import {GRIDFORM} from "./gridform";

import {store} from "../src/app";
import * as breed from "../actions/reference/breed";

//СОРТИМЕНТЫ
export var SORTIMENT = {};
SORTIMENT.nameTables = "sortiment";
SORTIMENT.textQuery = "CREATE TABLE [sortiment] ("+
	"[recid] INTEGER PRIMARY KEY ASC, " +
	"[breed_id] INTEGER, " +
	"[name] TEXT, " +
	"[cod] TEXT);",


SORTIMENT.breed = [];

//Структура полей
SORTIMENT.structFields = function () {

    var structFields = [
		{ field: 'recid', caption: 'Код', size: '5%', sortable: true },

		{
		    field: 'breed_id', caption: 'Порода', size: '30%', sortable: true, resizable: true,
		    editable: { type: 'select', items: [{ id: '', text: '' }].concat(SORTIMENT.breed), showAll: true },
		    render: function (record, index, col_index) {
		        var html = '';
		        for (var p in SORTIMENT.breed) {
		            if (SORTIMENT.breed[p].id == this.getCellValue(index, col_index)) html = SORTIMENT.breed[p].text;
		        }
		        return html;
		    }
		},

		{ field: 'name', caption: 'Наименование сортимента', size: '30%', sortable: true, editable: { type: 'text' } },
		{ field: 'cod', caption: 'ОКПД', size: '30%', sortable: true, editable: { type: 'text' } },
    ];

    return structFields;
}

SORTIMENT.gridObject = function () {

    var grid = {
		name: this.nameTables,
		header  : 'Сортименты',
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
					BD.addArray(SORTIMENT, struct, GRIDFORM.confirmAdd);
				}
				if (event.target == 'save') {
					var records = w2ui[SORTIMENT.nameTables].getChanges();
					BD.edit(SORTIMENT, records, GRIDFORM.confirmEdit);				
				}
				if (event.target == 'delete') {
					w2confirm('Удалить выбранные строки?', function (btn) { 
						if(btn == 'Yes'){
							var selection = w2ui[SORTIMENT.nameTables].getSelection();
							var conditions = {};
							conditions.recid = selection;
							BD.deleteWithConditions(SORTIMENT, conditions, GRIDFORM.confirmDelete);						
						}
					})                    
				}
			}
		},
		columns: this.structFields(),
		sortData: [
			//{ field: 'forestry_id', direction: 'asc' },
			//{ field: 'name', direction: 'asc' }
			{ field: 'recid', direction: 'asc' }
		],
		multiSearch: true,
        searches: [
		    { field: 'breed_id', caption: 'Лесничество', type: 'list', options: { items: SORTIMENT.breed } },
            { field: 'name', caption: 'Наименование', type: 'text' },
        ]
	}
	return grid;
}

SORTIMENT.beforeOpening = function () {

	this.breed.splice(0, this.breed.length);
	SORTIMENT.fillbreeds()
    BD.filldata(this, this.whenOpening);

}

SORTIMENT.fillbreeds = function () {
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
			SORTIMENT.breed.push(row);
		}
	}
	SORTIMENT.breed.splice(0,breed.breed.length);
	asyncProcess(breed);
}

SORTIMENT.whenOpening = function (dataSet) {

    GRIDFORM.showGrid('#content', this.gridObject(), dataSet);

}

SORTIMENT.init = function () {

	SORTIMENT.beforeOpening();
	
}