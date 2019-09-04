import {ENUMERATIONS} from "../enumerations";
import {MASTER} from "../master";
import * as xmlbuilder from "xmlbuilder";
import * as FileSaver from "file-saver";
import * as Guid from "guid";

export function saveXML(objectUSAGEREPORT,models,callback){

	var constants = {}
	MASTER.readCredential(constants);

	var empty_fields_constant = [];
	var empty_fields_usagereport = [];
	var empty_fields_WoodHarvesting = [];
	var empty_fields_NonWoodHarvesting = [];
	var empty_fields_Events = [];

	var root = xmlbuilder.create('tns:forest_usage_report', { encoding: 'utf-8', version:"1.0" })
		.att('xmlns:tns', 'http://www.theforest.ru/xmlns/forest_usage_report')
		.att('xmlns:nsit', 'urn://theforest.ru/xmlns/commonly_used')
		.att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')

	createElement(root,'tns:uuid',Guid.create().value)

	var report_header = createElement(root,'tns:report_header');
	createElement(report_header,'tns:public_authority',constants.public_authority,{},'Орган исполнтельной власти',empty_fields_constant)
	var period = createElement(report_header,'tns:period');

	var months = getFromModel(ENUMERATIONS.months,objectUSAGEREPORT.header.months.id);
	if(months == null){
		putCheckContainer('Отчетный месяц',empty_fields_usagereport);
	}else {
		createElement(period,'nsit:month',months.id)
	}
	var year = getFromModel(ENUMERATIONS.year,objectUSAGEREPORT.header.year.id);
	if(year == null){
		putCheckContainer('Отчетный год',empty_fields_usagereport);
	}else {
		createElement(period,'nsit:year',year.id)
	}

	var person_info = createElement(root,'tns:person_info');
	if(constants.individual == 1){
		var physical_person = createElement(person_info,'nsit:physical_person');
		createElement(physical_person,'nsit:first_name',constants.first_name,{},'Фамилия',empty_fields_constant)
		createElement(physical_person,'nsit:last_name',constants.last_name,{},'Имя',empty_fields_constant)
		if(constants.patronymic_name) createElement(physical_person,'nsit:patronymic_name',constants.patronymic_name)

		var identity_document = createElement(physical_person,'nsit:identity_document');
		createElement(identity_document,'nsit:name',constants.identity_document,{},'Вид документа',empty_fields_constant)
		createElement(identity_document,'nsit:series',constants.series,{},'Серия документа',empty_fields_constant)
		createElement(identity_document,'nsit:number',constants.number,{},'Номер документа',empty_fields_constant)
		createElement(physical_person,'nsit:inn',constants.inn,{},'ИНН',empty_fields_constant)
	}else {
		var juridical_person = createElement(person_info,'nsit:juridical_person');
		createElement(juridical_person,'nsit:name',constants.organization,{},'Наименование организации',empty_fields_constant)
		createElement(juridical_person,'nsit:inn',constants.inn,{},'ИНН организации',empty_fields_constant)
		if(constants.kpp) createElement(juridical_person,'nsit:kpp',constants.kpp)
		if(constants.kpp) createElement(juridical_person,'nsit:ogrn',constants.ogrn)
		createElement(juridical_person,'nsit:address',constants.adress,{},'Адрес организации',empty_fields_constant)
	}
	if(constants.fon) createElement(person_info,'nsit:phone',constants.fon)

	var founding_document = createElement(root,'tns:founding_document');
	var docType = getFromModel(ENUMERATIONS.docType,objectUSAGEREPORT.header.docType.id);
	if(docType == null){
		putCheckContainer('Вид договора',empty_fields_usagereport);
	}else {
		createElement(founding_document,'nsit:type',docType.text)
	}
	createElement(founding_document,'nsit:number', objectUSAGEREPORT.header.docNumber,{},'Номер договора',empty_fields_usagereport)
	createElement(founding_document,'nsit:date', objectUSAGEREPORT.header.docDate,{},'Дата договора',empty_fields_usagereport)
	if(objectUSAGEREPORT.header.docRegistration_number) createElement(founding_document,'nsit:registration_number',objectUSAGEREPORT.header.docRegistration_number)


	//Заготовка древесины

	var wood_harvesting_forest_usage = createElement(root,'tns:wood_harvesting_forest_usage');

	for (var i = 0; i < objectUSAGEREPORT.arrayWoodHarvesting.length; i++) {
		var record = createElement(wood_harvesting_forest_usage,'tns:record');


		var location = createElement(record,'tns:location');

		var forestry = getFromModel(models.forestry,objectUSAGEREPORT.header.forestry.id);
		if(forestry == null){
			putCheckContainer('Лесничество',empty_fields_usagereport);
		}else {
			createElement(location,'nsit:forestry',forestry.text,{id:forestry.cod})
		}

		var sub_forestry = getFromModel(models.subforestry,objectUSAGEREPORT.arrayWoodHarvesting[i].subforestry);
		if(sub_forestry == null){
			putCheckContainer('Участковое лесничество',empty_fields_WoodHarvesting);
		}else {
			createElement(location,'nsit:sub_forestry',sub_forestry.text,{id:sub_forestry.cod})
		}

		var tract = getFromModel(models.tract,objectUSAGEREPORT.arrayWoodHarvesting[i].tract);
		if(tract) createElement(location,'nsit:tract',tract.text,{id:tract.cod})

		if(!objectUSAGEREPORT.arrayWoodHarvesting[i].quarter){
			putCheckContainer('Квартал',empty_fields_WoodHarvesting);
		}else {
			createElement(location,'nsit:quarter',objectUSAGEREPORT.arrayWoodHarvesting[i].quarter)
		}

		if(!objectUSAGEREPORT.arrayWoodHarvesting[i].taxation_unit){
			putCheckContainer('Выдел',empty_fields_WoodHarvesting);
		}else {
			createElement(record,'tns:taxation_unit',objectUSAGEREPORT.arrayWoodHarvesting[i].taxation_unit)
		}

		if(!objectUSAGEREPORT.arrayWoodHarvesting[i].cutting_area){
			putCheckContainer('Лесосека',empty_fields_WoodHarvesting);
		}else {
			createElement(record,'tns:cutting_area',objectUSAGEREPORT.arrayWoodHarvesting[i].cutting_area)
		}

		if(objectUSAGEREPORT.arrayWoodHarvesting[i].area_size) createElement(record,'tns:area_size',objectUSAGEREPORT.arrayWoodHarvesting[i].area_size)

		if(objectUSAGEREPORT.arrayWoodHarvesting[i].square) createElement(record,'tns:square',objectUSAGEREPORT.arrayWoodHarvesting[i].square)

		var property = getFromModel(ENUMERATIONS.property,objectUSAGEREPORT.arrayWoodHarvesting[i].property);
		if(property == null){
			putCheckContainer('Хозяйство',empty_fields_WoodHarvesting);
		}else {
			createElement(record,'tns:farm',property.text)
		}

		var form_of_cutting = getFromModel(ENUMERATIONS.formCutting,objectUSAGEREPORT.arrayWoodHarvesting[i].formCutting);
		if(form_of_cutting == null){
			putCheckContainer('Форма рубки',empty_fields_WoodHarvesting);
		}else {
			createElement(record,'tns:form_of_cutting',form_of_cutting.text)
		}

		var kind_of_cutting = getFromModel(models.cuttingmethods,objectUSAGEREPORT.arrayWoodHarvesting[i].cuttingmethods);
		if(kind_of_cutting == null){
			putCheckContainer('Способ рубки',empty_fields_WoodHarvesting);
		}else {
			createElement(record,'tns:kind_of_cutting',kind_of_cutting.text,{id:kind_of_cutting.idCutting})
		}

		var spicie = getFromModel(models.breeds,objectUSAGEREPORT.arrayWoodHarvesting[i].breed);
		if(spicie == null){
			putCheckContainer('Порода',empty_fields_WoodHarvesting);
		}else {
			createElement(record,'tns:spicie',spicie.text,{id:spicie.kodGulf})
		}

		var sortiment = getFromModel(models.sortiments,objectUSAGEREPORT.arrayWoodHarvesting[i].sortiment);
		if(sortiment == null){
			putCheckContainer('Сортимент',empty_fields_WoodHarvesting);
		}else {
			createElement(record,'tns:sortiment',sortiment.text,{id:sortiment.cod})
		}

		if(!objectUSAGEREPORT.arrayWoodHarvesting[i].value){
			putCheckContainer('Объем',empty_fields_WoodHarvesting);
		}else {
			createElement(record,'tns:value',objectUSAGEREPORT.arrayWoodHarvesting[i].value)
		}

	}

	//прочие виды использования
	var non_wood_harvesting_forest_usage = createElement(root,'tns:non_wood_harvesting_forest_usage');

	for (var i = 0; i < objectUSAGEREPORT.arrayNonWoodHarvesting.length; i++) {
		var record = createElement(non_wood_harvesting_forest_usage, 'tns:record');

		var usage_kind = getFromModel(models.usagekind,objectUSAGEREPORT.arrayNonWoodHarvesting[i].usagekind);
		if(usage_kind == null){
			putCheckContainer('Вид использования лесов',empty_fields_NonWoodHarvesting);
		}else {
			createElement(record,'tns:usage_kind',usage_kind.text,{id:usage_kind.cod})
		}

		var location = createElement(record,'tns:location');

		var forestry = getFromModel(models.forestry,objectUSAGEREPORT.header.forestry.id);
		if(forestry == null){
			putCheckContainer('Лесничество',empty_fields_usagereport);
		}else {
			createElement(location,'nsit:forestry',forestry.text,{id:forestry.cod})
		}

		var sub_forestry = getFromModel(models.subforestry,objectUSAGEREPORT.arrayNonWoodHarvesting[i].subforestry);
		if(sub_forestry == null){
			putCheckContainer('Участковое лесничество',empty_fields_NonWoodHarvesting);
		}else {
			createElement(location,'nsit:sub_forestry',sub_forestry.text,{id:sub_forestry.cod})
		}

		var tract = getFromModel(models.tract,objectUSAGEREPORT.arrayNonWoodHarvesting[i].tract);
		if(tract) createElement(location,'nsit:tract',tract.text,{id:tract.cod})


		if(!objectUSAGEREPORT.arrayNonWoodHarvesting[i].quarter){
			putCheckContainer('Квартал',empty_fields_NonWoodHarvesting);
		}else {
			createElement(location,'nsit:quarter',objectUSAGEREPORT.arrayNonWoodHarvesting[i].quarter)
		}

		if(!objectUSAGEREPORT.arrayNonWoodHarvesting[i].taxation_range){
			putCheckContainer('Выдел',empty_fields_NonWoodHarvesting);
		}else {
			createElement(record,'tns:taxation_range',objectUSAGEREPORT.arrayNonWoodHarvesting[i].taxation_range)
		}

		if(objectUSAGEREPORT.arrayNonWoodHarvesting[i].square) createElement(record,'tns:square',objectUSAGEREPORT.arrayNonWoodHarvesting[i].square)

		var resource_kind = getFromModel(models.resourceKind,objectUSAGEREPORT.arrayNonWoodHarvesting[i].resourceKind);
		if(resource_kind != null){
			createElement(record,'tns:resource_kind',resource_kind.text,{id:resource_kind.cod})
		}

		var unit = getFromModel(ENUMERATIONS.unit,objectUSAGEREPORT.arrayNonWoodHarvesting[i].unit);
		if(unit != null){
			createElement(record,'tns:unit',unit.text,{id:unit.id})
		}

		if(objectUSAGEREPORT.arrayNonWoodHarvesting[i].value){
			createElement(record,'tns:value',objectUSAGEREPORT.arrayNonWoodHarvesting[i].value)
		}

	}

	//Мероприятия
	var forest_usage_events = createElement(root,'tns:forest_usage_events');

	for (var i = 0; i < objectUSAGEREPORT.arrayEvents.length; i++) {
		var record = createElement(forest_usage_events, 'tns:record');

		var action = getFromModel(models.actionUsageKind,objectUSAGEREPORT.arrayEvents[i].actionUsageKind);
		if(action == null){
			putCheckContainer('Вид мероприятия',empty_fields_Events);
		}else {
			createElement(record,'tns:action',action.text,{id:action.cod})
		}

		var infrastructure_object = createElement(record, 'tns:infrastructure_object');
		createElement(infrastructure_object,'nsit:name',objectUSAGEREPORT.arrayEvents[i].infrastructureName,{},'Наименование объекта',empty_fields_Events)
		createElement(infrastructure_object,'nsit:number',objectUSAGEREPORT.arrayEvents[i].infrastructureID,{},'Номер объекта',empty_fields_Events)


		var location = createElement(record,'tns:location');

		var forestry = getFromModel(models.forestry,objectUSAGEREPORT.header.forestry.id);
		if(forestry == null){
			putCheckContainer('Лесничество',empty_fields_usagereport);
		}else {
			createElement(location,'nsit:forestry',forestry.text,{id:forestry.cod})
		}

		var sub_forestry = getFromModel(models.subforestry,objectUSAGEREPORT.arrayEvents[i].subforestry);
		if(sub_forestry == null){
			putCheckContainer('Участковое лесничествоя',empty_fields_Events);
		}else {
			createElement(location,'nsit:sub_forestry',sub_forestry.text,{id:sub_forestry.cod})
		}

		var tract = getFromModel(models.tract,objectUSAGEREPORT.arrayEvents[i].tract);
		if(tract) createElement(location,'nsit:tract',tract.text,{id:tract.cod})

		if(!objectUSAGEREPORT.arrayEvents[i].quarter){
			putCheckContainer('Квартал',empty_fields_Events);
		}else {
			createElement(location,'nsit:quarter',objectUSAGEREPORT.arrayEvents[i].quarter)
		}

		if(!objectUSAGEREPORT.arrayEvents[i].taxation_range){
			putCheckContainer('Выдел',empty_fields_Events);
		}else {
			createElement(record,'tns:taxation_range',objectUSAGEREPORT.arrayEvents[i].taxation_range)
		}

		if(objectUSAGEREPORT.arrayEvents[i].area_size) createElement(record,'tns:area_size',objectUSAGEREPORT.arrayEvents[i].area_size)

		if(objectUSAGEREPORT.arrayEvents[i].square) createElement(record,'tns:square',objectUSAGEREPORT.arrayEvents[i].square)


		var form_of_cutting = getFromModel(ENUMERATIONS.formCutting,objectUSAGEREPORT.arrayEvents[i].formCutting);
		if(form_of_cutting != null){
			createElement(record,'tns:form_of_cutting',form_of_cutting.text)
		}

		var kind_of_cutting = getFromModel(models.cuttingmethods,objectUSAGEREPORT.arrayEvents[i].cuttingmethods);
		if(kind_of_cutting != null){
			createElement(record,'tns:kind_of_cutting',kind_of_cutting.text,{id:kind_of_cutting.idCutting})
		}


		var spicie = getFromModel(models.breeds,objectUSAGEREPORT.arrayEvents[i].breed);
		if(spicie != null){
			createElement(record,'tns:spicie',spicie.text,{id:spicie.kodGulf})
		}

		var sortiment = getFromModel(models.sortiments,objectUSAGEREPORT.arrayEvents[i].sortiment);
		if(sortiment != null){
			createElement(record,'tns:sortiment',sortiment.text,{id:sortiment.cod})
		}

		if(objectUSAGEREPORT.arrayEvents[i].value){
			createElement(record,'tns:value',objectUSAGEREPORT.arrayEvents[i].value)
		}
	}


	var files = root.ele('tns:files');
	for (var i = 0; i < objectUSAGEREPORT.files.length; i++) {
		var file = files.ele('tns:file');
		file.ele('nsit:name', objectUSAGEREPORT.files[i].name);
		file.ele('nsit:mime', objectUSAGEREPORT.files[i].mime);
		file.ele('nsit:data', objectUSAGEREPORT.files[i].data);
	}

	if(empty_fields_constant.length !=0 ){
		var alert = "В настройках программы не заполнены следующие поля:";
		for (var i = 0; i < empty_fields_constant.length; i++) {
			alert += "<br>"
			alert += empty_fields_constant[i];
		}
		callback(alert);
		return;
	}

	if(empty_fields_usagereport.length !=0 ){
		var alert = "В использовании лесов не заполнены следующие поля:";
		for (var i = 0; i < empty_fields_usagereport.length; i++) {
			alert += "<br>"
			alert += empty_fields_usagereport[i];
		}
		callback(alert);
		return;
	}

	if(empty_fields_WoodHarvesting.length !=0 ){
		var alert = "В разделе 'Заготовка древесины' не заполнены следующие поля:";
		for (var i = 0; i < empty_fields_WoodHarvesting.length; i++) {
			alert += "<br>"
			alert += empty_fields_WoodHarvesting[i];
		}
		callback(alert);
		return;
	}


	if(empty_fields_NonWoodHarvesting.length !=0 ){
		var alert = "В разделе 'Прочие виды использования' не заполнены следующие поля:";
		for (var i = 0; i < empty_fields_NonWoodHarvesting.length; i++) {
			alert += "<br>"
			alert += empty_fields_NonWoodHarvesting[i];
		}
		callback(alert);
		return;
	}

	if(empty_fields_Events.length !=0 ){
		var alert = "В разделе 'Мероприятия' не заполнены следующие поля:";
		for (var i = 0; i < empty_fields_Events.length; i++) {
			alert += "<br>"
			alert += empty_fields_Events[i];
		}
		callback(alert);
		return;
	}


	var xml = root.end({ pretty: true });

	if(NODE_ENV == 'node-webkit'){
		var fs = require('fs');
		var input = $("<input/>", {
			style:"display:none",
			id:"xmlFile",
			type:"file",
			nwsaveas:"forest_usage_report.xml",
			accept:".xml"
		}).appendTo("body");
		input.unbind('change');
		input.change(function(evt) {
			fs.writeFile(input.val(), '\ufeff' + xml, { encoding: 'utf8' }, function(err) {
				if(err) {
					w2alert(err);
				}
			});
			this.files.clear();
		});
		input.trigger('click');

	}else {
		var blob = new Blob([xml], {type: "application/xml;charset=utf-8"});
		FileSaver.saveAs(blob, 'forest_usage_report.xml');
	}

}

function createElement(parent,nametag,value,attributes,noCheckTest,checkContainer) {
	var result;
	if(noCheckTest){
		if(!value){
			putCheckContainer(noCheckTest,checkContainer)
			return result
		}
	}
	if(attributes){
		result = parent.ele(nametag,attributes, value);
	}else {
		result = parent.ele(nametag,value);
	}
	return result
}

function putCheckContainer(noCheckTest,container) {
	var indexElem = container.indexOf(noCheckTest);
	if(indexElem == -1){
		container.push(noCheckTest);
	}
}

function getFromModel(model,id) {
	var elem = null;
	for (var i = 0; i < model.length; i++) {
		if(model[i].id == id){
			elem = model[i];
			break
		}
	}
	return elem
}
	