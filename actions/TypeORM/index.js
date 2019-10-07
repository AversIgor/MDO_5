import {createConnection, getRepository} from "typeorm";
import {
    ORM_COMPLETE,
    ORM_INIT
} from '../../constants/TypeORM'
import * as InitialData from "./InitialData";
import * as Migration_5_2_0_10 from "./migrations/Migration_5_2_0_10";
import * as Migration_5_2_1_0 from "./migrations/Migration_5_2_1_0";

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
import {Contactinformation} from "./entity/contactinformation";
import {Typesrates} from "./entity/typesrates";
import {Feedrates} from "./entity/feedrates";

import * as settings from '../../actions/Abris/settings';
import * as contactinformation from '../../actions/reference/contactinformation';

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
                Contactinformation,
                Typesrates,
                Feedrates,
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

            console.log(oldVersion,newVersion)
            if(oldVersion != '0.0.0.0'){
                //Блок конвертации отдельных сборок
                if(isNewVersions(oldVersion,"5.2.0.10")){
                    await Migration_5_2_0_10.creatEntities(options);
                    await Migration_5_2_0_10.renameTable(options);
                    await Migration_5_2_0_10.methodscleaningConvert(options);
                    await Migration_5_2_0_10.forestryConvert(options),
                    await Migration_5_2_0_10.subforestryConvert(options),
                    await Migration_5_2_0_10.tractConvert(options),
                    await Migration_5_2_0_10.cuttingmethodsConvert(options),
                    await Migration_5_2_0_10.publicationsConvert(options);
                    await Migration_5_2_0_10.breedsConvert(options);
                }

                if(isNewVersions(oldVersion,"5.2.1.9")){
                    //конвертация контактной информации
                    await Migration_5_2_1_0.creatEntities(options);
                    await Migration_5_2_1_0.ContactinformationConvert(options);
                    await Migration_5_2_1_0.TypesratesConvert(options);
                    await Migration_5_2_1_0.FeedratesConvert(options);
                }
                //Блок конвертации отдельных сборок - конец
            }

                        
            //Блок конвертации для всех сборок
            //для всех релизов - функции этих обработчиков безопасно запускать всегда
            if(isNewVersions(oldVersion,newVersion)){
                await InitialData.creatMainStyle(options);
                await InitialData.creatAbrisSettings(options);
                await InitialData.creatCuttingmethods(options);
                await InitialData.creatTypesrates(options);
                await InitialData.updateAbrisPrintForms(); 
                isUpdate = true;
                options.synchronize = false;
                let connection = await createConnection(options); 
                let repository = getRepository(GlobalParameters);              
                await repository.updateById(1,{versionDB:newVersion});                     
                await connection.close();
            }
            //Блок конвертации для всех сборок - конец
            return isUpdate;
        }
        return asyncProcess();
    }

    //стартовая инициализация основных настроек
    const initModels = function (dispatch) {
        const asyncProcess = async () => {
            await dispatch(settings.fill_data());//инициализация настроек абриса
            await dispatch(contactinformation.fill_data());//инициализация контактной информации            
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
                //это первый старт
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

            await initModels(dispatch);                        

            dispatch({
                type: ORM_COMPLETE,
                isUpdate: isUpdate,
            })
        }
        asyncProcess();
    }

}