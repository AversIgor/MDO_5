import {ALLCONSTANT} from "./allconstant";
import {ENUMERATIONS} from "./enumerations";
import {BD} from "./dao";

/*КОНСТАНТЫ
distributionhalfbusiness - порядок распределения полуделовых: 0 - в деловые, 1 - в дрова
assessfirewoodcommonstock - Оценивать дровяную древесину по общему запасу
assesswastefirewood - Оценивать отходы от дровяных стволов
firewoodtrunkslindencountedinbark - Дровяные стволы липы учитывать в коре
barklindenindividualreserves - Липа в сортиментных таблицах отдельным параметром
orderRoundingRates - порядок округления сумм
orderRoundingValues - порядок округления объема
organization - Организация
responsible - Ответственный
contacts - данные контактным данным в json формате
publication - Основная сортиментная таблица - ссылка на идентификатор
foresttax - Текущие ставки платы
id_db - идентификатор базы данных
 */

export var CONSTANTS =  {
	nameTables: "constants",
	textQuery:	"CREATE TABLE [constants] (" +
	"[recid] INTEGER PRIMARY KEY ASC, " +
	"[distributionhalfbusiness] INT, " + 
	"[assessfirewoodcommonstock] INT, " +
	"[assesswastefirewood] INT, " +
	"[firewoodtrunkslindencountedinbark] INT, " +
	"[barklindenindividualreserves] INT, " + 
	"[orderRoundingRates] INT, " +
	"[orderRoundingValues] INT, " +
	"[organization] TEXT, " +
	"[responsible] TEXT, " +
	"[contacts] TEXT, " +
	"[publication] TEXT, " +
	"[foresttax] INTEGER, " +
	"[id_db] TEXT, " +
	"[public_authority] TEXT, " +
	"[state] TEXT, " +
	"[first_name] TEXT, " +
	"[last_name] TEXT, " +
	"[patronymic_name] TEXT, " +
	"[individual] INT, " +
	"[any] TEXT);",
	
	formObject: function() {
		var constantsForm = {
			name    : 'constants',
			style	: 'width: 100%;',
			focus  : -1,
			fields: [
				{ field: 'orderRoundingValues', type: 'list', html: { caption : 'Округление объема древесины:', span:'15',},
					options: { items: ENUMERATIONS.orderRoundingValues }},		
				{ field: 'orderRoundingRates', type: 'list', html: { caption : 'Округление денежных сумм:', span:'15',},
					options: { items: ENUMERATIONS.orderRoundingRates }},
				{ field: 'distributionhalfbusiness', type: 'list', html: { caption : 'Распределение полуделовых деревьев:', span:'15',},
					options: { items: ENUMERATIONS.distributionhalfbusiness }},
				{ field: 'assessfirewoodcommonstock', type: 'checkbox', html: { caption : 'Оценивать дровяную древесину по общему запасу:', span:'15',}},
				{ field: 'assesswastefirewood', type: 'checkbox', html: { caption : 'Оценивать отходы от дровяных стволов:', span:'15',}},
				{ field: 'firewoodtrunkslindencountedinbark', type: 'checkbox', html: { caption : 'Дровяные стволы липы учитывать в коре:', span:'15',}},
				{ field: 'barklindenindividualreserves', type: 'checkbox', html: { caption : 'Кора липы в сортиментных таблицах отдельным параметром:', span:'15',}},
			
			],
			onChange: function (event) {			
				var struct = [];
				var row = {};
				row.recid = 1;
				if(event.target == 'orderRoundingValues'){
					row.orderRoundingValues = event.value_new.id;
				}
				if(event.target == 'orderRoundingRates'){
					row.orderRoundingRates = event.value_new.id;
				}
				if(event.target == 'distributionhalfbusiness'){
					row.distributionhalfbusiness = event.value_new.id;
				}
				if(event.target == 'assessfirewoodcommonstock'){
					var assessfirewoodcommonstock = 0;
					if(event.value_new == true){
						assessfirewoodcommonstock = 1;				
					}
					row.assessfirewoodcommonstock = assessfirewoodcommonstock;
				}
				if(event.target == 'assesswastefirewood'){
					var assesswastefirewood = 0;
					if(event.value_new == true){
						assesswastefirewood = 1;				
					}
					row.assesswastefirewood = assesswastefirewood;
				}
				if(event.target == 'firewoodtrunkslindencountedinbark'){
					var firewoodtrunkslindencountedinbark = 0;
					if(event.value_new == true){
						firewoodtrunkslindencountedinbark = 1;				
					}
					row.firewoodtrunkslindencountedinbark = firewoodtrunkslindencountedinbark;
				}
				if(event.target == 'barklindenindividualreserves'){
					var barklindenindividualreserves = 0;
					if(event.value_new == true){
						barklindenindividualreserves = 1;				
					}
					row.barklindenindividualreserves = barklindenindividualreserves;
				}
				struct.push(row);
				BD.edit(CONSTANTS, struct, CONSTANTS.confirmSave);					
			}
		}
		return constantsForm;
	},

	confirmSave: function () {
		ALLCONSTANT.get();		
	},

	beforeOpening: function () {
		this.whenOpening();
	},

	whenOpening: function () {
		if (w2ui.hasOwnProperty(this.nameTables)){
			w2ui[this.nameTables].destroy();
		}
		$('#content').empty();
		$('#content').w2form(this.formObject());

		w2ui[this.nameTables].record = { 
			distributionhalfbusiness    		: ALLCONSTANT.data.distributionhalfbusiness,
			assessfirewoodcommonstock   		: ALLCONSTANT.data.assessfirewoodcommonstock,
			assesswastefirewood   				: ALLCONSTANT.data.assesswastefirewood,
			firewoodtrunkslindencountedinbark   : ALLCONSTANT.data.firewoodtrunkslindencountedinbark,
			barklindenindividualreserves   		: ALLCONSTANT.data.barklindenindividualreserves,
			orderRoundingValues 				: ALLCONSTANT.data.orderRoundingValues,
			orderRoundingRates 					: ALLCONSTANT.data.orderRoundingRates
		}
		w2ui[this.nameTables].refresh();
	},

	init: function () {
		this.beforeOpening();		
	}
	
}