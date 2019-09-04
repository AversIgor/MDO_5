//ПЕЧАТЬ
export var  PRINT = {
	idcount: 0,
	printform: {},
	
	load_maket: function (dom_element_selector, file_name, callback_function) {		
		$(dom_element_selector).load(file_name, callback_function);
	},
	
	add_section: function (table_id, section_id, params, context) {
		var before 	= $("#"+table_id+" #current", context);
		var el 		= $("#"+table_id+" #"+section_id,context).clone().removeAttr("hidden").insertBefore(before).attr("id",section_id+""+String(PRINT.idcount++));

		// Перебор дочерних элементов и установка им значений
		el.find("*").each
		(
			function(index, domEle)
			{	
				var stringid = domEle.id;
				var fractionDigits = $(this).attr('fractionDigits');
				if(params[stringid] != 0){
					if(fractionDigits != undefined){
						$(this).html(params[stringid].toFixed(Number(fractionDigits)));	
					}else{
						$(this).html(params[stringid]);				
					}				
				}
			}
		);
	}	
}