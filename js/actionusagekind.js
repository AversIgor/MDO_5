import {BD} from "./dao";
import {GRIDFORM} from "./gridform";

//Категории защитности
export var ACTIONUSAGEKIND =  {

	nameTables: "actionusagekind",

	textQuery:	"CREATE TABLE [actionusagekind] (" +
		"[recid] INTEGER PRIMARY KEY ASC," +
		"[name] TEXT, " +
		"[cod] TEXT);",
	
	structFields: function () {

		var structFields = [
			{ field: 'recid', caption: 'Код', size: '5%', sortable: true },
			{ field: 'name', caption: 'Наименование', size: '70%', sortable: true, editable: { type: 'text' } },
			{ field: 'cod', caption: 'Идентификатор', size: '30%', sortable: true, editable: { type: 'text' } },
		];

		return structFields;
	},

	gridObject: function () {

		var grid = {
			name: this.nameTables,
			header: 'Мероприятия, связанные с использование лесов',
			show: {
				header: false,
				toolbar: true,
				footer: true,
				toolbarSearch: false,
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
						row.name = 'Укажите наименование';
						row.cod = 'Укажите идентифкатор';
						row.recid = null;
						struct.push(row);
						BD.addArray(ACTIONUSAGEKIND, struct, GRIDFORM.confirmAdd);
					}
					if (event.target == 'save') {
						var selection = w2ui[ACTIONUSAGEKIND.nameTables].getChanges();
						for (var i = 0; i < selection.length; i++) {
							var record = w2ui[ACTIONUSAGEKIND.nameTables].get(selection[i].recid);
							if(record.changes){
								if(record.changes.name == ''){
									w2alert('Не заполнено наименование!');
									return;
								}
								if(record.changes.cod == ''){
									w2alert('Не заполнен идентификатор!');
									return;
								}
							}
						}					
						BD.edit(ACTIONUSAGEKIND, selection, GRIDFORM.confirmEdit);
					}
					if (event.target == 'delete') {
						w2confirm('Удалить выбранные строки?', function (btn) {
							if (btn == 'Yes') {
								let selection = w2ui[ACTIONUSAGEKIND.nameTables].getSelection();
								var conditions = {};
								conditions.recid = selection;
								BD.deleteWithConditions(ACTIONUSAGEKIND, conditions, GRIDFORM.confirmDelete);						
							}
						})
					}
				}
			},
			columns: this.structFields(),
			sortData: [
				{ field: 'recid', direction: 'asc' }
			]
		}
		return grid;
	},

	beforeOpening: function () {
		BD.filldata(this, this.whenOpening);
	},


	whenOpening: function (dataSet) {
		GRIDFORM.showGrid('#grid', this.gridObject(), dataSet);
	},

	init: function () {
		this.beforeOpening();		
	}

};