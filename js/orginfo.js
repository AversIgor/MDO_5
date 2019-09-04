import {BD} from "./dao";
import {ALLCONSTANT} from "./allconstant";
import {CONSTANTS} from "./constants";
import {MASTER} from "./master";
import {ENUMERATIONS} from "./enumerations";

/*Данные организации*/
export var ORGINFO =  {

	data: {},
	publication: [],
	foresttax: [],


	layout: {
		name: 'ORGINFOlayout',
		panels: [
			{ type: 'top', size: 45, content:'<div id="selectForm" style="height: 100%; width: 100%;"></div>',resizable: false },
			{ type: 'main',  content:'<div id="organizationTab" style="height: 100%; width: 100%;"></div>' }
		]
	},

	selectForm: {
		name: 'selectForm',
		focus  : -1,
		fields: [
			{ field: 'entity_individual', type: 'list', required: true,
				options: { items: ENUMERATIONS.entity_individual }, html: { caption: 'Юр./физ. лицо:', page: 0 , span: '11',attr: 'style="width: 40%"'}},
		],
		onChange: function (event) {
			if(event.target == 'entity_individual'){
				ORGINFO.availability(event.value_new.id);
				ORGINFO.fillForm(event.value_new.id);
			}
		}
	},


	organizationTab: {
		name: 'organizationTab',
		active: 'entity',
		tabs: [
			{ id: 'entity', caption: 'Юридическое лицо'},
			{ id: 'individual', caption: 'Физическое лицо'},
			{ id: 'responsible', caption: 'Ответственное лицо'},
			{ id: 'OIV', caption: 'Реквизиты органа исполнительной власти'},
		],
		fields : [
			{ field: 'organization',  type: 'text', html: { caption: 'Наименование:', page: 0 , span: '12',attr: 'style="width: 90%"'} },
			{ field: 'adress',  type: 'text', html: { caption: 'Адрес:', page: 0 , span: '12',attr: 'style="width: 90%"'} },
			{ field: 'inn',  type: 'text', html: { caption: 'ИНН:', page: 0 , span: '12',attr: 'style="width: 40%"'} },
			{ field: 'kpp',  type: 'text', html: { caption: 'КПП:', page: 0 , span: '12',attr: 'style="width: 40%"'} },
			{ field: 'ogrn',  type: 'text', html: { caption: 'ОГРН:', page: 0 , span: '12',attr: 'style="width: 40%"'} },
			{ field: 'fon',  type: 'text', html: { caption: 'Телефон:', page: 0 , span: '12',attr: 'style="width: 40%"'} },
			{ field: 'email',  type: 'text', html: { caption: 'e-mail:', page: 0 , span: '12',attr: 'style="width: 40%"'} },
			{ field: 'site',  type: 'text', html: { caption: 'Веб-сайт:', page: 0 , span: '12',attr: 'style="width: 40%"'} },

			{ field: 'first_name',  type: 'text', html: { caption: 'Имя:', page: 1 , span: '12',attr: 'style="width: 90%"'} },
			{ field: 'last_name',  type: 'text', html: { caption: 'Фамилия:', page: 1 , span: '12',attr: 'style="width: 90%"'} },
			{ field: 'patronymic_name',  type: 'text', html: { caption: 'Отчество:', page: 1 , span: '12',attr: 'style="width: 90%"'} },
			{ field: 'inn1',  type: 'text', html: { caption: 'ИНН:', page: 1 , span: '12',attr: 'style="width: 40%"'} },
			{ field: 'adress1',  type: 'text', html: { caption: 'Адрес:', page: 1 , span: '12',attr: 'style="width: 90%"'} },
			{ field: 'identity_document', type: 'text', html: { caption: 'Вид документа:', page: 1 , span: '12',attr: 'style="width: 90%"'}},
			{ field: 'series',  type: 'text', html: { caption: 'Серия документа:', page: 1 , span: '12',attr: 'style="width: 40%"'} },
			{ field: 'number',  type: 'text', html: { caption: 'Номер документа:', page: 1 , span: '12',attr: 'style="width: 40%"'} },
			{ field: 'fon1',  type: 'text', html: { caption: 'Телефон:', page: 1 , span: '12',attr: 'style="width: 40%"'} },
			{ field: 'email1',  type: 'text', html: { caption: 'e-mail:', page: 1 , span: '12',attr: 'style="width: 40%"'} },
			{ field: 'site1',  type: 'text', html: { caption: 'Веб-сайт:', page: 1 , span: '12',attr: 'style="width: 40%"'} },

			{ field: 'responsible_first_name',  type: 'text', html: { caption: 'Имя:', page: 2 , span: '12',attr: 'style="width: 90%"'} },
			{ field: 'responsible_last_name',  type: 'text', html: { caption: 'Фамилия:', page: 2 , span: '12',attr: 'style="width: 90%"'} },
			{ field: 'responsible_patronymic_name',  type: 'text', html: { caption: 'Отчество:', page: 2 , span: '12',attr: 'style="width: 90%"'} },
			{ field: 'responsible_post',  type: 'text', html: { caption: 'Должность:', page: 2 , span: '12',attr: 'style="width: 90%"'} },
			{ field: 'responsible_charter',  type: 'text', html: { caption: 'Основание полномочий:', page: 2 , span: '12',attr: 'style="width: 90%"'} },

			{ field: 'state',  type: 'text', html: { caption: 'Субъект РФ:', page: 3 , span: '12',attr: 'style="width: 90%"'} },
			{ field: 'public_authority',  type: 'text', html: { caption: 'Орган исполнительной власти:', page: 3, span: '12',attr: 'style="width: 90%"'} },
		],
		actions: {
			save: function () {
				ORGINFO.saverecord();
			}
		}
	},


	availability: function (param) {
		if(param == 1){
			w2ui[this.organizationTab.name].tabs.enable('individual');
			w2ui[this.organizationTab.name].tabs.disable('entity');
			w2ui[this.organizationTab.name].tabs.click('individual');
		}else{
			w2ui[this.organizationTab.name].tabs.disable('individual');
			w2ui[this.organizationTab.name].tabs.enable('entity');
			w2ui[this.organizationTab.name].tabs.click('entity');
		}
	},

	fillForm: function (param) {

		var record = {};
		record.state 			=  this.data.state;
		record.public_authority = this.data.public_authority;
		record.organization 	=  this.data.organization;
		record.kpp 				=  this.data.kpp;
		record.ogrn 			=  this.data.ogrn;
		record.first_name 		=  this.data.first_name;
		record.last_name 		=  this.data.last_name;
		record.patronymic_name 	=  this.data.patronymic_name;
		record.identity_document=  this.data.identity_document;
		record.series 			=  this.data.series;
		record.number 			=  this.data.number;

		if(param == 1) {
			w2ui[this.selectForm.name].record = {
				entity_individual: ENUMERATIONS.entity_individual[1],
			}
			record.adress1 			=  this.data.adress;
			record.fon1 			=  this.data.fon;
			record.email1 			=  this.data.email;
			record.site1 			=  this.data.site;
			record.inn1 			=  this.data.inn;

		}else {
			w2ui[this.selectForm.name].record = {
				entity_individual: ENUMERATIONS.entity_individual[0],
			}
			record.inn 				=  this.data.inn;
			record.adress 			=  this.data.adress;
			record.fon 				=  this.data.fon;
			record.email 			=  this.data.email;
			record.site 			=  this.data.site;

		}

		record.responsible_first_name		=  this.data.responsible_first_name
		record.responsible_last_name		=  this.data.responsible_last_name;
		record.responsible_patronymic_name	=  this.data.responsible_patronymic_name;
		record.responsible_post				=  this.data.responsible_post;
		record.responsible_charter			=  this.data.responsible_charter;



		w2ui[this.organizationTab.name].record = record;
		w2ui[this.organizationTab.name].refresh();
	},


	saverecord: function () {

		//обновляем организацию и ответственного в константе
		var struct = [];
		var row = {};
		row.recid = 1;


		row.individual 			= w2ui[this.selectForm.name].record.entity_individual.id;
		row.organization 		= w2ui[this.organizationTab.name].record.organization;
		row.first_name 			= w2ui[this.organizationTab.name].record.first_name;
		row.last_name 			= w2ui[this.organizationTab.name].record.last_name;
		row.patronymic_name 	= w2ui[this.organizationTab.name].record.patronymic_name;
		row.public_authority 	= w2ui[this.organizationTab.name].record.public_authority;
		row.state 				= w2ui[this.organizationTab.name].record.state;



		var contacts = {};
		contacts.kpp 				= w2ui[this.organizationTab.name].record.kpp;
		contacts.ogrn 				= w2ui[this.organizationTab.name].record.ogrn;
		contacts.series 			= w2ui[this.organizationTab.name].record.series;
		contacts.number				= w2ui[this.organizationTab.name].record.number;
		contacts.identity_document 	= w2ui[this.organizationTab.name].record.identity_document;

		contacts.responsible_first_name 		= w2ui[this.organizationTab.name].record.responsible_first_name;
		contacts.responsible_last_name 			= w2ui[this.organizationTab.name].record.responsible_last_name;
		contacts.responsible_patronymic_name 	= w2ui[this.organizationTab.name].record.responsible_patronymic_name;
		contacts.responsible_post 				= w2ui[this.organizationTab.name].record.responsible_post;
		contacts.responsible_charter 			= w2ui[this.organizationTab.name].record.responsible_charter;

		if(row.individual == 0){
			//обновляем контактные данные
			contacts.adress 		= w2ui[this.organizationTab.name].record.adress;
			contacts.fon 			= w2ui[this.organizationTab.name].record.fon;
			contacts.email 			= w2ui[this.organizationTab.name].record.email;
			contacts.site 			= w2ui[this.organizationTab.name].record.site;
			contacts.inn 			= w2ui[this.organizationTab.name].record.inn;

		}else {
			//обновляем контактные данные
			contacts.adress 			= w2ui[this.organizationTab.name].record.adress1;
			contacts.fon 				= w2ui[this.organizationTab.name].record.fon1;
			contacts.email 				= w2ui[this.organizationTab.name].record.email1;
			contacts.site 				= w2ui[this.organizationTab.name].record.site1;
			contacts.inn 				= w2ui[this.organizationTab.name].record.inn1;
		}


		var contactsJSON 		=  JSON.stringify(contacts, null, '\t');
		
		row.contacts 			= contactsJSON;
		struct.push(row);
		//обновим константы
		//ALLCONSTANT.get();
		BD.edit(CONSTANTS, struct, ALLCONSTANT.get);

	},

	beforeOpening: function () {
		this.whenOpening();
	},

	whenOpening: function () {

		if (w2ui.hasOwnProperty(this.layout.name)){
			w2ui[this.layout.name].destroy();
		}
		$('#content').w2layout(this.layout);

		if (w2ui.hasOwnProperty(this.selectForm.name)){
			w2ui[this.selectForm.name].destroy();
		}

		$('#selectForm').w2form(this.selectForm);

		if (w2ui.hasOwnProperty(this.organizationTab.name)){
			w2ui[this.organizationTab.name].destroy();
		}
		
		$('#organizationTab').w2form(this.organizationTab);


		this.availability(this.data.individual);
		this.fillForm(this.data.individual);

	},


	init: function () {
		MASTER.readCredential(this.data);
		ORGINFO.beforeOpening();
	}
	
}