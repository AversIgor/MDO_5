import {getConnection,getRepository} from "typeorm";
import * as FileSaver from "file-saver";
import {Forestry} from "../TypeORM/entity/forestry";
import {Subforestry} from "../TypeORM/entity/subforestry";
import {Tract} from "../TypeORM/entity/tract";
import {Breed} from "../TypeORM/entity/breed";
import {Settings} from "../TypeORM/entity/settings";
import {Typesrates} from "../TypeORM/entity/typesrates";

import * as publications  from "../reference/publications";
import * as breed  from "../reference/breed";
import * as typesrates  from "../reference/typesrates";

export class DumpDB {    
    constructor(params) {
        this.file_data  = undefined
        this.oldVersion = false
        this.getState = params.getState 
        this.dispatch = params.dispatch       
        this.data = {
            version:this.getState().typeORM.curentVersion,
            reference:{
                forestrys:[],
                subforestrys:[],
                tracts:[],
                breeds:[],
                publications:[],
            },
            settings:{},
            typesrates:[]
        }
    }

    dump() {
        const asyncProcess = async () => {
            let repositoryForestry 	= getRepository(Forestry);
           
            //лесничества
            this.data.reference.forestrys = await repositoryForestry.query(`SELECT * FROM avers_forestry`)
            //участковые лесничества
            this.data.reference.subforestrys = await repositoryForestry.query(`SELECT * FROM avers_subforestry`);            
            //урочища
            this.data.reference.tracts = await repositoryForestry.query(`SELECT * FROM avers_tract`);
            //Породы
			this.data.reference.breeds = await repositoryForestry.query(`SELECT * FROM avers_breed`);
			//Издания
            this.data.reference.publications = await repositoryForestry.query(`SELECT * FROM avers_publications`);      
            //Константы         
            this.data.settings = this.getState().settings.data;
            //Ставки платы         
            this.data.typesrates = this.getState().typesrates.data;

            let JSONdata = JSON.stringify(this.data, null, '\t');

            let blob = new Blob([JSONdata], {type: "json;charset=utf-8"});
            FileSaver.saveAs(blob, 'dump_'+this.data.version+'.json');
        }
        return asyncProcess()
    }

    readFile(event){
        const asyncProcess = async () => { 
            let result = await this.readFileAsync(event.file) 
            this.file_data = JSON.parse(result) 
            if(this.file_data.version.indexOf('5.1') + 1) {
                this.oldVersion = true
            }
            return {
                value:10,
                text:"Файл прочитан"
            }
        }
        return asyncProcess()
    }

    //лесничества
    restoreForestry(){
        const asyncProcess = async () => {
            let data = undefined
            if(this.oldVersion){
                if(this.file_data.reference.forestry){
                    data = this.file_data.reference.forestry
                    data.map(function(item) {
                        item.status = 0
                    })
                }  
            }else{
                if(this.file_data.reference.forestrys){
                    data = this.file_data.reference.forestrys
                } 
            }
            if(data){
                let repository      = getRepository(Forestry);
                await repository.clear();
                await repository.save(data);
            }
            return {
                value:20,
                text:'Обновлен справочник "Лесничества"'
            }
        }
        return asyncProcess()
    }

    //участковые лесничества
    restoreSubForestry(){
        const asyncProcess = async () => {
            let data = undefined
            if(this.oldVersion){
                if(this.file_data.reference.subforestry){
                    data = this.file_data.reference.subforestry
                    data.map(function(item) {
                        item.status = 0
                    })
                }  
            }else{
                if(this.file_data.reference.subforestrys){
                    data = this.file_data.reference.subforestrys
                } 
            }
            if(data){
                let repository          = getRepository(Subforestry);
                let repositoryForestry  = getRepository(Forestry);
                await repository.clear();
                let array = []
                for (var i = 0; i < data.length; i++) {
                    let forestry = undefined
                    if(this.oldVersion){
                        forestry = await repositoryForestry.findByIds([data[i].forestry_id]);
                    }else{
                        forestry = await repositoryForestry.findByIds([data[i].forestryId]);                        
                    }                    
                    
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
                await repository.save(array);
            }
            return {
                value:40,
                text:'Обновлен справочник "Участковые лесничества"'
            }
        }
        return asyncProcess()
    }

    //Урочища
    restoreTract(){
        const asyncProcess = async () => { 
            let data = undefined
            if(this.oldVersion){
                if(this.file_data.reference.tract){
                    data = this.file_data.reference.tract
                    data.map(function(item) {
                        item.status = 0
                    })
                }  
            }else{
                if(this.file_data.reference.tracts){
                    data = this.file_data.reference.tracts
                } 
            }
            if(data){
                let repository              = getRepository(Tract);
                let repositorySubforestry   = getRepository(Subforestry);
                await repository.clear();
                let array = []
                for (var i = 0; i < data.length; i++) {
                    let subforestry = undefined
                    if(this.oldVersion){
                        subforestry = await repositorySubforestry.findByIds([data[i].subforestry_id]);
                    }else{
                        subforestry = await repositorySubforestry.findByIds([data[i].subforestryId]);                        
                    }   
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
                await repository.save(array);
            }
            return {
                value:70,
                text:'Обновлен справочник "Урочища"'
            }
        }
        return asyncProcess()
    }


    //Породы
    restoreBreeds(){
        const asyncProcess = async () => { 

            let data = undefined
            if(this.file_data.reference.breeds){
                data = this.file_data.reference.breeds
            }  
            if(this.oldVersion){
                data.map(function(item) {
                    item.status = 0
                })
            }
            if(data){
                let repository      = getRepository(Breed);
                await repository.clear();
                for (const item of data) {
                    await this.dispatch(breed.add(item));
                }
                let breed_data = this.getState().breed.data
                for (const item of data) {
                    let obj = breed_data.find(row => row.id == item.id);                    
                    if(obj){
                        let values = {}
                        if(item.publicationId){
                            values.publication = item.publicationId;
                        }
                        if(item.tableId){
                            values.table = item.tableId;
                        }
                        if(item.tablefirewoodId){
                            values.tablefirewood = item.tablefirewoodId;
                        }
                        await this.dispatch(breed.edit(obj,values));
                    }
                }
                //await repository.save(data);
            }
            return {
                value:75,
                text:'Обновлен справочник "Породы"'
            }
        }
        return asyncProcess()
    }

    //Издания сортиментных таблиц
    restorePublications(){
        const asyncProcess = async () => { 

            let data = undefined
            if(this.file_data.reference.publications){
                data = this.file_data.reference.publications
            }  
            if(data){
                for (const item of data) {
                    await this.dispatch(publications.add(item.id));
                }
            }
            return {
                value:80,
                text:'Обновлен справочник "Сортиментные таблицы"'
            }
        }
        return asyncProcess()
    }


    //Константы
    restoreSettings(){
        const asyncProcess = async () => { 
            if(this.file_data.settings){
                let repository      = getRepository(Settings);
                await repository.save({
                    id:0,
                    data:this.file_data.settings
                });
            } 
            //старый формат
            if(this.file_data.settingsMDO){                
                let settings = this.getState().settings.data
                settings.mdo.orderRoundingValues = this.file_data.settingsMDO.orderRoundingValues
                settings.mdo.orderRoundingRates = this.file_data.settingsMDO.orderRoundingRates
                settings.mdo.distributionhalfbusiness = this.file_data.settingsMDO.distributionhalfbusiness
                settings.mdo.assessfirewoodcommonstock = this.file_data.settingsMDO.assessfirewoodcommonstock
                settings.mdo.assesswastefirewood = this.file_data.settingsMDO.assesswastefirewood
                settings.mdo.firewoodtrunkslindencountedinbark = this.file_data.settingsMDO.firewoodtrunkslindencountedinbark
                let repository      = getRepository(Settings);
                await repository.save({
                    id:0,
                    data:settings
                });
            } 

            return {
                value:85,
                text:'Обновлены настройки программы'
            }
        }
        return asyncProcess()
    }

    //Виды cтавок и коэффициенты
    restoreTypesrates(){
        const asyncProcess = async () => { 

            if(this.file_data.typesrates){
                let data = this.file_data.typesrates
                let repository              = getRepository(Typesrates);
                await repository.clear();
                let array = []
                for (var i = 0; i < data.length; i++) {
                    const element = repository.create({
                        id: data[i].id,
                        status: data[i].status,
                        predefined: data[i].predefined,
                        orderroundingrates: data[i].orderroundingrates,
                        name: data[i].name,
                        region: data[i].region,
                        coefficientsindexing: data[i].coefficientsindexing,
                        feedrates: data[i].feedrates,
                        coefficientsrangesliquidation: data[i].coefficientsrangesliquidation,
                        coefficientsformcutting: data[i].coefficientsformcutting,
                        coefficientsdamage: data[i].coefficientsdamage,
                        coefficientsrandom: data[i].coefficientsrandom,
                    })
                    array.push(element)
                }
                await repository.save(array);                
            } 

            //старый формат
            if(this.file_data.rates){
                let data = this.file_data.rates
                let repository              = getRepository(Typesrates);
                await repository.clear();
                //загрузим виды ставок
                if(data.types){                  
                    for (var i = 0; i < data.types.length; i++) {
                        let currentObject   = repository.create();                        
                        let defaultTypesrates       = typesrates.defaultTypesrates()[0]
                        defaultTypesrates.id                    = data.types[i].id
                        defaultTypesrates.orderroundingrates    = data.types[i].orderroundingrates
                        defaultTypesrates.name                  = data.types[i].name
                        defaultTypesrates.coefficientsindexing  = data.types[i].coefficientsindexing                  
                        
                        //сформируем данные по ставкам платы
                        let feedrates = []
                        if(data.feeds){
                            for (var j = 0; j < data.feeds.length; j++) {
                                let feed = data.feeds[j] 
                                if(feed.typesrates_id == defaultTypesrates.id){
                                    let newFeed = {
                                        breed: feed.breeds_id,
                                        ranktax: feed.ranktax_id,
                                        large: feed.large,
                                        average: feed.average,
                                        small: feed.small,
                                        firewood: feed.firewood,
                                    }
                                    feedrates.push(newFeed)
                                }
                            }
                        }
                        defaultTypesrates.feedrates  = feedrates
                        
                        await this.dispatch(typesrates.edit(currentObject,defaultTypesrates));
                    }
                }                
            }

            return {
                value:90,
                text:'Обновлен справочник "Виды ставок"'
            }
        }
        return asyncProcess()
    }

  
    //очень быстрая вставка
	insert (table,array){
		const asyncProcess = async () => {
			await getConnection()
				.createQueryBuilder()
				.insert()
				.into(table)
				.values(array)
				.execute();
		}
		return asyncProcess()
	}

    readFileAsync(file) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onerror = reject;
            reader.readAsText(file);
        })
    }

}