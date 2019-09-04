import {BD} from "./dao";
import {GRIDFORM} from "./gridform";

//ВИДЫ КОЭФФИЦИЕНТОВ
export var TYPESCOEFFICIENTS = {};
TYPESCOEFFICIENTS.nameTables = "typescoefficients";
TYPESCOEFFICIENTS.textQuery = "CREATE TABLE [typescoefficients] (" +
	"[recid] INTEGER PRIMARY KEY ASC, " +
	"[predefined] int DEFAULT (0), " +
	"[name] TEXT);";

TYPESCOEFFICIENTS.structFields = function () {
    
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
		{ field: 'name', caption: 'Наименование', size: '100%', sortable: true, editable: { type: 'text' } },
    ];

    return structFields;
}

TYPESCOEFFICIENTS.gridObject = function () {

    var grid = {
		name: this.nameTables,
		header  : 'Виды коэффициентов на ставки платы',
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
				{ id: 'delete', type: 'button', caption: 'Удалить', icon: 'w2ui-icon-cross' },									
			],
			onClick: function (event) {
				if (event.target == 'add') {
					var struct = [];
					var row = {};
					row.recid = null;
					row.name = 'Укажите название!';
					struct.push(row);
					BD.addArray(TYPESCOEFFICIENTS, struct, GRIDFORM.confirmAdd);				
				}
				if (event.target == 'save') {
					var records = w2ui[TYPESCOEFFICIENTS.nameTables].getChanges();
					BD.edit(TYPESCOEFFICIENTS, records, GRIDFORM.confirmEdit);				
				}
				if (event.target == 'delete') {					
					var selection = w2ui[TYPESCOEFFICIENTS.nameTables].getSelection();
					var isError = false;
					for (var i = 0; i < selection.length; i++) {
						var record = w2ui[TYPESCOEFFICIENTS.nameTables].get(selection[i]);
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
							var conditions = {};
							conditions.recid = selection;
							BD.deleteWithConditions(TYPESCOEFFICIENTS, conditions, GRIDFORM.confirmDelete);						
						}
					})                    
				}			
			}
		},
		columns: this.structFields(),
	}
	return grid;
}

TYPESCOEFFICIENTS.beforeOpening = function () {

    BD.filldata(this, this.whenOpening);

}

TYPESCOEFFICIENTS.whenOpening = function (dataSet) {

    GRIDFORM.showGrid('#content', this.gridObject(), dataSet);

}

TYPESCOEFFICIENTS.init = function () {
	
	TYPESCOEFFICIENTS.beforeOpening();
	
}