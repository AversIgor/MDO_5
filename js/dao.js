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
           /*let rawData = await entityManager.query('SELECT * FROM constants');
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
           data.settingsMDO = settingsMDO*/

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


	fillTypesRates: function (data){
		const asyncProcess = async () => {
			let repository      	= getRepository(Typesrates);
			await repository.clear();
			await repository.save(data);
		}
		return asyncProcess()
	},
};