import {BD} from "../../../js/dao";
import {CONSTANTS} from "../../../js/constants";


import {
    PUBLICATIONS_FILL_SUCCESS,
    PUBLICATIONS_ADD,
    PUBLICATIONS_DEL,
    PUBLICATIONS_EDIT,
    PUBLICATIONS_SORT,
    PUBLICATIONS_FILL_lISTPUBLICATION
} from '../../../constants/reference/publications'
import {getRepository,getConnection} from "typeorm";

import {Publications} from "../../TypeORM/entity/publications";
import {Tables} from "../../TypeORM/entity/tables";
import * as tables from "../../reference/tables";
import * as breed from "../../reference/breed";

let publicationsResources = '../../../resources/'

const fieldsname = {
    height:'СТ_РазрядВысот',
    step:'СТ_СтупеньТолщины',
    large:'СТ_Крупная',
    average1:'СТ_Средняя1',
    average2:'СТ_Средняя2',
    small:'СТ_Мелкая',
    technical_b:'СТ_ТехнологическоеСырьеОтДеловыхСтволов',
    firewood_b:'СТ_ДроваОтДеловыхСтволов',
    waste_b:'СТ_ОтходыОтДеловыхСтволов',
    technical_f:'СТ_ТехнологическоеСырьеОтДровяныхСтволов',
    firewood_f:'СТ_ДроваОтДровяныхСтволов',
    waste_f:'СТ_ОтходыОтДровяныхСтволов',
    bark:'СТ_Кора'
};

export function getPublication(id) {

    const asyncProcess = async () => {
        let data_publications = await $.ajax(publicationsResources+'publications.xml');
        if(typeof (data_publications) == 'string'){
            data_publications = $.parseXML(data_publications)
        }
        let requisites_publications = {}
        $(data_publications).find("ИзданиеСортиментныхИТоварныхТаблиц").children().each(function () {
            if($(this).find("Идентификатор").text() == id){
                requisites_publications = {
                    id: $(this).find("Идентификатор").text(),
                    name: $(this).find("Наименование").text(),
                    text: $(this).find("Наименование").text()+'. Версия: '+$(this).find("Версия").text(),
                    fullname: $(this).find("НаименованиеПолное").text(),
                    version: $(this).find("Версия").text(),
                    official: $(this).find("РеквизитыОфициальногоИздания").text(),
                    developer: $(this).find("РазработчикВерсии").text(),
                    barklindenindividualreserves: $(this).find("КораЛипыВыделенаОтдельнымЗапасом").text(),
                }
                return false;
            }
        });
        return  requisites_publications
    }
    return asyncProcess()
}

export function getSorttables(id,version,publication) {

    let getvalue = function (node,field) {
        let value = parseFloat('0');
        if(field == undefined){
            return value;
        }
        let text = node.find(field).text();
        text = text.toString().replace(',', '.');
        if(text != ''){
            value = parseFloat(text);
        }
        return value;
    }

    const asyncProcess = async () => {
        let data_tables = await $.ajax(publicationsResources + id + "-v" + version + ".xml");
        if(typeof (data_tables) == 'string'){
            data_tables = $.parseXML(data_tables)
        }
        let sorttables = []
        $(data_tables).find("ИзданиеСортиментныхИТоварныхТаблиц").children().each(function () {
            if (this.tagName == "СортиментнаяТаблица") {
                let sorttable = {};
                //чтение структуры полей
                var fields = {};
                $(this).find("КолонкиТаблицы").children().each(function () {
                    fields[$(this).attr("КолонкаМДО")] = $(this).attr("Имя");
                })
                //чтение данных
                $(this).find("ДанныеТаблицы").children().each(function () {
                    let rank    =  $(this).find(fields[fieldsname.height]).text()
                    let step    =  $(this).find(fields[fieldsname.step]).text()
                    step        =  step.replace(/(\,.*)|(\..*)/, '')
                    let requisites_sorttables = {
                        height: getvalue($(this),fields[fieldsname.height]),
                        volume: getvalue($(this),fields[fieldsname.volume]),
                        large: getvalue($(this),fields[fieldsname.large]),
                        average1: getvalue($(this),fields[fieldsname.average1]),
                        average2: getvalue($(this),fields[fieldsname.average2]),
                        small: getvalue($(this),fields[fieldsname.small]),
                        technical_b: getvalue($(this),fields[fieldsname.technical_b]),
                        firewood_b: getvalue($(this),fields[fieldsname.firewood_b]),
                        waste_b: getvalue($(this),fields[fieldsname.waste_b]),
                        technical_f: getvalue($(this),fields[fieldsname.technical_f]),
                        firewood_f: getvalue($(this),fields[fieldsname.firewood_f]),
                        waste_f: getvalue($(this),fields[fieldsname.waste_f]),
                        bark: getvalue($(this),fields[fieldsname.bark]),
                    };
                    if(!sorttable[rank]){
                        sorttable[rank] = {}
                    }
                    sorttable[rank][step] = requisites_sorttables
                })
                let requisites_tables = {
                    id: id+"_"+$(this).attr("НомерТаблицы"),
                    publication: publication,
                    name: $(this).attr("Наименование"),
                    breed: $(this).attr("Порода"),
                    kodGulf: $(this).attr("КодПороды"),
                    sorttables: sorttable
                }
                sorttables.push(requisites_tables)
            }
        });
        return sorttables
    }
    return asyncProcess()
}

export function fill_listPublication() {
    return (dispatch,getState) => {

        const asyncProcess = async () => {
            let xmlDoc = await $.ajax(publicationsResources+'publications.xml');
            if(typeof (xmlDoc) == 'string'){
                xmlDoc = $.parseXML(xmlDoc)
            }
            let listPublication = []
            $(xmlDoc).find("ИзданиеСортиментныхИТоварныхТаблиц").children().each(function () {
                let data = {
                    id: $(this).find("Идентификатор").text(),
                    name: $(this).find("Наименование").text()
                }
                listPublication.push(data);
            });
            dispatch({
                type: PUBLICATIONS_FILL_lISTPUBLICATION,
                listPublication: listPublication,
            })
        }
        return asyncProcess()

    }
}

export function getData(getState,repository) {
    const asyncProcess = async () => {
        let where = getState().publications.where;
        let data =  await repository.find({
            relations: ["tables"],
            where: where,
        });
        return data
    }
    return asyncProcess()
}

export function fill_data(where = {}) {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let repository = getRepository(Publications);
            let data = await repository.find({
                relations: ["tables"],
                where: where,
            });
            dispatch({
                type: PUBLICATIONS_FILL_SUCCESS,
                data: data,
                where: where
            })
        }
        return asyncProcess()
    }
}

export function add(id) {
    
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            /*стретегия
            1. Добавляем издание
            2. Добавляем таблицы
            3. Обновляем породы
            4. Делаем издание основным
            */

            let publicationsRepository  = getRepository(Publications);
            let tablesRepository        = getRepository(Tables);

            //1
            let requisites_publications = await getPublication(id)
            let publicationsObject  = publicationsRepository.create(requisites_publications);

            //2
            let requisites_sorttables = await getSorttables(id,requisites_publications.version,publicationsObject)
            let tablesarray = []
            for (var i = 0; i < requisites_sorttables.length; i++) {
                requisites_sorttables[i].table = tablesRepository.create(requisites_sorttables[i]);
                tablesarray.push(requisites_sorttables[i].table)
            }

            //удалим подчиненные таблицы
            await dispatch(tables.fill_data({publication:id}));
            let tables_data = getState().tables.data
            await tablesRepository.remove(tables_data)

            await publicationsRepository.save(publicationsObject);
            await tablesRepository.save(tablesarray);

            //3
            async function procesbreed(sorttables) {
                for( const sorttable of sorttables){
                    await dispatch(breed.fill_data({kodGulf:sorttable.kodGulf}));
                    let breed_data = getState().breed.data
                    if(breed_data.length == 0){
                        let values = {
                            publication:sorttable.publication,
                            name:sorttable.breed,
                            kodGulf:sorttable.kodGulf,
                            table:sorttable.table
                        }
                        await dispatch(breed.add(values));
                    }
                }
            }
            await procesbreed(requisites_sorttables)

            //4
            let struct = [{
                recid:1,
                publication:publicationsObject.id,
            }];
            BD.edit(CONSTANTS, struct,function (data){});

            let data = await getData(getState,publicationsRepository);
            dispatch({
                type: PUBLICATIONS_ADD,
                data: data
            })
        }
        return asyncProcess()
    }
}

export function del(ids) {
    return (dispatch,getState) => {
        const asyncProcess = async () => {

            const publications = await getRepository(Publications)
                .createQueryBuilder("publications")
                .where("publications.status = :status", { status: 1 })
                .getMany();

            await getConnection()
                .createQueryBuilder()
                .delete()
                .from(Tables)
                .where("status = :status", { status: 1 })
                .execute();

            await getConnection()
                .createQueryBuilder()
                .delete()
                .from(Publications)
                .where("status = :status", { status: 1 })
                .execute();

            webix.message({ type:"info", text:'Удалено '+publications.length+' элементов'});
            let repository = getRepository(Publications);
            let data = await getData(getState,repository);
            dispatch({
                type: PUBLICATIONS_DEL,
                data: data
            })
        }
        asyncProcess()
    }
}

export function edit(obj,values) {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let repository      = getRepository(Publications);
            if(obj){
                for (var property in values) {
                    obj[property] = values[property]
                }
                await repository.save(obj)
            }
            let data = await getData(getState,repository);
            dispatch({
                type: PUBLICATIONS_EDIT,
                currentId: obj.id,
                data: data
            })
        }
        asyncProcess()
    }
}

export function sorting(by,dir,as,id) {
    return (dispatch,getState) => {
        dispatch({
            type: PUBLICATIONS_SORT,
            currentId: id,
            sort: {
                by:by,
                dir:dir,
                as:as
            },
        })
    }
}