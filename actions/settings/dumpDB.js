import {getConnection,getRepository} from "typeorm";
import * as FileSaver from "file-saver";
import {Forestry} from "../TypeORM/entity/forestry";
import {Subforestry} from "../TypeORM/entity/subforestry";
import {Tract} from "../TypeORM/entity/tract";
import {Publications} from "../TypeORM/entity/publications";
import {Breed} from "../TypeORM/entity/breed";

export class DumpDB {    
    constructor(store) {
        this.file_data  = undefined
        this.oldVersion = false
        this.store = store        
        this.data = {
            version:this.store.typeORM.curentVersion,
            reference:{
                forestrys:[],
                subforestrys:[],
                tracts:[],
                breeds:[],
                publications:[],
            },
            settingsMDO:{},
            typesrates:[]
        }
    }

    dump() {
        const asyncProcess = async () => {
            let repository 	= getRepository(Forestry);
           
            //лесничества
            this.data.reference.forestrys = await repository.query(`SELECT * FROM avers_forestry`)
            //участковые лесничества
            this.data.reference.subforestrys = await repository.query(`SELECT * FROM avers_subforestry`);            
            //урочища
            this.data.reference.tracts = await repository.query(`SELECT * FROM avers_tract`);
            //Породы
			this.data.reference.breeds = await repository.query(`SELECT * FROM avers_breed`);
			//Издания
			this.data.reference.publications = await repository.query(`SELECT * FROM avers_publications`);
		    //Ставки платы         
            this.data.typesrates = await repository.query(`SELECT * FROM avers_typesrates`);
            //Константы         
            this.data.settingsMDO = await repository.query(`SELECT * FROM avers_settings`);

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

    //Издания сортиментных таблиц
    restorePublications(){
        const asyncProcess = async () => { 

            let data = undefined
            if(this.file_data.reference.publications){
                data = this.file_data.reference.publications
            }  
            if(this.oldVersion){
                data.map(function(item) {
                    item.status = 0
                })
            }
            if(data){
                let repository      = getRepository(Publications);
                await repository.clear();
                await repository.save(data);
            }
            return {
                value:75,
                text:'Обновлен справочник "Сортиментные таблицы"'
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
                await repository.save(data);
            }
            return {
                value:80,
                text:'Обновлен справочник "Породы"'
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