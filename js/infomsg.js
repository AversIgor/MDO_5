import {BD} from "./dao";
import {MASTER} from "./master";


//Информационные сообщения
var infoMsgBtnStyle = "width: 200px; padding: 5px; border-radius: 4px; border: 1px solid #B6B6B6;"; //стиль кнопки информационного сообщения

export var INFOMSGS =  {
	nameTables: "infomessages",//таблица прочитанных сообщений
	textQuery:	"CREATE TABLE [infomessages] (" + 
	"[recid] INTEGER PRIMARY KEY ASC, " +
	"[uid] TEXT);",
	
	messagesListFile: w2utils.base64decode('aHR0cDovL3VwZGF0ZS50aGVmb3Jlc3QucnUvdXBkYXRlL2NvbmZpZ3MvbWRvNS9tZXNzYWdlcy54bWw='),
	messagesFiles: w2utils.base64decode('aHR0cDovL3VwZGF0ZS50aGVmb3Jlc3QucnUvdXBkYXRlL2NvbmZpZ3MvbWRvNS9tZXNzYWdlcy8='),
	
	messagesToShow: [],
	currentMsg: 0,
	
	chgMsg: function (incr) {
		INFOMSGS.currentMsg += incr;
		
		INFOMSGS.getBtnsHTML();
		
		INFOMSGS.showNextMsg(function(msgContent){
			INFOMSGS.refreshMsgContent(msgContent);
		});
	},
	
	showNextMsg: function (callback) {
		
		if(	(INFOMSGS.currentMsg >= INFOMSGS.messagesToShow.length) ||
			(INFOMSGS.currentMsg < 0)) {
			return;
		}
		
		jQuery.ajax({
        url         : INFOMSGS.messagesFiles + INFOMSGS.messagesToShow[INFOMSGS.currentMsg].content,
		cache		: false,
        timeout     : 60000,
		success: function(response){
				callback(response); //callback(new XMLSerializer().serializeToString(req.response));
			}
		});
	},
	
	//mark - (false/true) отметка сообщения как прочитанного
	markMsg: function(mark) {
		if(mark){
			var msgStruct = [];
			var row = {};
			row.uid = INFOMSGS.messagesToShow[INFOMSGS.currentMsg].uid;
			msgStruct.push(row);
			BD.addArray(INFOMSGS, msgStruct, function(){});
		} else {
			var conditions = {};
			conditions.uid = [INFOMSGS.messagesToShow[INFOMSGS.currentMsg].uid];
			BD.deleteWithConditions(INFOMSGS, conditions, function(){});
		}
	},
	
	refreshMsgContent: function (msgContent) {
		var newContent = "<iframe id='infoMsgFrame' style='width: 100%; height: 100%;' srcdoc='" + msgContent + "' frameborder='0'></iframe>";
		$('#w2ui-popup .w2ui-msg-body').html(newContent);
		$('#w2ui-popup .w2ui-msg-title').html(INFOMSGS.messagesToShow[INFOMSGS.currentMsg].title);
	},
	
	getMsgList: function (callback, callerror) {
		
		jQuery.ajax({
        url         : INFOMSGS.messagesListFile,
		cache		: false,
        timeout     : 60000,
		success: function(xmlDoc){
				INFOMSGS.messagesToShow.splice(0, INFOMSGS.messagesToShow.length);
				
				BD.filldata(INFOMSGS,function (readedMsgs) {
					var targets = xmlDoc.getElementsByTagName("target");
					for(var i = 0; i < targets.length; i++) {
						var attribs = INFOMSGS.getAttribs(targets[i]);
						
						if(	 (attribs.type == "all")
						 || ((attribs.type == "version") && (attribs.value == BD.curentVersion))
						 || ((attribs.type == "license") && (attribs.value == MASTER.data.numberlicense)) ){
							var elems = targets[i].getElementsByTagName("news");
							for(var j = 0; j < elems.length; j++) {
								var elemAttr = INFOMSGS.getAttribs(elems[j]);
								if(!INFOMSGS.checkMsg(readedMsgs,elemAttr.id)) {
									INFOMSGS.messagesToShow.push({title: elems[j].textContent, uid: elemAttr.id, content: elemAttr.id + "." + elemAttr.extension});
									break; //по одному непрочитанному сообщению с каждой группы
								}
							}
						}
					}
					INFOMSGS.currentMsg = 0;
					if(INFOMSGS.messagesToShow.length > 0) {
						callback(); //если удачно получили хотя бы одно сообщение, то переходим к их отображению
					} else {
						callerror();
					}
				});
			},
		error: function(err){
				callerror();
			}
		});
		
	},
	
	getAttribs: function(params) {
		var result = {};
		for(var i = 0; i < params.attributes.length; i++){
			result[params.attributes[i].name.toLowerCase()] = params.attributes[i].value;
		}
		return result;
	},
	
	checkMsg: function(readedMsgs, uid) {
		for(var i = 0; i < readedMsgs.length; i++){
			if(readedMsgs[i].uid == uid) {
				return true;
			}
		}		
		return false;
	},
	
	getBtnsHTML: function () {

		window.INFOMSGS_markMsg = function (checked) {
			INFOMSGS.markMsg(checked);
		}

		window.INFOMSGS_chgMsg = function (param) {
			INFOMSGS.chgMsg(param);
		}
		
		//проверим наличие отметки о том что сообщение уже прочитано
		var struct = [];
		var row = {};
		row.uid = INFOMSGS.messagesToShow[INFOMSGS.currentMsg].uid;
		struct.push(row);
		BD.checkRecord(INFOMSGS,struct,function(nameSpase, struct){
			
			var disPrev = false;
			var disNext = false;
			
			if(INFOMSGS.currentMsg >= (INFOMSGS.messagesToShow.length - 1)) disNext = true;
			if(INFOMSGS.currentMsg <= 0) disPrev = true;
			
			var result =	'<div>'+
							'<div>'+
							'<div style="float: left; margin: 0 5px;"><input id="showThisMsg" type="checkbox" onclick="INFOMSGS_markMsg(this.checked);"/></div>'+
							'<div style="padding-top: 0px; text-align: left;"><label for="showThisMsg" style="font-weight: bold; font-size: 13px;">Не показывать это сообщение</label></div>'+
							'</div>'+
							'<br />'+
							'<div style="float: left;"><button style="' + infoMsgBtnStyle + ' margin: 0 0px; " onclick="INFOMSGS_markMsg(-1);" ' + (disPrev ? ' disabled' : '') + '><< Предыдущее сообщение</button></div>'+
							'<div style="float: left;"><button style="' + infoMsgBtnStyle + ' margin: 0 10px;" onclick="INFOMSGS_markMsg(+1);" ' + (disNext ? ' disabled' : '') + '>Следующее сообщение >></button></div>'+
							'<div style="text-align: right;"><button style="' + infoMsgBtnStyle + ' margin: 0 0px; width: 100px;" onclick="w2popup.close(); ">Закрыть</button></div>'+
							'</div>';
			
			$('#w2ui-popup .w2ui-msg-buttons').html(result);
			
			if(struct.length > 0) {
				if(struct[0].recid != null) {
					document.getElementById("showThisMsg").checked = true;
				}
			}
		});
	},
	
	open: function () {
		w2popup.open({
			title: 'Информация',
			width: 600,
			height: 400,
			body: '<div style="width: 100%; height: 100%;"></div>',
			showClose: false,
			buttons: '<div style="width: 100%; height: 100%;"></div>',
			onOpen: function (event) {
				event.onComplete = function () { //читаем первое сообщение из последовательности и отображаем его:
					INFOMSGS.showNextMsg(function(msgContent){
						
						$('#w2ui-popup .w2ui-msg-buttons').height(60); //устанавливаем высоту раздела содержащего кнопки навигации информационного сообщения
						$('#w2ui-popup .w2ui-box1').height(288);
						
						INFOMSGS.refreshMsgContent(msgContent);
						
						INFOMSGS.getBtnsHTML();
					});						
				}
			}
		});
	},
	
	//warnIfNoMsgs - показывать сообщение пользователю, если нет информационных сообщений
	init: function (warnIfNoMsgs) {
		
		//проверяем: если уже открыт какой-либо popup, то ничего не делаем:
		if ($('#w2ui-popup').length > 0) {
			return;
		}
		
		INFOMSGS.getMsgList(function (){
			INFOMSGS.open();
		}, function () {
			if(warnIfNoMsgs) {
				w2alert('У Вас нет непрочитанных информационных сообщений или нет подключения к сети Интернет.');
			}
		});
	}
	
}