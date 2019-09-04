import * as MDO from "../mdo";
import * as Guid from "guid";

export var objectUSAGEREPORT;

export function newUSAGEREPORT(){

    let _objectUSAGEREPORT = new classUSAGEREPORT();

    objectUSAGEREPORT = new Proxy(_objectUSAGEREPORT, {
        get(target, prop) {
            return target[prop];
        },
        set(target, prop, value) {
            if(prop!="projectModified"){
                target.projectModified = true;
            }
            target[prop] = value;
            return true;
        }
    });
}

export function save(callback) {
    MDO.objectMDO.usagereport = objectUSAGEREPORT;
};

//главный объект для ДЕКЛАРАЦИИ
export function classUSAGEREPORT() {

    this.projectModified 	= false; //признак изменения данных объекта

    this.header = {
        months: '', //Начало периода
        year: '', //конец периода
        docType:'', //вид договора
        docNumber: '', //Номер договора
        docDate: '', //дата договора
        docRegistration_number:'',//номер гос. регистрации
        forestry: '', //лесничество
    }

    this.arrayWoodHarvesting = [];
    this.arrayNonWoodHarvesting = [];
    this.arrayEvents = [];

    this.files = [];

}

//заполним поля пустыми значениями
classUSAGEREPORT.prototype.start = function() {

};

classUSAGEREPORT.prototype.reloadUSAGEREPORT = function(data) {

    for (var key in data) {
        if (key == "arrayWoodHarvesting") {
            continue;
        }
        if (key == "arrayNonWoodHarvesting") {
            continue;
        }
        if (key == "arrayEvents") {
            continue;
        }
        if (key == "files") {
            continue;
        }
        this[key] = data[key];
    }

    if(data.arrayWoodHarvesting != undefined) {
        for (var i = 0; i < data.arrayWoodHarvesting.length; i++) {
            var elemWoodHarvesting = data.arrayWoodHarvesting[i];
            var objWoodHarvesting = new ClassArrayWoodHarvesting(elemWoodHarvesting);
            this.add(this.arrayWoodHarvesting,objWoodHarvesting);
        }
    }

    if(data.arrayNonWoodHarvesting != undefined) {
        for (var i = 0; i < data.arrayNonWoodHarvesting.length; i++) {
            var elemNonWoodHarvesting = data.arrayNonWoodHarvesting[i];
            var objNonWoodHarvesting = new ClassArrayNonWoodHarvesting(elemNonWoodHarvesting);
            this.add(this.arrayNonWoodHarvesting,objNonWoodHarvesting);
        }
    }
    if(data.arrayEvents != undefined) {
        for (var i = 0; i < data.arrayEvents.length; i++) {
            var elemEvents = data.arrayEvents[i];
            var objEvents = new ClassEvents(elemEvents);
            this.add(this.arrayEvents,objEvents);
        }
    }

    if(data.files != undefined) {
        for (var i = 0; i < data.files.length; i++) {
            var elemfiles = data.files[i];
            var objfiles = new ClassArrayFiles(elemfiles);
            this.add(this.files,objfiles);
        }
    }

    this.projectModified = false;

};

//получение максимального идентификатор
classUSAGEREPORT.prototype.getMaxId = function(array) {
    var maxrecid = 0;
    if(array.length != 0){
        maxrecid = Math.max.apply(Math,array.map(function(o){return o.recid;}));
    }
    return maxrecid+1;
};

classUSAGEREPORT.prototype.add = function(array,object) {
    array.push(object);
};

classUSAGEREPORT.prototype.edit = function(array,object) {

    var indexElem = array.indexOf(object);
    if(indexElem != -1){
        for (var key in object) {
            if (key in array){
                array[indexElem][key] = object[key]
            }
        }
    }

};


classUSAGEREPORT.prototype.delete = function(array,object) {

    var indexElem = array.indexOf(object);
    if(indexElem != -1){
        array.splice(indexElem, 1);
    }

};

//работа с файлами
classUSAGEREPORT.prototype.deleteFile = function(id) {
    var indexElem = -1;
    for (var i = 0; i < this.files.length; i++) {
        if(this.files[i].id == id){
            indexElem = i;
        }
    }
    if(indexElem != -1){
        this.files.splice(indexElem, 1);
    }
};

//Заготовка древесины
export function ClassArrayWoodHarvesting(options) {

    this.subforestry 				= "";//участковое лесничество
    this.tract 						= "";//урочище
    this.quarter 					= 0;//квартал
    this.taxation_unit				= 0;//выдел
    this.cutting_area				= 0;//лесосека
    this.area_size					= 0;//площадь лесосеки
    this.square						= 0;//площадь заготовки
    this.property					= "";//Хозяйство
    this.formCutting				= "";//форма рубки
    this.cuttingmethods				= "";//способ рубки
    this.breed						= "";//Порода
    this.sortiment					= "";//сортимент
    this.value						= 0;//Объекм заготовки

    for (var key in options) {
        if (typeof options[key] == "object") {
            continue;
        }
        this[key] = options[key];
    }
    this.recid						= objectUSAGEREPORT.getMaxId(objectUSAGEREPORT.arrayWoodHarvesting);
}

//Прочие виды использования
export function ClassArrayNonWoodHarvesting(options) {

    this.usagekind 					= "";//Вид использования лесов
    this.subforestry 				= "";//участковое лесничество
    this.tract 						= "";//урочище
    this.quarter 					= 0;//квартал
    this.taxation_range				= "";//выдел(а)
    this.square						= 0;//площадь
    this.resourceKind				= "";//Вид заготовляемого ресурса

    this.unit						= "";//ед.изм //га
    this.value						= 0;//Объем использования

    for (var key in options) {
        if (typeof options[key] == "object") {
            continue;
        }
        this[key] = options[key];
    }

    this.recid						= objectUSAGEREPORT.getMaxId(objectUSAGEREPORT.arrayNonWoodHarvesting);
}

//Мероприятия
export function ClassEvents(options) {

    this.actionUsageKind 			= "";//описание мероприятия
    this.infrastructureName 		= "";//Наименование объекта
    this.infrastructureID 			= "";//Код объекта
    this.subforestry 				= "";//участковое лесничество
    this.tract 						= "";//урочище
    this.quarter 					= 0;//квартал
    this.taxation_range				= "";//выдел(а)
    this.area_size					= 0;//площадь лесосеки
    this.square						= 0;//площадь заготовки
    this.formCutting				= "";//форма рубки
    this.cuttingmethods				= "";//способ рубки
    this.breed						= "";//Порода
    this.sortiment					= "";//сортимент
    this.value						= 0;//Объекм вырубки


    for (var key in options) {
        if (typeof options[key] == "object") {
            continue;
        }
        this[key] = options[key];
    }

    this.recid						= objectUSAGEREPORT.getMaxId(objectUSAGEREPORT.arrayEvents);
}

//файлы
export function ClassArrayFiles(options) {

    this.id 		= "";//идентификатор
    this.name 		= "";//имя файла
    this.data 		= "";//base 64
    this.sizetext	= "";//описание размера
    this.size		= 0;//размер в  байтах
    this.type		= 0;//тип
    this.mime		= 0;//mime
    this.status		= 'server';//картинка

    for (var key in options) {
        if (typeof options[key] == "object") {
            continue;
        }
        this[key] = options[key];
    }


}
