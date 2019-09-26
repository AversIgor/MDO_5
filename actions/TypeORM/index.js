import {createConnection, getRepository} from "typeorm";
import {
    ORM_COMPLETE,
    ORM_INIT
} from '../../constants/TypeORM'
import * as defaultMigration from "./migrations/Migration_5_1_0_0";
import {Migration_5_2_0_4} from "./migrations/Migration_5_2_0_4";
import {Migration_5_2_1_0} from "./migrations/Migration_5_2_1_0";

import {GlobalParameters} from "./entity/globalParameters";
import {Methodscleanings} from "./entity/methodscleanings";
import {Styles} from "./entity/styles";
import {Abrissettings} from "./entity/abrissettings";
import {Forestry} from "./entity/forestry";
import {Subforestry} from "./entity/subforestry";
import {Tract} from "./entity/tract";
import {Cuttingmethods} from "./entity/cuttingmethods";
import {Publications} from "./entity/publications";
import {Tables} from "./entity/tables";
import {Breed} from "./entity/breed";
import {Abrisprintforms} from "./entity/abrisprintforms";
import {Constants} from "./entity/constants";


import {fill_data} from '../../actions/Abris/settings';

import {updatePredefinedAbrisPrintForms} from "../../actions/reference/abrisprintforms";


export function init() {

    var options = {
        type: "websql",
            database: "MDO",
            version: "",
            description: "База данных МДО",
            size: 1024 * 1024 * 5,
            synchronize: false,
            entityPrefix:'avers_',
            entities: [
                GlobalParameters,
                Methodscleanings,
                Styles,
                Abrissettings,
                Forestry,
                Subforestry,
                Tract,
                Cuttingmethods,
                Publications,
                Tables,
                Breed,
                Abrisprintforms,
                Constants,
            ]
    }


    const isNewVersions = function (oldVersion,newVersion) {
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
    }

    const checkVersions = function (oldVersion,newVersion) {

        const asyncProcess = async () => {
            
            let isUpdate = false;

            //Блок конвертации отдельных сборок
            if(isNewVersions(oldVersion,"5.2.0.10")){
                await Migration_5_2_0_4(options);
            }

            if(isNewVersions(oldVersion,"5.2.1.0")){
                await Migration_5_2_1_0(options);
            }

            //Блок конвертации отдельных сборок - конец

            //Блок конвертации для всех сборок
            //для всех релизов - функции этих обработчиков безопасно запускать всегда
            if(isNewVersions(oldVersion,newVersion)){
                await defaultMigration.renameTable(options);
                await defaultMigration.methodscleaningConvert(options);
                await defaultMigration.forestryConvert(options),
                await defaultMigration.subforestryConvert(options),
                await defaultMigration.tractConvert(options),
                await defaultMigration.cuttingmethodsConvert(options),
                await defaultMigration.creatMainStyle(options);
                await defaultMigration.creatAbrisSettings(options);
                await defaultMigration.creatCuttingmethods(options);
                await defaultMigration.publicationsConvert(options);
                await defaultMigration.breedsConvert(options);
                await defaultMigration.constantsConvert(options);
            }
            //Блок конвертации для всех сборок - конец           
            
            if(isNewVersions(oldVersion,newVersion)){
                isUpdate = true;
                options.synchronize = false;
                let connection = await createConnection(options);
                let repository = getRepository(GlobalParameters);
                await repository.updateById(1,{versionDB:newVersion});
                await updatePredefinedAbrisPrintForms();//обновление печатных форм                
                await connection.close();
            }
            return isUpdate;
        }
        return asyncProcess();
    }

    return (dispatch,getState) => {

        const asyncProcess = async () => {
            dispatch({
                type: ORM_INIT
            })
            var connection = await createConnection(options);
            let globalParametersRepository = getRepository(GlobalParameters);
            var globalParameters;
            try {
                var arrayGlobalParameters = await globalParametersRepository.find(); 
                if(arrayGlobalParameters.length == 0){
                    var rowGlobalParameters = {
                        recid: 1,
                        versionDB: getState().typeORM.curentVersion
                    };
                    globalParameters = await globalParametersRepository.save(rowGlobalParameters);
                }else{
                    globalParameters = arrayGlobalParameters[0];
                }
            } catch (error) {
                //это обновление на 5.1.1.0 или первый старт
                //закроем существующее соединение
                await connection.close();
                //откроем соединение на создание таблицы globalParameters
                options.synchronize = true;
                connection = await createConnection(options);
                let globalParametersRepository = getRepository(GlobalParameters);
                var rowGlobalParameters = {
                    id: 1,
                    versionDB: '0.0.0.0'
                };
                globalParameters = await globalParametersRepository.save(rowGlobalParameters);
            }
            await connection.close();

            let isUpdate = await checkVersions(globalParameters.versionDB,getState().typeORM.curentVersion);

            options.synchronize     = false;
            connection = await createConnection(options);

                        
            await dispatch(fill_data());//инициализация настроек абриса
            dispatch({
                type: ORM_COMPLETE,
                isUpdate: isUpdate,
            })
        }
        asyncProcess();
    }

}



