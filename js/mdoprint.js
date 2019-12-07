import * as MDO from "./mdo";
import * as FileSaver from "file-saver";

import {store} from "../src/app";

var LAYOUTstyle = 'border: 1px solid #dfdfdf; padding: 3px; overflow: hidden;border-radius: 3px;';

//ПЕЧАТЬ МДО ВЕДОМОСТИ
export var MDOPRINT = {

	callback:undefined,

	printLayout: {
		name: 'printLayout',
		padding: 2,
		panels: [
			{ type: 'top', size: 40, style: LAYOUTstyle, content:
				'<div id="toptoolbar" style="padding: 4px; background-color: rgba(250,250,250,0); "></div>' },
			{ type: 'main', resizable: true,  content: '<div id="printarea"></div>' },
		]
	},

	toptoolbar: {
		name: 'toptoolbar',
		items: [
			{ id: 'print', type: 'button', caption: 'Печать', icon: 'fa fa-print' },
			{ type: 'break',  id: 'break1' },			
			{ id: 'save', type: 'button', caption: 'Сохранить', icon: 'fa fa-floppy-o' },
			{ type: 'break',  id: 'break2' },
			{ id: 'close', type: 'button', caption: 'Закрыть', icon: 'fa fa-times' },
			{ type: 'spacer' },
		],
		onClick: function (event) {
			if (event.target == 'print') {
				var divToPrint=document.getElementById('printarea');
				var newWin= window.open("");
				newWin.document.write(divToPrint.outerHTML);
				newWin.print();
				newWin.close();
			}	
			if (event.target == 'save') {
				var data =  $('#printarea').html();
				var blob = new Blob([data], {type: "html;charset=utf-8"});
				FileSaver.saveAs(blob, "MDO.html");
			}
			if (event.target == 'close') {
				MDOPRINT.callback();
			}
		}
	},	
		
		

	beforeOpening: function () {
		this.whenOpening();
	},

	whenOpening: function () {
		if (w2ui.hasOwnProperty(this.printLayout.name)){
			w2ui[this.printLayout.name].destroy();
		}
		$('#content').w2layout(this.printLayout);

		if (w2ui.hasOwnProperty(this.toptoolbar.name)){
			w2ui[this.toptoolbar.name].destroy();
		}
		$('#toptoolbar').w2toolbar(this.toptoolbar);


		var url 	= '/print/vedomdo.html';
		PRINT.load_maket($("#printarea"), url, );

	},		
		
		
	init: function (callback) {
		this.callback = callback;
		this.beforeOpening();
	},
	
}

