import {ENUMERATIONS} from "../enumerations";
import {MASTER} from "../master";
import * as xmlbuilder from "xmlbuilder";
import * as FileSaver from "file-saver";
import * as Guid from "guid";


export function saveXML(objectDECLARATION,models,callback){

	var constants = {}
	MASTER.readCredential(constants);

	var empty_fields_constant = [];
	var empty_fields_declaration = [];
	var empty_fields_WoodHarvesting = [];
	var empty_fields_WoodHarvestingInfrastructure = [];
	var empty_fields_NonWoodHarvesting = [];
	var empty_fields_NonWoodHarvestingInfrastructure = [];

	var root = xmlbuilder.create('tns:forestry_declaration', { encoding: 'utf-8', version:"1.0" })
		.att('xmlns:tns', 'http://www.theforest.ru/xmlns/forestry_declaration')
		.att('xmlns:nsit', 'urn://theforest.ru/xmlns/commonly_used')
		.att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')

	createElement(root,'tns:uuid',Guid.create().value)

	var declaration_header = createElement(root,'tns:declaration_header');
	createElement(declaration_header,'tns:number',objectDECLARATION.header.number,{},'Номер декларации',empty_fields_declaration)
	createElement(declaration_header,'tns:date',objectDECLARATION.header.date,{},'Дата декларации',empty_fields_declaration)
	createElement(declaration_header,'tns:state',constants.state,{},'Субъект РФ',empty_fields_constant)
	createElement(declaration_header,'tns:public_authority',constants.public_authority,{},'Орган исполнтельной власти',empty_fields_constant)

	var period = createElement(declaration_header,'tns:period');
	createElement(period,'nsit:begin',objectDECLARATION.header.begin,{},'Дата начала использования',empty_fields_declaration)
	createElement(period,'nsit:end',objectDECLARATION.header.end,{},'Дата окончания использования',empty_fields_declaration)

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

	var responsible_person = createElement(root,'tns:responsible_person');
	createElement(responsible_person,'nsit:first_name',constants.responsible_first_name,{},'Фамилия ответственного лица',empty_fields_constant)
	createElement(responsible_person,'nsit:last_name',constants.responsible_last_name,{},'Имя ответственного лица',empty_fields_constant)
	createElement(responsible_person,'nsit:patronymic_name',constants.responsible_patronymic_name,{},'Отчество ответственного лица',empty_fields_constant)
	if(constants.responsible_post) createElement(responsible_person,'nsit:post',constants.responsible_post)
	if(constants.responsible_charter) createElement(responsible_person,'nsit:charter',constants.responsible_charter)

	var founding_document = createElement(root,'tns:founding_document');
	createElement(founding_document,'nsit:number', objectDECLARATION.header.docNumber,{},'Номер договора',empty_fields_declaration)
	createElement(founding_document,'nsit:date', objectDECLARATION.header.docDate,{},'Дата договора',empty_fields_declaration)
	if(objectDECLARATION.header.docRegistration_number) createElement(founding_document,'nsit:registration_number',objectDECLARATION.header.docRegistration_number)


	var development_plan = createElement(root,'tns:development_plan');
	createElement(development_plan,'tns:accept_organization',objectDECLARATION.header.accept_organization,{},'Орган, утвердивший экспретизу ПОЛ',empty_fields_declaration)
	createElement(development_plan,'tns:accept_date',objectDECLARATION.header.accept_date,{},'Дата экспертизы ПОЛ',empty_fields_declaration)

	//Заготовка древесины

	var wood_harvesting_volumes = createElement(root,'tns:wood_harvesting_volumes');

	for (var i = 0; i < objectDECLARATION.arrayWoodHarvesting.length; i++) {
		var record = createElement(wood_harvesting_volumes,'tns:record');

		var special_purpose = getFromModel(ENUMERATIONS.purposeForests,objectDECLARATION.arrayWoodHarvesting[i].purposeForests);
		if(special_purpose == null){
			putCheckContainer('Целевое назначение лесов',empty_fields_WoodHarvesting);
		}else {
			createElement(record,'tns:special_purpose',special_purpose.text)
		}

		if(objectDECLARATION.arrayWoodHarvesting[i].purposeForests == 2){
			var protectioncategory = getFromModel(models.protectioncategory,objectDECLARATION.arrayWoodHarvesting[i].protectioncategory);
			if(protectioncategory == null){
				putCheckContainer('Категория защитных лесов',empty_fields_WoodHarvesting);
			}else {
				createElement(record,'tns:protection_category',protectioncategory.text,{id:protectioncategory.cod})
			}
		}

		var location = createElement(record,'tns:location');

		var forestry = getFromModel(models.forestry,objectDECLARATION.header.forestry.id);
		if(forestry == null){
			putCheckContainer('Лесничество',empty_fields_declaration);
		}else {
			createElement(location,'nsit:forestry',forestry.text,{id:forestry.cod})
		}

		var sub_forestry = getFromModel(models.subforestry,objectDECLARATION.arrayWoodHarvesting[i].subforestry);
		if(sub_forestry == null){
			putCheckContainer('Участковое лесничество',empty_fields_WoodHarvesting);
		}else {
			createElement(location,'nsit:sub_forestry',sub_forestry.text,{id:sub_forestry.cod})
		}

		var tract = getFromModel(models.tract,objectDECLARATION.arrayWoodHarvesting[i].tract);
		if(tract) createElement(location,'nsit:tract',tract.text,{id:tract.cod})

		if(!objectDECLARATION.arrayWoodHarvesting[i].quarter){
			putCheckContainer('Квартал',empty_fields_WoodHarvesting);
		}else {
			createElement(location,'nsit:quarter',objectDECLARATION.arrayWoodHarvesting[i].quarter)
		}

		if(!objectDECLARATION.arrayWoodHarvesting[i].taxation_unit){
			putCheckContainer('Выдел',empty_fields_WoodHarvesting);
		}else {
			createElement(record,'tns:taxation_unit',objectDECLARATION.arrayWoodHarvesting[i].taxation_unit)
		}

		if(!objectDECLARATION.arrayWoodHarvesting[i].cutting_area){
			putCheckContainer('Лесосека',empty_fields_WoodHarvesting);
		}else {
			createElement(record,'tns:cutting_area',objectDECLARATION.arrayWoodHarvesting[i].cutting_area)
		}

		if(objectDECLARATION.arrayWoodHarvesting[i].square) createElement(record,'tns:square',objectDECLARATION.arrayWoodHarvesting[i].square)

		var form_of_cutting = getFromModel(ENUMERATIONS.formCutting,objectDECLARATION.arrayWoodHarvesting[i].formCutting);
		if(form_of_cutting == null){
			putCheckContainer('Форма рубки',empty_fields_WoodHarvesting);
		}else {
			createElement(record,'tns:form_of_cutting',form_of_cutting.text)
		}

		var kind_of_cutting = getFromModel(models.cuttingmethods,objectDECLARATION.arrayWoodHarvesting[i].cuttingmethods);
		if(kind_of_cutting == null){
			putCheckContainer('Способ рубки',empty_fields_WoodHarvesting);
		}else {
			createElement(record,'tns:kind_of_cutting',kind_of_cutting.text,{id:kind_of_cutting.idCutting})
		}

		var property = getFromModel(ENUMERATIONS.property,objectDECLARATION.arrayWoodHarvesting[i].property);
		if(property == null){
			putCheckContainer('Хозяйство',empty_fields_WoodHarvesting);
		}else {
			createElement(record,'tns:farm',property.text)
		}

		var spicie = getFromModel(models.breeds,objectDECLARATION.arrayWoodHarvesting[i].breed);
		if(spicie == null){
			putCheckContainer('Порода',empty_fields_WoodHarvesting);
		}else {
			createElement(record,'tns:spicie',spicie.text,{id:spicie.kodGulf})
		}

		var unit = getFromModel(ENUMERATIONS.unit,objectDECLARATION.arrayWoodHarvesting[i].unit);
		if(unit == null){
			putCheckContainer('Единица измерения',empty_fields_WoodHarvesting);
		}else {
			createElement(record,'tns:unit',unit.text,{id:unit.id})
		}

		if(!objectDECLARATION.arrayWoodHarvesting[i].value){
			putCheckContainer('Объем',empty_fields_WoodHarvesting);
		}else {
			createElement(record,'tns:value',objectDECLARATION.arrayWoodHarvesting[i].value)
		}

	}

	//лесная инфраструктура
	var wood_harvesting_infrastructure = createElement(root,'tns:wood_harvesting_infrastructure');

	for (var i = 0; i < objectDECLARATION.arrayWoodHarvestingInfrastructure.length; i++) {
		var record = createElement(wood_harvesting_infrastructure, 'tns:record');

		var infrastructure_object = createElement(record, 'tns:infrastructure_object');
		createElement(infrastructure_object,'nsit:name',objectDECLARATION.arrayWoodHarvestingInfrastructure[i].infrastructureName,{},'Наименование объекта',empty_fields_WoodHarvestingInfrastructure)
		createElement(infrastructure_object,'nsit:number',objectDECLARATION.arrayWoodHarvestingInfrastructure[i].infrastructureID,{},'Номер объекта',empty_fields_WoodHarvestingInfrastructure)

		var action = getFromModel(models.actionUsageKind,objectDECLARATION.arrayWoodHarvestingInfrastructure[i].actionUsageKind);
		if(action == null){
			putCheckContainer('Вид мероприятия',empty_fields_WoodHarvestingInfrastructure);
		}else {
			createElement(record,'tns:action',action.text,{id:action.cod})
		}

		var location = createElement(record,'tns:location');

		var forestry = getFromModel(models.forestry,objectDECLARATION.header.forestry.id);
		if(forestry == null){
			putCheckContainer('Лесничество',empty_fields_declaration);
		}else {
			createElement(location,'nsit:forestry',forestry.text,{id:forestry.cod})
		}

		var sub_forestry = getFromModel(models.subforestry,objectDECLARATION.arrayWoodHarvestingInfrastructure[i].subforestry);
		if(sub_forestry == null){
			putCheckContainer('Участковое лесничествоя',empty_fields_WoodHarvestingInfrastructure);
		}else {
			createElement(location,'nsit:sub_forestry',sub_forestry.text,{id:sub_forestry.cod})
		}

		var tract = getFromModel(models.tract,objectDECLARATION.arrayWoodHarvestingInfrastructure[i].tract);
		if(tract) createElement(location,'nsit:tract',tract.text,{id:tract.cod})

		if(!objectDECLARATION.arrayWoodHarvestingInfrastructure[i].quarter){
			putCheckContainer('Квартал',empty_fields_WoodHarvestingInfrastructure);
		}else {
			createElement(location,'nsit:quarter',objectDECLARATION.arrayWoodHarvestingInfrastructure[i].quarter)
		}

		if(!objectDECLARATION.arrayWoodHarvestingInfrastructure[i].taxation_range){
			putCheckContainer('Выдел',empty_fields_WoodHarvestingInfrastructure);
		}else {
			createElement(record,'tns:taxation_range',objectDECLARATION.arrayWoodHarvestingInfrastructure[i].taxation_range)
		}

		if(objectDECLARATION.arrayWoodHarvestingInfrastructure[i].square) createElement(record,'tns:square',objectDECLARATION.arrayWoodHarvestingInfrastructure[i].square)

		var form_of_cutting = getFromModel(ENUMERATIONS.formCutting,objectDECLARATION.arrayWoodHarvestingInfrastructure[i].formCutting);
		if(form_of_cutting == null){
			putCheckContainer('Форма рубки',empty_fields_WoodHarvestingInfrastructure);
		}else {
			createElement(record,'tns:form_of_cutting',form_of_cutting.text)
		}

		var kind_of_cutting = getFromModel(models.cuttingmethods,objectDECLARATION.arrayWoodHarvestingInfrastructure[i].cuttingmethods);
		if(kind_of_cutting == null){
			putCheckContainer('Способ рубки',empty_fields_WoodHarvestingInfrastructure);
		}else {
			createElement(record,'tns:kind_of_cutting',kind_of_cutting.text,{id:kind_of_cutting.idCutting})
		}

		var property = getFromModel(ENUMERATIONS.property,objectDECLARATION.arrayWoodHarvestingInfrastructure[i].property);
		if(property == null){
			putCheckContainer('Хозяйство',empty_fields_WoodHarvestingInfrastructure);
		}else {
			createElement(record,'tns:farm', property.text)
		}

		var spicie = getFromModel(models.breeds,objectDECLARATION.arrayWoodHarvestingInfrastructure[i].breed);
		if(spicie == null){
			putCheckContainer('Порода',empty_fields_WoodHarvestingInfrastructure);
		}else {
			createElement(record,'tns:spicie',spicie.text,{id:spicie.kodGulf})
		}

		var unit = getFromModel(ENUMERATIONS.unit,objectDECLARATION.arrayWoodHarvestingInfrastructure[i].unit);
		if(unit == null){
			putCheckContainer('Единица измерения',empty_fields_WoodHarvestingInfrastructure);
		}else {
			createElement(record,'tns:unit',unit.text,{id:unit.id})
		}

		if(!objectDECLARATION.arrayWoodHarvestingInfrastructure[i].value){
			putCheckContainer('Объемя',empty_fields_WoodHarvestingInfrastructure);
		}else {
			createElement(record,'tns:value',objectDECLARATION.arrayWoodHarvestingInfrastructure[i].value)
		}

	}

	//прочие виды использования
	var non_wood_harvesting_volumes = createElement(root,'tns:non_wood_harvesting_volumes');

	for (var i = 0; i < objectDECLARATION.arrayNonWoodHarvesting.length; i++) {
		var record = createElement(non_wood_harvesting_volumes, 'tns:record');

		var usage_kind = getFromModel(models.usagekind,objectDECLARATION.arrayNonWoodHarvesting[i].usagekind);
		if(usage_kind == null){
			putCheckContainer('Вид использования лесов',empty_fields_NonWoodHarvesting);
		}else {
			createElement(record,'tns:usage_kind',usage_kind.text,{id:usage_kind.cod})
		}

		var special_purpose = getFromModel(ENUMERATIONS.purposeForests,objectDECLARATION.arrayNonWoodHarvesting[i].purposeForests);
		if(special_purpose == null){
			putCheckContainer('Целевое назначение лесов',empty_fields_NonWoodHarvesting);
		}else {
			createElement(record,'tns:special_purpose',special_purpose.text)
		}

		if(objectDECLARATION.arrayNonWoodHarvesting[i].purposeForests == 2){
			var protectioncategory = getFromModel(models.protectioncategory,objectDECLARATION.arrayNonWoodHarvesting[i].protectioncategory);
			if(protectioncategory == null){
				putCheckContainer('Категория защитных лесов',empty_fields_NonWoodHarvesting);
			}else {
				createElement(record,'tns:protection_category',protectioncategory.text,{id:protectioncategory.cod})
			}
		}

		var location = createElement(record,'tns:location');

		var forestry = getFromModel(models.forestry,objectDECLARATION.header.forestry.id);
		if(forestry == null){
			putCheckContainer('Лесничество',empty_fields_declaration);
		}else {
			createElement(location,'nsit:forestry',forestry.text,{id:forestry.cod})
		}

		var sub_forestry = getFromModel(models.subforestry,objectDECLARATION.arrayNonWoodHarvesting[i].subforestry);
		if(sub_forestry == null){
			putCheckContainer('Участковое лесничество',empty_fields_NonWoodHarvesting);
		}else {
			createElement(location,'nsit:sub_forestry',sub_forestry.text,{id:sub_forestry.cod})
		}

		var tract = getFromModel(models.tract,objectDECLARATION.arrayNonWoodHarvesting[i].tract);
		if(tract) createElement(location,'nsit:tract',tract.text,{id:tract.cod})


		if(!objectDECLARATION.arrayNonWoodHarvesting[i].quarter){
			putCheckContainer('Квартал',empty_fields_NonWoodHarvesting);
		}else {
			createElement(location,'nsit:quarter',objectDECLARATION.arrayNonWoodHarvesting[i].quarter)
		}

		if(!objectDECLARATION.arrayNonWoodHarvesting[i].taxation_range){
			putCheckContainer('Выдел',empty_fields_NonWoodHarvesting);
		}else {
			createElement(record,'tns:taxation_range',objectDECLARATION.arrayNonWoodHarvesting[i].taxation_range)
		}

		if(objectDECLARATION.arrayNonWoodHarvesting[i].square) createElement(record,'tns:square',objectDECLARATION.arrayNonWoodHarvesting[i].square)

		var resource_kind = getFromModel(models.resourceKind,objectDECLARATION.arrayNonWoodHarvesting[i].resourceKind);
		if(resource_kind != null){
			createElement(record,'tns:resource_kind',resource_kind.text,{id:resource_kind.cod})
		}

		var unit = getFromModel(ENUMERATIONS.unit,objectDECLARATION.arrayNonWoodHarvesting[i].unit);
		if(unit != null){
			createElement(record,'tns:unit',unit.text,{id:unit.id})
		}

		if(objectDECLARATION.arrayNonWoodHarvesting[i].value){
			createElement(record,'tns:value',objectDECLARATION.arrayNonWoodHarvesting[i].value)
		}

		var form_of_cutting = getFromModel(ENUMERATIONS.formCutting,objectDECLARATION.arrayNonWoodHarvesting[i].formCutting);
		if(form_of_cutting != null){
			createElement(record,'tns:form_of_cutting',form_of_cutting.text)
		}

		var kind_of_cutting = getFromModel(models.cuttingmethods,objectDECLARATION.arrayNonWoodHarvesting[i].cuttingmethods);
		if(kind_of_cutting != null){
			createElement(record,'tns:kind_of_cutting',kind_of_cutting.text,{id:kind_of_cutting.idCutting})
		}

		var spicie = getFromModel(models.breeds,objectDECLARATION.arrayNonWoodHarvesting[i].breed);
		if(spicie != null){
			createElement(record,'tns:spicie',spicie.text,{id:spicie.kodGulf})
		}

		if(objectDECLARATION.arrayNonWoodHarvesting[i].сuttingvalue){
			createElement(record,'tns:cutting_value',objectDECLARATION.arrayNonWoodHarvesting[i].сuttingvalue)
		}

	}

	//НЕ лесная инфраструктура
	var non_wood_harvesting_infrastructure = createElement(root,'tns:non_wood_harvesting_infrastructure');

	for (var i = 0; i < objectDECLARATION.arrayNonWoodHarvestingInfrastructure.length; i++) {
		var record = createElement(non_wood_harvesting_infrastructure, 'tns:record');

		var infrastructure_object = createElement(record, 'tns:infrastructure_object');
		createElement(infrastructure_object,'nsit:name',objectDECLARATION.arrayNonWoodHarvestingInfrastructure[i].infrastructureName,{},'Наименование объекта',empty_fields_NonWoodHarvestingInfrastructure)
		createElement(infrastructure_object,'nsit:number',objectDECLARATION.arrayNonWoodHarvestingInfrastructure[i].infrastructureID,{},'Номер объекта',empty_fields_NonWoodHarvestingInfrastructure)

		var action = getFromModel(models.actionUsageKind,objectDECLARATION.arrayNonWoodHarvestingInfrastructure[i].actionUsageKind);
		if(action == null){
			putCheckContainer('Вид мероприятия',empty_fields_NonWoodHarvestingInfrastructure);
		}else {
			createElement(record,'tns:action',action.text,{id:action.cod})
		}

		var location = createElement(record,'tns:location');

		var forestry = getFromModel(models.forestry,objectDECLARATION.header.forestry.id);
		if(forestry == null){
			putCheckContainer('Лесничество',empty_fields_declaration);
		}else {
			createElement(location,'nsit:forestry',forestry.text,{id:forestry.cod})
		}

		var sub_forestry = getFromModel(models.subforestry,objectDECLARATION.arrayNonWoodHarvestingInfrastructure[i].subforestry);
		if(sub_forestry == null){
			putCheckContainer('Участковое лесничествоя',empty_fields_NonWoodHarvestingInfrastructure);
		}else {
			createElement(location,'nsit:sub_forestry',sub_forestry.text,{id:sub_forestry.cod})
		}

		var tract = getFromModel(models.tract,objectDECLARATION.arrayNonWoodHarvestingInfrastructure[i].tract);
		if(tract) createElement(location,'nsit:tract',tract.text,{id:tract.cod})

		if(!objectDECLARATION.arrayNonWoodHarvestingInfrastructure[i].quarter){
			putCheckContainer('Квартал',empty_fields_NonWoodHarvestingInfrastructure);
		}else {
			createElement(location,'nsit:quarter',objectDECLARATION.arrayNonWoodHarvestingInfrastructure[i].quarter)
		}

		if(!objectDECLARATION.arrayNonWoodHarvestingInfrastructure[i].taxation_range){
			putCheckContainer('Выдел',empty_fields_NonWoodHarvestingInfrastructure);
		}else {
			createElement(record,'tns:taxation_range',objectDECLARATION.arrayNonWoodHarvestingInfrastructure[i].taxation_range)
		}

		var unit = getFromModel(ENUMERATIONS.unit,objectDECLARATION.arrayNonWoodHarvestingInfrastructure[i].unit);
		if(unit != null){
			createElement(record,'tns:unit',unit.text,{id:unit.id})
		}

		if(objectDECLARATION.arrayNonWoodHarvestingInfrastructure[i].value){
			createElement(record,'tns:value',objectDECLARATION.arrayNonWoodHarvestingInfrastructure[i].value)
		}

		var form_of_cutting = getFromModel(ENUMERATIONS.formCutting,objectDECLARATION.arrayNonWoodHarvestingInfrastructure[i].formCutting);
		if(form_of_cutting != null){
			createElement(record,'tns:form_of_cutting',form_of_cutting.text)
		}

		var kind_of_cutting = getFromModel(models.cuttingmethods,objectDECLARATION.arrayNonWoodHarvestingInfrastructure[i].cuttingmethods);
		if(kind_of_cutting != null){
			createElement(record,'tns:kind_of_cutting',kind_of_cutting.text,{id:kind_of_cutting.idCutting})
		}

		var spicie = getFromModel(models.breeds,objectDECLARATION.arrayNonWoodHarvestingInfrastructure[i].breed);
		if(spicie != null){
			createElement(record,'tns:spicie',spicie.text,{id:spicie.kodGulf})
		}

		if(objectDECLARATION.arrayNonWoodHarvestingInfrastructure[i].сuttingvalue){
			createElement(record,'tns:cutting_value',objectDECLARATION.arrayNonWoodHarvestingInfrastructure[i].сuttingvalue)
		}

	}


	var files = root.ele('tns:files');
	for (var i = 0; i < objectDECLARATION.files.length; i++) {
		var file = files.ele('tns:file');
		file.ele('nsit:name', objectDECLARATION.files[i].name);
		file.ele('nsit:mime', objectDECLARATION.files[i].mime);
		file.ele('nsit:data', objectDECLARATION.files[i].data);
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

	if(empty_fields_declaration.length !=0 ){
		var alert = "В лесной декларации не заполнены следующие поля:";
		for (var i = 0; i < empty_fields_declaration.length; i++) {
			alert += "<br>"
			alert += empty_fields_declaration[i];
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

	if(empty_fields_WoodHarvestingInfrastructure.length !=0 ){
		var alert = "В разделе 'Лесная инфраструктура' не заполнены следующие поля:";
		for (var i = 0; i < empty_fields_WoodHarvestingInfrastructure.length; i++) {
			alert += "<br>"
			alert += empty_fields_WoodHarvestingInfrastructure[i];
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

	if(empty_fields_NonWoodHarvestingInfrastructure.length !=0 ){
		var alert = "В разделе 'Не лесная инфраструктура' не заполнены следующие поля:";
		for (var i = 0; i < empty_fields_NonWoodHarvestingInfrastructure.length; i++) {
			alert += "<br>"
			alert += empty_fields_NonWoodHarvestingInfrastructure[i];
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
			nwsaveas:"forestry_declaration.xml",
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
		FileSaver.saveAs(blob, 'forestry_declaration.xml');
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
	