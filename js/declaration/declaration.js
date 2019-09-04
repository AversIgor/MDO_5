import * as MDO from "../mdo";


export var objectDECLARATION;

export function newDECLARATION(){

	let _objectDECLARATION = new classDECLARATION();

	objectDECLARATION = new Proxy(_objectDECLARATION, {
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
	MDO.objectMDO.declaration = objectDECLARATION;
};

//главный объект для ДЕКЛАРАЦИИ
export function classDECLARATION() {

	this.projectModified 	= false; //признак изменения данных объекта

	this.header = {
		number: '', //Номер декларации
		date: '', //Дата декларации
		begin: '', //Начало периода
		end: '', //конец периода
		docNumber: '', //Номер договора
		docDate: '', //дата договора
		docRegistration_number:'',//номер гос. регистрации
		accept_organization: '', //организация утвердившая экспертизу
		accept_date: '', //дата экспертизы
		forestry: '', //лесничество
	}

	this.arrayWoodHarvesting = [];
	this.arrayWoodHarvestingInfrastructure = [];
	this.arrayNonWoodHarvesting = [];
	this.arrayNonWoodHarvestingInfrastructure = [];

	this.files = [];

}

//заполним поля пустыми значениями
classDECLARATION.prototype.start = function() {
	
};

classDECLARATION.prototype.reloadDECLARATION = function(data) {

	for (var key in data) {
		if (key == "arrayWoodHarvesting") {
			continue;
		}
		if (key == "arrayWoodHarvestingInfrastructure") {
			continue;
		}
		if (key == "arrayNonWoodHarvesting") {
			continue;
		}
		if (key == "arrayNonWoodHarvestingInfrastructure") {
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
	if(data.arrayWoodHarvestingInfrastructure != undefined) {
		for (var i = 0; i < data.arrayWoodHarvestingInfrastructure.length; i++) {
			var elemWoodHarvestingInfrastructure = data.arrayWoodHarvestingInfrastructure[i];
			var objWoodHarvestingInfrastructure = new ClassArrayWoodHarvestingInfrastructure(elemWoodHarvestingInfrastructure);
			this.add(this.arrayWoodHarvestingInfrastructure,objWoodHarvestingInfrastructure);
		}
	}

	if(data.arrayNonWoodHarvesting != undefined) {
		for (var i = 0; i < data.arrayNonWoodHarvesting.length; i++) {
			var elemNonWoodHarvesting = data.arrayNonWoodHarvesting[i];
			var objNonWoodHarvesting = new ClassArrayNonWoodHarvesting(elemNonWoodHarvesting);
			this.add(this.arrayNonWoodHarvesting,objNonWoodHarvesting);
		}
	}
	if(data.arrayNonWoodHarvestingInfrastructure != undefined) {
		for (var i = 0; i < data.arrayNonWoodHarvestingInfrastructure.length; i++) {
			var elemNonWoodHarvestingInfrastructure = data.arrayNonWoodHarvestingInfrastructure[i];
			var objNonWoodHarvestingInfrastructure = new ClassArrayNonWoodHarvestingInfrastructure(elemNonWoodHarvestingInfrastructure);
			this.add(this.arrayNonWoodHarvestingInfrastructure,objNonWoodHarvestingInfrastructure);
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
classDECLARATION.prototype.getMaxId = function(array) {
	var maxrecid = 0;
	if(array.length != 0){
		maxrecid = Math.max.apply(Math,array.map(function(o){return o.recid;}));
	}
	return maxrecid+1;
};

classDECLARATION.prototype.add = function(array,object) {
	array.push(object);
};

classDECLARATION.prototype.edit = function(array,object) {

	var indexElem = array.indexOf(object);
	if(indexElem != -1){
		for (var key in object) {
			if (key in array){
				array[indexElem][key] = object[key]
			}
		}
	}
};


classDECLARATION.prototype.delete = function(array,object) {

	var indexElem = array.indexOf(object);
	if(indexElem != -1){
		array.splice(indexElem, 1);
	}

};

//работа с файлами
classDECLARATION.prototype.deleteFile = function(id) {
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

	this.purposeForests 			= "";//ЦНЛ
	this.protectioncategory 		= "";//категория защитности
	this.subforestry 				= "";//участковое лесничество
	this.tract 						= "";//урочище
	this.quarter 					= 0;//квартал
	this.taxation_unit				= 0;//выдел
	this.cutting_area				= 0;//лесосека
	this.square						= 0;//площадь
	this.formCutting				= "";//форма рубки
	this.cuttingmethods				= "";//способ рубки
	this.property					= "";//Хозяйство
	this.breed						= "";//Порода
	this.unit						= "113";//ед.изм //м.куб
	this.value						= 0;//Объекм заготовки

	for (var key in options) {
		if (typeof options[key] == "object") {
			continue;
		}
		this[key] = options[key];
	}
	this.recid						= objectDECLARATION.getMaxId(objectDECLARATION.arrayWoodHarvesting);
}

//Лесная инфраструктура
export function ClassArrayWoodHarvestingInfrastructure(options) {

	this.infrastructureName 		= "";//Наименование объекта
	this.infrastructureID 			= "";//Код объекта
	this.actionUsageKind 			= "";//описание мероприятия
	this.subforestry 				= "";//участковое лесничество
	this.tract 						= "";//урочище
	this.quarter 					= 0;//квартал
	this.taxation_range				= "";//выдел(а)
	this.square						= 0;//площадь
	this.formCutting				= "";//форма рубки
	this.cuttingmethods				= "";//способ рубки
	this.property					= "";//Хозяйство
	this.breed						= "";//Порода
	this.unit						= "113";//ед.изм //м.куб
	this.value						= 0;//Объекм заготовки

	for (var key in options) {
		if (typeof options[key] == "object") {
			continue;
		}
		this[key] = options[key];
	}

	this.recid						= objectDECLARATION.getMaxId(objectDECLARATION.arrayWoodHarvestingInfrastructure);

}

//Прочие виды использования
export function ClassArrayNonWoodHarvesting(options) {

	this.usagekind 					= "";//Вид использования лесов
	this.purposeForests 			= "";//ЦНЛ
	this.protectioncategory 		= "";//категория защитности
	this.subforestry 				= "";//участковое лесничество
	this.tract 						= "";//урочище
	this.quarter 					= 0;//квартал
	this.taxation_range				= "";//выдел(а)
	this.square						= 0;//площадь
	this.resourceKind				= "";//Вид заготовляемого ресурса

	this.unit						= "";//ед.изм //га
	this.value						= 0;//Объем использования

	this.formCutting				= "";//форма рубки
	this.cuttingmethods				= "";//способ рубки
	this.breed						= "";//Порода
	this.сuttingvalue				= 0;//Объем вырубки



	for (var key in options) {
		if (typeof options[key] == "object") {
			continue;
		}
		this[key] = options[key];
	}

	this.recid						= objectDECLARATION.getMaxId(objectDECLARATION.arrayNonWoodHarvesting);

}

//НЕ лесная инфраструктура
export function ClassArrayNonWoodHarvestingInfrastructure(options) {

	this.infrastructureName 		= "";//Наименование объекта
	this.infrastructureID 			= "";//Код объекта
	this.actionUsageKind 			= "";//описание мероприятия
	this.subforestry 				= "";//участковое лесничество
	this.tract 						= "";//урочище
	this.quarter 					= 0;//квартал
	this.taxation_range				= "";//выдел(а)
	this.unit						= "";//ед.изм
	this.value						= 0;//Объекм использования

	this.formCutting				= "";//форма рубки
	this.cuttingmethods				= "";//способ рубки
	this.breed						= "";//Порода
	this.сuttingvalue				= 0;//Объем вырубки


	for (var key in options) {
		if (typeof options[key] == "object") {
			continue;
		}
		this[key] = options[key];
	}

	this.recid						= objectDECLARATION.getMaxId(objectDECLARATION.arrayNonWoodHarvestingInfrastructure);
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
