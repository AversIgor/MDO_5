import {getConnection,getRepository} from "typeorm";
import * as FileSaver from "file-saver";
import {Forestry} from "../TypeORM/entity/forestry";
import {Subforestry} from "../TypeORM/entity/subforestry";
import {Tract} from "../TypeORM/entity/tract";

export class DumpDB {
    constructor(store) {
        this.store = store
        this.data = {
            version:this.store.typeORM.curentVersion,
            reference:{
                forestry:[],
                subforestry:[],
                tract:[],
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
            this.data.reference.forestry = await repository.query(`SELECT * FROM avers_forestry`)
            //участковые лесничества
            this.data.reference.subforestry = await repository.query(`SELECT * FROM avers_subforestry`);            
            //урочища
			this.data.reference.tract = await repository.query(`SELECT * FROM avers_tract`);
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

    restore(event){
        const asyncProcess = async () => { 
            let result = await this.readFileAsync(event.file) 
            let data = JSON.parse(result) 
            let oldVersion = false
            if(data.version.indexOf('5.1') + 1) {
                oldVersion = true
            }
            // лесничества
            if(data.reference.forestry){
				await this.fillForestry(data.reference.forestry,oldVersion)
				webix.message({ type:"info", text:'Обновлен справочник "Лесничества"'});
            }  
            //участковые лесничества
            if(data.reference.subforestry){
                await this.fillSubforestry(data.reference.subforestry,oldVersion)
                webix.message({ type:"info", text:'Обновлен справочник "Участковые лесничества"'});
            } 
            //Урочища
            if(data.reference.tract){
                await this.fillTract(data.reference.tract,oldVersion)
                webix.message({ type:"info", text:'Обновлен справочник "Урочища"'});
            } 

            return data
        }
        return asyncProcess()
    }

    fillForestry(forestry,oldVersion){
		const asyncProcess = async () => {
			let repository      = getRepository(Forestry);
            await repository.clear();
            if(oldVersion){
                forestry.map(function(item) {
                    item.status = 0
                })
            }
            await repository.save(forestry);		
		}
		return asyncProcess()
    }
    
    fillSubforestry(subforestry,oldVersion){
        const asyncProcess = async () => {
            let repository      	= getRepository(Subforestry);
            let repositoryForestry  = getRepository(Forestry);
            await repository.clear();
            let array = []
            for (var i = 0; i < subforestry.length; i++) {
                if(array.length > 150){
                    //await this.insert(Subforestry,array)
                    await repository.save(array);
                    array.splice(0,array.length);
                }

                let forestry = undefined
                if(oldVersion){
                    forestry = await repositoryForestry.findByIds([subforestry[i].forestry_id]);
                }else{
                    forestry = await repositoryForestry.findByIds([subforestry[i].forestryId]);
                }                
                if(forestry.length>0){
                    const element = repository.create({                        
                        id: subforestry[i].id,
                        forestry: forestry[0],
                        name: subforestry[i].name,
                        fullname: subforestry[i].fullname,
                        cod: subforestry[i].cod,
                        status:0
                    })
                    array.push(element)
                }
            }
            if(array.length > 0){
                await repository.save(array);
                //await this.insert(Subforestry,array)
            }
        }
        return asyncProcess()
    }

    fillTract(tract,oldVersion){
        const asyncProcess = async () => {
            let repository      	   = getRepository(Tract);
            let repositorySubforestry  = getRepository(Subforestry);
            await repository.clear();
            let array = []
            for (var i = 0; i < tract.length; i++) {
                if(array.length > 150){
                    //await this.insert(Tract,array)
                    await repository.save(array);
                    array.splice(0,array.length);
                }
                let subforestry = undefined
                if(oldVersion){
                    subforestry = await repositorySubforestry.findByIds([tract[i].subforestry_id]);
                }else{
                    subforestry = await repositorySubforestry.findByIds([tract[i].subforestryid]);
                }   
                if(subforestry.length>0){
                    const element = repository.create({
                        id: tract[i].id,
                        subforestry: subforestry[0],
                        name: tract[i].name,
                        fullname: tract[i].fullname,
                        cod: tract[i].cod,
                        status:0
                    })
                    array.push(element)
                }
            }
            if(array.length > 0){
                //await this.insert(Tract,array)
                await repository.save(array);
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