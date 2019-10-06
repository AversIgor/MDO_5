import {BD} from "./dao";
import {GRIDFORM} from "./gridform";
import {CONSTANTS} from "./constants";
import {ENUMERATIONS} from "./enumerations";


import {store} from "../src/app";
import * as breed from "../actions/reference/breed";


//СТАВКИ ПЛАТЫ
export var FEEDRATES = {};
FEEDRATES.nameTables = "feedrates";
FEEDRATES.textQuery = "CREATE TABLE [feedrates] (" +
	"[recid] INTEGER PRIMARY KEY ASC, " +
	"[typesrates_id] INTEGER, " +
	"[breeds_id] INTEGER, " +
	"[ranktax_id] INTEGER, " +
	"[large] FLOAT, " +
	"[average] FLOAT, " +
	"[small] FLOAT, " +
	"[firewood] FLOAT);";


FEEDRATES.breeds = [];
FEEDRATES.typesrates = [];
FEEDRATES.foresttax = [];

FEEDRATES.foresttax_Name = 0;
FEEDRATES.ratesArray = [];
FEEDRATES.typesrates_id = 1;//по умолчанию ставки федерального уровня

//Структура полей
FEEDRATES.structFields = function () {
    
	var structFields = [
		{ field: 'recid', caption: '№', size: '3%', sortable: true},	
		{ 
			field: 'typesrates_id', caption: 'Вид ставки', size: '30%', sortable: true, resizable: true, hidden:true,
			editable: { type: 'select', items: FEEDRATES.typesrates, showAll: true },
		    render: function (record, index, col_index) {
		        var html = '';
		        for (var p in FEEDRATES.typesrates) {
		            if (FEEDRATES.typesrates[p].id == this.getCellValue(index, col_index)) html = FEEDRATES.typesrates[p].text;
		        }
		        return html;
		    }		
		},
        {
            field: 'breeds_id', caption: 'Порода', size: '30%', sortable: true, resizable: true, 
            editable: { type: 'select', items: FEEDRATES.breeds, showAll: true },
        	render: function (record, index, col_index) {
        		var html = '';
        		for (var p in FEEDRATES.breeds) {
        		    if (FEEDRATES.breeds[p].id == this.getCellValue(index, col_index)) html = FEEDRATES.breeds[p].text;
        		}
        		return html;
        	}
        },
        {
            field: 'ranktax_id', caption: 'Разряд такс', size: '12%', sortable: true, resizable: true, 
            editable: { type: 'select', items: ENUMERATIONS.rankTax, showAll: true },
            render: function (record, index, col_index) {
                var html = '';
                for (var p in ENUMERATIONS.rankTax) {
                    if (ENUMERATIONS.rankTax[p].id == this.getCellValue(index, col_index)) html = ENUMERATIONS.rankTax[p].text;
                }
                return html;
            }
        },
		{ field: 'large', caption: 'Крупная, руб', size: '10%', sortable: true, editable: { type: 'real' }, render: 'number:2' },
		{ field: 'average', caption: 'Средняя, руб', size: '10%', sortable: true, editable: { type: 'real' }, render: 'number:2' },
		{ field: 'small', caption: 'Мелкая, руб', size: '10%', sortable: true, editable: { type: 'real' }, render: 'number:2' },
		{ field: 'firewood', caption: 'Дрова, руб', size: '10%', sortable: true, editable: { type: 'real' }, render: 'number:2' },
    ];

    return structFields;
}

FEEDRATES.gridObject = function () {

    var grid = {
        name: this.nameTables,
        header: 'Значения ставок платы',
        show: {
            header: false,
            toolbar: true,
            footer: true,
            toolbarSearch: false,
			toolbarReload  : false,
        },
        toolbar: {
            items: [
                { id: 'add', type: 'button', caption: 'Добавить', icon: 'w2ui-icon-plus' },
                { id: 'save', type: 'button', caption: 'Сохранить', icon: 'w2ui-icon-check' },
                { id: 'delete', type: 'button', caption: 'Удалить', icon: 'w2ui-icon-cross' },
				{ type: 'break', id: 'break1' },
				{ type: 'menu', id: 'foresttax', caption: 'Заполнить', count: FEEDRATES.foresttax.length, items: FEEDRATES.foresttax },
                //{ type: 'spacer' },
                //{ type: 'menu', id: 'typesrates', caption: 'Вид ставки: ', count: '', items: FEEDRATES.typesrates },
            ],
            onClick: function (event) {
                if ((event.target == 'add') && (w2ui[TYPESRATES.nameTables].getSelection().length != 0)) {
					var struct = [];
					var row = {};
					row.recid = null;
					row.typesrates_id = w2ui[TYPESRATES.nameTables].getSelection()[0];//w2ui[FEEDRATES.nameTables].toolbar.get('typesrates').curentID;
					struct.push(row);
					BD.addArray(FEEDRATES, struct, GRIDFORM.confirmAdd);
                }
                if (event.target == 'save') {
                    var records = w2ui[FEEDRATES.nameTables].getChanges();
                    BD.edit(FEEDRATES, records, GRIDFORM.confirmEdit);
                }
                if (event.target == 'delete') {
                    w2confirm('Удалить выбранные строки?', function (btn) {
                        if (btn == 'Yes') {
							let selection = w2ui[FEEDRATES.nameTables].getSelection();
							var conditions = {};
							conditions.recid = selection;
							BD.deleteWithConditions(FEEDRATES, conditions, GRIDFORM.confirmDelete);
                        }
                    })
                }				
                /*if (event.target.substring(0, 10) == 'typesrates') {
                    if ('subItem' in event) {
                        GRIDFORM.setSelection(FEEDRATES, 'typesrates', 'typesrates_id', event.subItem);
                    }
                }*/
                if (event.target.substring(0, 9) == 'foresttax') {
                    if ('subItem' in event) {
					
						w2confirm('Перезаполнить ставки по "'+event.subItem.text+'" ?', function (btn) {
							if ((btn == 'Yes') && (w2ui[TYPESRATES.nameTables].getSelection().length != 0)) {
								FEEDRATES.foresttax_Name = event.subItem.text;
								FEEDRATES.ratesArray.splice(0, FEEDRATES.ratesArray.length); 
								FEEDRATES.typesrates_id = w2ui[TYPESRATES.nameTables].getSelection()[0];//w2ui[FEEDRATES.nameTables].toolbar.get('typesrates').curentID;
								FEEDRATES.updateRates();
								if(FEEDRATES.typesrates_id == 1){
									//добавим этот район в константу если это федеральные ставки
									var struct = [];
									var row = {};
									row.recid = 1;
									row.foresttax = event.subItem.id;
									struct.push(row);
									BD.edit(CONSTANTS, struct, function () {});			
								}
							}
						})
                    }
                }
            }
        },
        columns: this.structFields(),
    }
    return grid;
}

FEEDRATES.updateRates = function () {
    
	var conditions = {};
    var row = [FEEDRATES.typesrates_id];
    conditions.typesrates_id = row;
    BD.deleteWithConditions(FEEDRATES, conditions, this.getXML);
	
}

FEEDRATES.getXML = function (conditions) {

	jQuery.get('resources/Payment_rates.xml', {},function(temp){
		FEEDRATES.readRatesXML(temp);
	}, 'xml')
	
}

FEEDRATES.readRatesXML = function (xml) {
    
    $(xml).find("Description").children().each(function () {
		if($(this).attr("Name") == FEEDRATES.foresttax_Name){
			
			$(this).children().each(function () {
				
				var breeds_id = null;
				for (var i = 0; i < FEEDRATES.breeds.length; i++) {
					if(FEEDRATES.breeds[i].text == $(this).attr("Name")){
						breeds_id = FEEDRATES.breeds[i].id;
						break;
					}
				}
				if(breeds_id != null){
					$(this).children().each(function () {
						var data = {};
						data.breeds_id = breeds_id;
						data.typesrates_id = FEEDRATES.typesrates_id;
						data.ranktax_id = parseFloat($(this).attr("Category"));
						data.large = parseFloat($(this).attr("Large").replace(",","."));
						data.average = parseFloat($(this).attr("Average").replace(",","."));
						data.small = parseFloat($(this).attr("Small").replace(",","."));
						data.firewood = parseFloat($(this).attr("Firewood").replace(",","."));
						FEEDRATES.ratesArray.push(data);
					})
				}
            })
		}
    });
	BD.addArray(FEEDRATES, FEEDRATES.ratesArray, FEEDRATES.readRatesXMLComplit);
	
}

FEEDRATES.readRatesXMLComplit = function () {
	
	BD.filldata(FEEDRATES, FEEDRATES.whenOpening);

}

FEEDRATES.beforeOpening = function () {

	FEEDRATES.breeds.splice(0, FEEDRATES.breeds.length); 
	FEEDRATES.typesrates.splice(0, FEEDRATES.typesrates.length); 
	FEEDRATES.foresttax.splice(0, FEEDRATES.foresttax.length);
	FEEDRATES.fillbreeds();
    BD.fillList(TYPESRATES, this.typesrates, ['recid', 'name']);
	//BD.fillList(FORESTTAX, this.foresttax, ['recid', 'name']);

    BD.filldata(this, this.whenOpening);

}

FEEDRATES.fillbreeds = function () {
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
			FEEDRATES.breeds.push(row);
		}
	}
	FEEDRATES.breeds.splice(0,FEEDRATES.breeds.length);
	return asyncProcess(breed);
}

FEEDRATES.whenOpening = function (dataSet) {

    GRIDFORM.showGrid('#feedrates', this.gridObject(), dataSet);

	if(w2ui[TYPESRATES.nameTables] == undefined) return;
	
	if(w2ui[TYPESRATES.nameTables].getSelection().length == 0) {
		w2ui[FEEDRATES.nameTables].search('typesrates_id', -1);
	} else {
		w2ui[FEEDRATES.nameTables].search('typesrates_id', w2ui[TYPESRATES.nameTables].getSelection()[0]);
	}
}

FEEDRATES.init = function () {
	
	FEEDRATES.beforeOpening();
	
}