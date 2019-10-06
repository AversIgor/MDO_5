import {BD} from "./dao";
import {ALLCONSTANT} from "./allconstant";
import {CONSTANTS} from "./constants";
import {FEEDRATES} from "./feedrates";


import {store} from "../src/app";

import * as publications from "../actions/mdo/publications";

var btnStyle 	=		'width: 80px; margin:0 10px; padding: 5px; border-radius: 4px; border: 1px solid #B6B6B6;';

//ПЕРВЫЙ СТАРТ И ЛИЦЕНЗИРОВАНИЕ
export var MASTER = {
	checklicense: false,
	publication: [],
	foresttax: [],
	data: {},
	formOpen: false,//флаг открытой формы	
	masterlayout: {
		name: 'masterlayout',
		padding: 2,
		panels: [
			{ type: 'top', size: 180, title:'Значения по умолчанию', },
			{ type: 'main', minSize: 450,  resizable: true, title:'Лицензирование', },
			{ type: 'bottom', size: 70,  resizable: false, title:'Администрирование', }
		]
	},
	formtop: { 
		name: 'formtop',
		style: 'border: 0px; background-color: transparent;',
		focus  : -1,
		fields : [
			{ field: 'publication', type: 'list',options :{items: this.publication}, html: { caption: 'Сортиментная таблица:', span: '9', attr: 'style="width: 100%"'}, required: true},
			{ field: 'foresttax', type: 'list',options :{items: this.foresttax}, html: { caption: 'Лесотаксовый район:', span: '9', attr: 'style="width: 100%"'}},
			{ field: 'organization', type: 'text', html: { caption: 'Организация:', span: '9', attr: 'style="width: 100%"'}, required: true },
			{ field: 'responsible', type: 'text', html: { caption: 'Ответственный:', span: '9', attr: 'style="width: 100%"'}, required: true },	
		]
	},
	formmain: { 
		name: 'formmain',
		style: 'border: 0px; background-color: transparent;',
		focus  : -1,
		fields : [
			{ field: 'numberlicense', type: 'text', html: { caption: '№ лицензии:', span: '5',  attr: 'style="width: 100%" readonly' } },
			{ field: 'id_db', type: 'text', html: { caption: '№ базы данных:', span: '5',  attr: 'style="width: 100%" readonly' } },
			{ field: 'dateactive', type: 'text', html: { caption: 'Дата активации:', span: '5',  attr: 'style="width: 100%" readonly' } },
		]
	},
	formbottom: { 
		name: 'formbottom',
		style: 'border: 0px; background-color: transparent;',
		focus  : -1,
		formHTML: '<button class="btn" style="float:left; min-width: 10px;" onclick="beforeRestoreDB();"><i class="fa fa-download fa-lg"> Загрузить файл региональных настроек</i></button>'+
				'<button class="btn" style="float:right; min-width: 10px;" onclick="dumpData();" ><i class="fa fa-upload fa-lg"> Выгрузить файл региональных настроек </i></button>',
		
	},
	
	beforeRestoreDB: function () {
		w2popup.message({ 
			width   : 500,
			height  : 200,
			html    : '<div style="padding: 40px; text-align: center; font-size: 11pt"><b>Внимание!</b><br>Загрузка файла региональных настроек <b>стирает все данные</b>, введенные в программу!<br>Вы хотите продолжить?</div>'+
					  '<div style="text-align: center">'+
					  '<button style="' + btnStyle + '" onclick="w2popup.message(); restoreDB();">Да</button>'+
					  '<button style="' + btnStyle + '" onclick="w2popup.message();">Нет</button>'+
					  '</div>'
		});
	},
	
	init: function () {
		if(MASTER.formOpen) w2popup.clear();
		this.readCredential(this.data);
		this.readip();
		this.readlicense();
		window.beforeRestoreDB = this.beforeRestoreDB;
		window.dumpData = BD.dumpData.bind(BD);
		window.restoreDB = BD.restoreDB.bind(BD);
	},
	
	initConfirm: function () {
		if(this.data.numberlicense != undefined){
			this.readidDB();		
		}			
	},
	
	readCredential: function (data) {
		data.curentpublication 		= ALLCONSTANT.data.curentpublication;
		data.curentforesttax 		= ALLCONSTANT.data.curentforesttax;
		data.organization    		= ALLCONSTANT.data.organization;
		data.responsible			= ALLCONSTANT.data.responsible;
		data.id_db					= ALLCONSTANT.data.id_db;
		data.state					= ALLCONSTANT.data.state;
		data.public_authority		= ALLCONSTANT.data.public_authority;
		data.individual				= ALLCONSTANT.data.individual;
		data.first_name				= ALLCONSTANT.data.first_name;
		data.last_name				= ALLCONSTANT.data.last_name;
		data.patronymic_name		= ALLCONSTANT.data.patronymic_name;
				
	},

	readip: function () {
		this.data.ip = '';
		$.ajaxSetup({async: false});
		$.get('https://api.ipify.org/?format=json', function(data,status,xhr){//'http://jsonip.com/'
			if (xhr.status == 200) {
				MASTER.data.ip = data.ip; 
			}	
		});			
	},
	
	readlicense: function () {
		if(NODE_ENV == 'node-webkit'){
			let fs 		= require('fs');
			let path 	= require('path')
			let tmpdir  = path.join(this.localpath(),'/license.txt');

			if (!fs.existsSync(tmpdir)){
				MASTER.newlicense();
			}else{
				fs.readFile(tmpdir, 'utf8', function(err, txt) {
					if (!err) {
						var obj = JSON.parse(txt);
						MASTER.data.numberlicense = obj.numberlicense;
						MASTER.data.dateactive = obj.dateactive;
						MASTER.initConfirm();
					}
				});
			}

		}else{
			MASTER.data.numberlicense = 'Лицензия WEB';
			MASTER.initConfirm();
		}
		
	},
	
	newlicense: function () {

		let crypto		= require('crypto');
		let md5 		= crypto.createHash('md5');
		md5.update(new Date().toString());
		let hash 		= md5.digest('hex');

		let license = {
			numberlicense : hash.match(/.{8}/g).join('-'),
			dateactive : '',		
		}
		let path 	= require('path')
		let tmpdir  = path.join(this.localpath(),'/license.txt');
		if(NODE_ENV == 'node-webkit'){
			var fs = require('fs');
			fs.writeFile(tmpdir, JSON.stringify(license, '\t'), function(err, txt) {
				if (err) {
					w2alert('Ошибка создания новой лицензии');
				}else{
					MASTER.readlicense();
				}
			});
		}
	},
	
	readidDB: function (data) {
		if(MASTER.data.id_db == undefined){
			this.data.id_db = this.data.numberlicense;
			var struct = [];
			var row = {};
			row.recid = 1;
			row.id_db = MASTER.data.id_db;
			struct.push(row);	
			BD.edit(CONSTANTS, struct, MASTER.readidDB);			
		}else{	
			MASTER.readidDBConfirm();		
		}			
	},
	
	readidDBConfirm: function () {
		if(MASTER.checklicense == false){
			//просто откроем форму
			MASTER.beforeOpening();		
		}else{
			//проверим все данные
			MASTER.checkData();	
		}
		MASTER.checklicense = false
	},
	
	beforeOpening: function (firstStart = false) {		
		if (!w2ui.hasOwnProperty(this.masterlayout.name)){
			$().w2layout(this.masterlayout);
		} 
		if (!w2ui.hasOwnProperty(this.formtop.name)){
			$().w2form(this.formtop);
		} 
		if (!w2ui.hasOwnProperty(this.formmain.name)){
			$().w2form(this.formmain);
		} 	
		if (!w2ui.hasOwnProperty(this.formbottom.name)){
			$().w2form(this.formbottom);
		}

		if('publication' in ALLCONSTANT){

			w2ui[this.formtop.name].set('publication', { options :{items: ALLCONSTANT.publication}}); 
		}	
		
		if('foresttax' in ALLCONSTANT){
			w2ui[this.formtop.name].set('foresttax', { options :{items: ALLCONSTANT.foresttax} }); 
		}
		
		w2ui[this.formtop.name].record = { 
			publication 			: this.data.curentpublication,
			foresttax 				: this.data.curentforesttax,
			organization    		: this.data.organization,
			responsible				: this.data.responsible,
		} 	
		
		w2ui[this.formtop.name].refresh();
		

		w2ui[this.formmain.name].record = { 
			numberlicense 	: this.data.numberlicense,
			dateactive 		: this.data.dateactive,
			id_db 			: this.data.id_db,
		}	 
		this.whenOpening(firstStart);		
	},

	whenOpening: function (firstStart) {

		window.MASTER_saverecord = function () {
			MASTER.saverecord();
		}


		this.formOpen = true;
		w2popup.open({
			title		: 'Параметры программы',
			modal		: true,
			showMax		: true,
			showClose	: !firstStart,
			width		: 850,
			height		: 530,
			body		: '<div id="main" style="position: absolute; left: 0px; top: 0px; right: 0px; bottom: 0px;"></div>',
			onOpen		: function (event) {
				event.onComplete = function () {
					$('#w2ui-popup #main').w2render('masterlayout');
					w2ui.masterlayout.content('top', w2ui.formtop);
					w2ui.masterlayout.content('main', w2ui.formmain);
					w2ui.masterlayout.content('bottom', w2ui.formbottom);				
				}
			},
			onToggle: function (event) { 
				event.onComplete = function () {
					w2ui.masterlayout.resize();
				}
			},
			onClose  : function (event) {
				MASTER.formOpen = false;
				var arrayError = w2ui['formtop'].validate(true);
				if(arrayError.length != 0){
					event.preventDefault();
					MASTER.formOpen = true;
				}				

			},

			buttons : 	'<button class="btn" onclick="MASTER_saverecord()">Сохранить параметры</button>',
		});		
	},	
	
	saverecord: function () {

		var arrayError = w2ui['formtop'].validate(true);
		if(arrayError.length != 0){
			return;
		}

		w2popup.lock('Запись...', true);

		const asyncProcess = async (publications) => {

			if(this.data.curentpublication != undefined){
				if(w2ui[MASTER.formtop.name].record.publication.id != MASTER.data.curentpublication.id){
					await store.dispatch(publications.add(w2ui[MASTER.formtop.name].record.publication.id));
				}
			}

			/*if(w2ui[MASTER.formtop.name].record.foresttax.id != MASTER.data.curentforesttax.id){
				FEEDRATES.foresttax_Name = w2ui[MASTER.formtop.name].record.foresttax.text;
				FEEDRATES.ratesArray.splice(0, FEEDRATES.ratesArray.length);
				await FEEDRATES.fillbreeds()
				FEEDRATES.updateRates();
				var struct = [];
				var row = {};
				row.recid = 1;
				row.foresttax = w2ui[MASTER.formtop.name].record.foresttax.id;
				struct.push(row);
				BD.edit(CONSTANTS, struct, ALLCONSTANT.get);
			}*/

			//обновляем организацию и ответственного в константе
			var struct = [];
			var row = {};
			row.recid = 1;
			row.organization = w2ui[MASTER.formtop.name].record.organization;
			row.responsible = w2ui[MASTER.formtop.name].record.responsible;

			struct.push(row);
			//обновим константы
			ALLCONSTANT.get();
			BD.edit(CONSTANTS, struct, ALLCONSTANT.get);

			//заполним данные формы для проверки и отправки на сервер
			MASTER.data.curentpublication 	= w2ui[MASTER.formtop.name].record.publication;
			MASTER.data.curentforesttax 	= w2ui[MASTER.formtop.name].record.foresttax;
			MASTER.data.organization 		= w2ui[MASTER.formtop.name].record.organization;
			MASTER.data.responsible 		= w2ui[MASTER.formtop.name].record.responsible;

			MASTER.checkData();

		}
		asyncProcess(publications);

	},	

	checkData: function () {

		var isValidData = true;
		
		if(this.formOpen == false){
			if(isValidData == true){
				this.sendingDataServer();
			}else{
				//Обязательные данные не заполнены - похоже первый старт
				this.beforeOpening(true);
			}
		}

		if(this.formOpen == true){
			if(isValidData == true){
				this.sendingDataServer();
			}	
		}
	},
	
	sendingDataServer: function () {		

		var all = {};
		all.organization 	= this.data.organization;
		all.responsible 	= this.data.responsible;
		if(store){
			let contacts = store.getState().contactinformation.data;
			if(contacts){
				all.adress 			= contacts.adress;
				all.fon 			= contacts.fon;
				all.email 			= contacts.email;
				all.site 			= contacts.site;
			}
		}
		
		all.version			= BD.curentVersion;
		
		all.numberlicense	= this.data.numberlicense;
		all.dateactive		= this.data.dateactive;
		all.id_db			= this.data.id_db;
		all.ip				= this.data.ip;
		
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "http://rdp.aversit.ru/mdoappreg/hs/register", true);
		
		var login 	= 'license';
		var pass 	= 'pkj72VM3nKTqH0pT';
		var Authorization = 'Basic '+ w2utils.base64encode(login+':'+pass);	
		xhr.setRequestHeader("Authorization", Authorization);
		
		xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
		xhr.timeout = 30000;

		xhr.onreadystatechange = function() { // (3)
			if (xhr.readyState != 4) return;

			if (xhr.status != 200) {
				//console.log(xhr.status + ': ' + xhr.statusText);
			} else {
				//проверим в переменной состояние активации лицензии
				if(w2utils.isDate(MASTER.data.dateactive,'dd.mm.yyyy') == false){
					MASTER.updatelicense(xhr.responseText);	
				}			
			}
		}
		xhr.send(JSON.stringify(all, '\t'));
		w2popup.close();
			
	},	
	
	updatelicense: function (data) {
		var obj = JSON.parse(data);		
		if(MASTER.data.numberlicense == obj.numberlicense){	
			MASTER.data.dateactive 		= obj.dateactive;	
			license = {
				numberlicense : MASTER.data.numberlicense,
				dateactive : MASTER.data.dateactive,		
			}		
			
			var tmpdir = MASTER.localpath()+'/license.txt';
			if(NODE_ENV == 'node-webkit'){
				var fs = require('fs');
				fs.writeFile(tmpdir, JSON.stringify(license, '\t'), function(err, txt) {
					//
				});
			}
		}		
	},	
	
	localpath: function () {	
		var os 		= require('os');			
		var tmpdir 	= os.tmpdir();	
		var path 	= require('path');	
		var pathsplit = os.tmpdir().split(path.sep);	
		var localpath = '';	
		for (var index = 0; index < pathsplit.length-1; ++index) {
			if(index == 0){
				localpath = path.join(localpath,pathsplit[index]+'/');	
			}else{
				localpath = path.join(localpath,pathsplit[index]);	
			}
		}			
		//проверка пути
		if(NODE_ENV == 'node-webkit'){
			var fs = require('fs');
			if (!fs.existsSync(path.join(localpath,'/Avers'))){
				fs.mkdirSync(path.join(localpath,'/Avers'));
			}
			if (!fs.existsSync(path.join(localpath,'/Avers/MDO5'))){
				fs.mkdirSync(path.join(localpath,'/Avers/MDO5'));
			}
		}
			
		localpath = path.join(localpath,'/Avers/MDO5');		

		return localpath;
		
	}
	
}