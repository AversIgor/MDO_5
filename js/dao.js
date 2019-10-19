import {DESKTOP} from "./desktop";
import {CONSTANTS} from "./constants";
import {COEFFICIENTSFORMCUTTING} from "./coefficientsformcutting";
import {COEFFICIENTSRANGESLIQUIDATION} from "./coefficientsrangesliquidation";
import {COEFFICIENTSDAMAGE} from "./coefficientsdamage";
import {ALLCONSTANT} from "./allconstant";


import {store} from "../src/app";
import {getConnection,getRepository,getManager} from "typeorm";

import {Forestry} from "../actions/TypeORM/entity/forestry";
import {Subforestry} from "../actions/TypeORM/entity/subforestry";
import {Tract} from "../actions/TypeORM/entity/tract";
import {Publications} from "../actions/TypeORM/entity/publications";
import {Tables} from "../actions/TypeORM/entity/tables";
import {Breed} from "../actions/TypeORM/entity/breed";
import {Typesrates} from "../actions/TypeORM/entity/typesrates";

import {add} from "../actions/reference/publications";
import * as FileSaver from "file-saver";


//БАЗА ДАННЫХ
export var BD = {	
	curentVersion: '5.2.1.9',

	db: {},
	createTextQuery: function(){
		//запросы на первоначальное создание БД
		var TextQuery = [];
		TextQuery.push(CONSTANTS.textQuery);
		TextQuery.push(COEFFICIENTSFORMCUTTING.textQuery);
		TextQuery.push(COEFFICIENTSRANGESLIQUIDATION.textQuery);
		TextQuery.push(COEFFICIENTSDAMAGE.textQuery);

		return TextQuery

	},

	open: function () {
		this.db = openDatabase("MDO", "", "База данных МДО", 1024 * 1024 * 5);
	},

	isNewVersions: function (oldVersion,newVersion) {
		var arrayoldVersion = oldVersion.split('.');
		var arraynewVersion = newVersion.split('.');
		for (var i = 0; i < arrayoldVersion.length; i++) {
			var oldNumber = parseInt(arrayoldVersion[i]);
			var newNumber = parseInt(arraynewVersion[i]);
			if(newNumber == oldNumber) continue
			if(newNumber > oldNumber){
				return true;
			} else{
				return false;
			}
		}
	},
	
	checkTabls: function () {
	    if(this.db.version == this.curentVersion){
			DESKTOP.serialConnectionScripts();
			return;
		}
		if(this.db.version != this.curentVersion){
			if (this.db.version == "") {
				//первый запуск
				this.db.changeVersion("", this.curentVersion, function (t) {
					BD.updateTabls(BD.createTextQuery());
				});
			}else {
				DESKTOP.serialConnectionScripts();
				return;
			}
		}
	},


	// Создаем (обновляем) таблицы
	updateTabls: function (arrayText) {
		if(arrayText.length == 0){
			DESKTOP.serialConnectionScripts();
			return
		}
	    this.db.transaction(function (tx) {
            var textQuery = arrayText[0];
            tx.executeSql(textQuery, [], function (tx, results) {
                arrayText.splice(0, 1);
                if (arrayText.length != 0) {
                    BD.updateTabls(arrayText);
                } else {
                    DESKTOP.serialConnectionScripts();
                }
            },
            function (tx, error) {
                console.log(error);
            });          
        });		
	},
	
	//запись массива объектов одной транзакцией
	addArray: function (nameSpase, struct, callback) {	    
		this.db.transaction(function (tx) {
			var iterator = 0;
			for (var i = 0; i < struct.length; i++) {			
				var param = [];//для параметров		

				var textQuery = "INSERT INTO " + nameSpase.nameTables + " (";
				//собираем свойства
				for (var property in struct[i]) {
					textQuery = textQuery + property + ",";
					var znach = struct[i][property];
					if(znach == true){
						znach = 1;
					} 
					if(znach == false){
						znach = 0;
					} 			
					param.push(znach);
				}
				textQuery = textQuery.substring(0, textQuery.length - 1);
				textQuery = textQuery + ") VALUES (";
				for (var property in struct[i]) {
					textQuery = textQuery + "?,";
				}	
				textQuery = textQuery.substring(0, textQuery.length - 1);
				textQuery = textQuery + ")";
				tx.executeSql(textQuery, param, function (tx, results) {
					struct[iterator].recid = results.insertId;						
					iterator = iterator+1;
					if(iterator == struct.length){
						if(callback){
					    	callback(nameSpase, struct);
						}
					}
				});				
			}	
		})	
	},
	
	// функция изменения записей
	edit: function (nameSpase, struct, callback) {
	    
		if (Object.keys(struct).length == 0) {
			if(callback){
				callback(nameSpase);
			}
            return;
        }	
		
		var param = [];//для параметров
		
		var row = struct[0];

		var textQuery = "UPDATE " + nameSpase.nameTables + " SET ";
        //собираем свойства
        for (var property in row) {
            if (property == 'recid') {
                continue;
            }
            textQuery = textQuery + property + "=?,";			
			var znach = row[property];

			if(znach === true){
				znach == 1;
			} 
			if(znach === false){
				znach = 0;
			}

			param.push(znach);
        }
        textQuery = textQuery.substring(0, textQuery.length - 1);
        param.push(row.recid);
        textQuery = textQuery + " WHERE recid=?";
        struct.splice(0, 1);

		this.db.transaction(function (tx) {
            tx.executeSql(textQuery, param, BD.edit(nameSpase, struct, callback));
        });
	},
	
	// функция удаления записей по параметрам
	deleteWithConditions: function (nameSpase, conditions, callback) {
	     this.db.transaction(function (tx) {		
            var textQuery = 'DELETE FROM ' + nameSpase.nameTables;			
			var param = [];			
			if(Object.keys(conditions).length != 0){
				textQuery = textQuery + " WHERE ";	
				for (var property in conditions) {
					textQuery = textQuery + property + " in (";
					var q = "";
					for (var i = 0; i < conditions[property].length; i++) {
						q += (q == "" ? "" : ", ") + "?";
						param.push(conditions[property][i]);
					}
					textQuery = textQuery + q + ") AND ";  
				}
				textQuery = textQuery.substring(0, textQuery.length - 4);	
			}
            tx.executeSql(textQuery, param, function (tx, results) {              
                callback.call(nameSpase, param);
            },
            function (tx, error) {
                console.log(error);
            });
        });
	},
	
	// функция получения всех записей
	filldata: function (nameSpase, callback) {
	    var data = [];
        this.db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM ' + nameSpase.nameTables, [], function (tx, results) {
				for (var i = 0; i < results.rows.length; i++) {
					var row = {};
					for (var property in results.rows.item(i)) {
						row[property] = results.rows.item(i)[property];
					}
					data.push(row);
				}
				callback.call(nameSpase, data);
			},
			function (tx, error) {
				console.log(error);
			});            
        });		
	},
	
	// функция заполнения коллекций
	fillList: function (nameSpase, list, arrayField,callback,context) {
	    callback = callback || null;
	    this.db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM ' + nameSpase.nameTables, [], function (tx, results) {
                for (var i = 0; i < results.rows.length; i++) {
				
					var row = {};
					var isNull = false;
                    for (var property in results.rows.item(i)) {						
					
                        if (arrayField.indexOf(property) != -1) {
                            if (property == "recid") {
                                row.id = results.rows.item(i)[property];
                            } else if (property == "name") {
                                row.text = results.rows.item(i)[property];
                            } else {
                                row[property] = results.rows.item(i)[property];
                            }
                        }
                    }
					if(isNull == false){ 
						list.push(row);				
					}
                }
				if(callback != null){
					if(context){
						callback.call(context, list);						
					}else {
						callback(list);						
					}
				}
            },
			function (tx, error) {
			    console.log(error);
			});
        });
	},
	
	// функция получения всех записей по условиям
	fillListWithConditions: function (nameSpase,arrayField,conditions,callback,context) {
		var list = [];
		this.db.transaction(function (tx) {
			var textQuery = 'SELECT DISTINCT ';
			for (var i = 0; i < arrayField.length; i++) {			
				textQuery = textQuery+arrayField[i]+',';
			}
			textQuery = textQuery.substring(0, textQuery.length - 1);
			textQuery = textQuery + ' FROM '+ nameSpase.nameTables;		
			
			var param = [];	
			if(Object.keys(conditions).length != 0){
				textQuery = textQuery + " WHERE ";	
				for (var property in conditions) {
					textQuery = textQuery + property + " in (";
					var q = "";
					for (var i = 0; i < conditions[property].length; i++) {
						q += (q == "" ? "" : ", ") + "?";
						param.push(conditions[property][i]);
					}
					textQuery = textQuery + q + ") AND ";  
				}
				textQuery = textQuery.substring(0, textQuery.length - 4);	
			}
			tx.executeSql(textQuery, param, function (tx, results) {
				for (var i = 0; i < results.rows.length; i++) {
						
					var row = {};
					var isNull = false;
					for (var property in results.rows.item(i)) {						

						if (arrayField.indexOf(property) != -1) {
							if (property == "recid") {
								row.id = results.rows.item(i)[property];
							} else if (property == "name") {
								row.text = results.rows.item(i)[property];
							} else {
								row[property] = results.rows.item(i)[property];
							}
						}
					}
					if(isNull == false){ 
						list.push(row);					
					}
				}
				if(context){
					callback.call(context,list)

				}else {
					callback(list);
				}

			},
			function (tx, error) {
				console.log(error);
			});
		});
	},	
	
	// функция проверки наличия записи
	checkRecord: function (nameSpase,struct,callback) {
		this.db.transaction(function (tx) {
			var textQuery = 'SELECT recid FROM ' + nameSpase.nameTables + " WHERE ";		
		
			var param = [];//для параметров			
		
			for (var property in struct[0]) {
				textQuery = textQuery + property + "=? AND ";
				param.push(struct[0][property]);
			}
			textQuery = textQuery.substring(0, textQuery.length - 4);
			
            tx.executeSql(textQuery,param, function (tx, results) {
				if(results.rows.length != 0){
					struct[0].recid = results.rows.item(0).recid;
				}else{
					struct[0].recid = null;					
				}	
				callback(nameSpase, struct);
			},
			function (tx, error) {
				console.log(error);
			});            
        });
	},

	//РЕЗЕРВНОЕ КОПИРОВАНИЕ БД
	
	dumpData: function () {

		const asyncProcess = async () => {

			let entityManager = getManager();

			let data = {
				version:BD.curentVersion,
				reference:{
					forestry:[],
					subforestry:[],
					tract:[],
					publications:[],
				},
				settingsMDO:{},
				typesrates:[]
			}

			//лесничества
			let repository 	= getRepository(Forestry);
			data.reference.forestry = await repository.find()

			//участковые лесничества
			data.reference.subforestry = await repository.query(`SELECT * FROM avers_subforestry`);

			//урочища
			data.reference.tract = await repository.query(`SELECT * FROM avers_tract`);

			//Издания
			repository 	= getRepository(Publications);
			data.reference.publications = await repository.find();

		   //Ставки платы
		   repository 	= getRepository(Typesrates);
		   data.typesrates = await repository.find()

           let settingsMDO = {}
           //Настройки МДО
           let rawData = await entityManager.query('SELECT * FROM constants');
           for (var i = 0; i < rawData.length; i++) {
               settingsMDO = {
                   orderRoundingValues:rawData[i].orderRoundingValues,
                   orderRoundingRates:rawData[i].orderRoundingRates,
                   distributionhalfbusiness:rawData[i].distributionhalfbusiness,
                   assessfirewoodcommonstock:rawData[i].assessfirewoodcommonstock,
                   assesswastefirewood:rawData[i].assesswastefirewood,
                   firewoodtrunkslindencountedinbark:rawData[i].firewoodtrunkslindencountedinbark,
                   barklindenindividualreserves:rawData[i].barklindenindividualreserves,
                   publication:rawData[i].publication,
                   foresttax:rawData[i].foresttax,
               };
           }
           data.settingsMDO = settingsMDO

           let JSONdata = JSON.stringify(data, null, '\t');

           var blob = new Blob([JSONdata], {type: "json;charset=utf-8"});
           FileSaver.saveAs(blob, 'dump_'+BD.curentVersion+'.json');

		}
		return asyncProcess();
	},

	restoreDB: function () {
		var input = $("<input/>", {
			style:"display:none",
			type:"file",
			accept:".json"
		}).appendTo("body");
		input.unbind('change');
		input.change(function(evt) {
			var file = this.files;
			if (file.length == 1){
				var fileReader = window.FileReader ? new FileReader() : null;
				fileReader.addEventListener("loadend", function(e){
					var data = JSON.parse(e.target.result);
					BD.fillObjects(data)
					input.remove()
				}, false);
				fileReader.readAsText(file[0]);
			}
		});
		input.trigger('click');
	},

	fillObjects: function (data){
		const asyncProcess = async () => {
			if(data.reference.forestry){
				await BD.fillForestry(data.reference.forestry)
				webix.message({ type:"info", text:'Обновлен справочник "Лесничества"'});
			}
			if(data.reference.subforestry){
				await BD.fillSubforestry(data.reference.subforestry)
				webix.message({ type:"info", text:'Обновлен справочник "Участковые лесничества"'});
			}
			if(data.reference.tract){
				await BD.fillTract(data.reference.tract)
				webix.message({ type:"info", text:'Обновлен справочник "Урочища"'});
			}
			if(data.reference.breeds){
				await BD.fillBreeds(data.reference.breeds)
				webix.message({ type:"info", text:'Обновлен справочник "Породы"'});
			}
			if(data.reference.publications){
				await BD.fillPublications(data.reference.publications)
				webix.message({ type:"info", text:'Обновлен справочник "Сортиментные таблицы"'});
			}
			if(data.settingsMDO){
				await BD.fillSettingsMDO(data.settingsMDO)
				webix.message({ type:"info", text:'Обновлены настройки параметров МДО'});
			}
			if(data.typesrates){
				await BD.fillTypesRates(data.typesrates)
				webix.message({ type:"info", text:'Обновлен справочник "Ставки платы"'});
			}
			webix.message({ type:"error", text:'Обновление данных завершено!'});
		}
		asyncProcess()

	},

	//очень быстрая вставка
	insert: function (table,array){
		const asyncProcess = async () => {
			await getConnection()
				.createQueryBuilder()
				.insert()
				.into(table)
				.values(array)
				.execute();
		}
		return asyncProcess()
	},


	fillForestry: function (data){
		const asyncProcess = async () => {
			let repository      = getRepository(Forestry);
			await repository.clear();
			await repository.save(data);
		}
		return asyncProcess()
	},

	fillSubforestry: function (data){
	const asyncProcess = async () => {
		let repository      	= getRepository(Subforestry);
		let repositoryForestry  = getRepository(Forestry);
		await repository.clear();
		let array = []
		for (var i = 0; i < data.length; i++) {
			if(array.length > 150){
				await this.insert(Subforestry,array)
				array.splice(0,array.length);
			}
			const forestry = await repositoryForestry.findByIds([data[i].forestryId]);
			if(forestry.length>0){
				const element = repository.create({
					id: data[i].id,
					forestry: forestry[0],
					name: data[i].name,
					fullname: data[i].fullname,
					cod: data[i].cod,
				})
				array.push(element)
			}
		}
		await this.insert(Subforestry,array)
	}
	return asyncProcess()
},

	fillTract: function (data){
		const asyncProcess = async () => {
			let repository      	= getRepository(Tract);
			let repositorySubforestry  = getRepository(Subforestry);
			await repository.clear();
			let array = []
			for (var i = 0; i < data.length; i++) {
				if(array.length > 150){
					await this.insert(Tract,array)
					array.splice(0,array.length);
				}
				const subforestry = await repositorySubforestry.findByIds([data[i].subforestryId]);
				if(subforestry.length>0){
					const element = repository.create({
						id: data[i].id,
						subforestry: subforestry[0],
						name: data[i].name,
						fullname: data[i].fullname,
					})
					array.push(element)
				}
			}
			await this.insert(Tract,array)
		}
		return asyncProcess()
	},

	fillBreeds: function (data){
		const asyncProcess = async () => {
			let repository      	= getRepository(Breed);
			await repository.clear();
			await repository.save(data);
		}
		return asyncProcess()
	},

	fillPublications: function (data){
		const asyncProcess = async () => {
			let repository      	= getRepository(Tables);
			await repository.clear();
			repository      	= getRepository(Publications);
			await repository.clear();
			for (var i = 0; i < data.length; i++) {
				await store.dispatch(add(data[i].id));
			}
		}
		return asyncProcess()
	},

	fillSettingsMDO: function (data){
		var struct = [];
		var row = {};
		row.recid = 1;
		row.orderRoundingValues = data.orderRoundingValues;
		row.orderRoundingRates = data.orderRoundingRates;
		row.distributionhalfbusiness = data.distributionhalfbusiness;
		row.assessfirewoodcommonstock = data.assessfirewoodcommonstock;
		row.assesswastefirewood = data.assesswastefirewood;
		row.firewoodtrunkslindencountedinbark = data.firewoodtrunkslindencountedinbark;
		row.barklindenindividualreserves = data.barklindenindividualreserves;
		row.publication = data.publication;
		row.foresttax = data.foresttax;
		struct.push(row);
		BD.edit(CONSTANTS, struct, ALLCONSTANT.get);
	},

	fillTypesRates: function (data){
		const asyncProcess = async () => {
			let repository      	= getRepository(Typesrates);
			await repository.clear();
			await repository.save(data);
		}
		return asyncProcess()
	},
};