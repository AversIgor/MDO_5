import {MASTER} from "./master";
import {BD} from "./dao";

export var ABOUT = {};

ABOUT.config = {
    layout: {
        name: 'layout',
        padding: 0,
        panels: [
            { type: 'top', size: 350, resizable: true, minSize: 350 },
            { type: 'main', size: 350, resizable: true, minSize: 350, overflow: 'hidden' }
        ]
    },
	foo: { 
		name: 'foo',
		style: 'border: 0px; background-color: transparent;',
 		formHTML: 
			'<div class="w2ui-page page-0">'+
			'    <div class="w2ui-field">'+
			'        <label style="width: 100%;  text-align: center; font-size: medium;">АВЕРС:Материально-денежная оценка лесосек #5</label>'+
			'        <div></div>'+
			'    </div>'+
			'    <div class="w2ui-field">'+
			'        <label style="padding: -1px 3px 3px 3px !important;">Версия:</label>'+
			'        <label id="textversion" style="width: 350px;  text-align: left; padding-left: 10px"></label>'+
			'        <div></div>'+
			'    </div>'+
			'    <div class="w2ui-field">'+
			'        <label>Разработчик:</label>'+
			'        <label style="width: 350px;  text-align: left; padding-left: 10px">©&nbsp;ООО "Аверс информ", 2009-2019. Все права защищены.</label>'+
			'        <div></div>'+
			'    </div>'+
			'    <div class="w2ui-field">'+
			'        <label>Библиотеки:</label>'+
			'        <label style="width: 250px;  text-align: left; padding-left: 10px">jQuery (https://jquery.com/)</label>'+
			'        <div></div>'+
			'    </div>'+
			'    <div class="w2ui-field">'+
			'        <label></label>'+
			'        <label style="width: 250px;  text-align: left; padding-left: 10px">w2ui (http://w2ui.com/web/home)</label>'+
			'        <div></div>'+
			'    </div>'+
			'    <div class="w2ui-field">'+
			'        <label>Номер лицензии:</label>'+
			'        <label id="numberlicense" style="width: 350px;  text-align: left; padding-left: 10px"></label>'+
			'        <div></div>'+
			'    </div>'+
			'    <div class="w2ui-field">'+
			'        <label>Дата активации:</label>'+
			'        <label id="dateactive" style="width: 350px;  text-align: left; padding-left: 10px"></label>'+
			'        <div></div>'+
			'    </div>'+
			'</div>', 
	}	
}

ABOUT.open = function () {
    w2popup.open({
        title: 'О программе/лицензия',
        body: '<div id="main" style="position: absolute; left: 0px; top: 0px; right: 0px; bottom: 0px;"></div>',
        onOpen: function (event) {
            event.onComplete = function () {
                $('#w2ui-popup #main').w2render('foo');
				ABOUT.textUpdate();
				ABOUT.readlicense();
            }
        },
        onToggle: function (event) {
            $(w2ui.foo.box).hide();
            event.onComplete = function () {
                $(w2ui.foo.box).show();
                w2ui.foo.resize();
            }
        }
    });
}


ABOUT.textUpdate = function () {
	$("#textversion").html(BD.curentVersion+'.');
}

ABOUT.readlicense = function () {
	var tmpdir = MASTER.localpath()+'/license.txt';
	if(NODE_ENV == 'node-webkit'){
		var fs = require('fs');	
		fs.readFile(tmpdir, 'utf8', function(err, txt) {
			if (!err)
			{
				var obj = JSON.parse(txt);			
				$("#numberlicense").html(obj.numberlicense);
				$("#dateactive").html(obj.dateactive);
			}
		});
	}
}

ABOUT.init = function () {
	
	if (w2ui.hasOwnProperty(ABOUT.config.foo.name)){
		w2ui[ABOUT.config.foo.name].destroy();
	} 
	$().w2form(ABOUT.config.foo);
	
	ABOUT.open();
	
}