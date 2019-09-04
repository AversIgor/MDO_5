import {BD} from "./dao";
import {GRIDFORM} from "./gridform";

//ЛЕСОТАКСОВЫЕ РАЙОНЫ
export var FORESTTAX = {};
FORESTTAX.nameTables = "foresttax";
FORESTTAX.textQuery = "CREATE TABLE [foresttax] (" +
    "[recid] INTEGER PRIMARY KEY ASC, " +
    "[name] TEXT);";
//Структура полей
FORESTTAX.structFields = function () {
    
	var structFields = [
		{ field: 'recid', caption: 'Код', size: '5%', sortable: true },		
		{ field: 'name', caption: 'Наименование', size: '100%', sortable: true },
    ];

    return structFields;
}

FORESTTAX.gridObject = function () {

    var grid = {
        name: this.nameTables,
        header: 'Лесотаксовые районы',
        show: {
            header: true,
            toolbar: true,
            footer: true,
			toolbarSearch: false,
        },
        toolbar: {
            items: [
                { id: 'save', type: 'button', caption: 'Загрузить (обновить) ставки', icon: 'w2ui-icon-check' },
            ],
            onClick: function (event) {
                if (event.target == 'select') {
                    selection = w2ui[FORESTTAX.nameTables].getSelection();
                }
            }
        },
		onDblClick: function(event) {
			//console.log(event);
		}, 
        columns: this.structFields(),
    }
    return grid;
}

FORESTTAX.beforeOpening = function () {

    BD.filldata(this, this.whenOpening);

}

FORESTTAX.whenOpening = function (dataSet) {

    GRIDFORM.showGrid('#grid', this.gridObject(), dataSet);

}

FORESTTAX.init = function () {
	
	FORESTTAX.beforeOpening();
	
}
