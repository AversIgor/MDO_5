import {
	PRINTFORMS_FILL_SUCCESS,
	PRINTFORMS_ADD,
	PRINTFORMS_DEL,
	PRINTFORMS_EDIT,
} from '../../../constants/reference/printforms'
import { getRepository } from "typeorm";
import { Printforms } from "../../TypeORM/entity/printforms";
import * as FileSaver from "file-saver";


export function getVariables() {

	const asyncProcess = async () => {
		let variables = {
			abris:[
				{ text: 'Лесничество', value: '~Лесничество~' },
				{ text: 'Участковое лесничество', value: '~УчастковоеЛесничество~' },
				{ text: 'Урочище', value: '~Урочище~' },
				{ text: 'Квартал', value: '~Квартал~' },
				{ text: 'Выдел', value: '~Выдел~' },
				{ text: 'Делянка', value: '~Делянка~' },
				{ text: 'Масштаб', value: '~Масштаб~' },
				{ text: 'Площадь всех объектов', value: '~ПлощадьВсехОбъектов~' },
				{ text: 'Наименование объекта (экспликация)', value: '~О.НаименованиеОбъекта~' },
				{ text: 'Площадь объекта (экспликация)', value: '~О.ПлощадьОбъекта~' },
				{ text: 'Позиция (экспликация)', value: '~Э1.Позиция~' },
				{ text: 'Румб (экспликация)', value: '~Э1.Румб~' },
				{ text: 'Азимут (экспликация)', value: '~Э1.Азимут~' },
				{ text: 'Промер (экспликация)', value: '~Э1.Промер~' },
				{ text: 'Широта (экспликация)', value: '~Э1.Широта~' },
				{ text: 'Долгота (экспликация)', value: '~Э1.Долгота~' },
				{ text: 'Магнитное склонение', value: '~МагнитноеСклонение~' },
			],
			abrisImages:[
				{ text: 'Абрис', value: '<img title="Абрис" src="~Абрис~" width="600" height="500" />' },
				{ text: 'Указатель севера', value: '<img title="arrow" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAHCCAYAAAAw15OUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjVCQzA4Rjc1OTYzNDExRTg5N0Y5OUU5MkU5MUNFMjZDIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjVCQzA4Rjc2OTYzNDExRTg5N0Y5OUU5MkU5MUNFMjZDIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NUJDMDhGNzM5NjM0MTFFODk3Rjk5RTkyRTkxQ0UyNkMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NUJDMDhGNzQ5NjM0MTFFODk3Rjk5RTkyRTkxQ0UyNkMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6aUGWkAAAE90lEQVR42uydTUhjVxTH73t5iWbGRKsRv1CZxq/GtJaOLeiotSCKpV044LTQQindFrqbTovShYt2ZV0oQhfSVaW4KbiwIxUR28Hq4FCKmGlBBHWMGr+19SPJ6znpfTNxktckFkoX/wt/Hr53f/f+37n3nGxMrqLrurhsU80eKIpiJ3lIrpRhai+SviI1XQYuId0guWl2NWmYOlvpUkoKk27KgWIbB+xpUXuB9Ds/lgO8Hq+fme1rpDLDiNnMahzLGl08pFDU7XfofklC29QqST5pOVo3krGdLwd4uj1HsyumtmWUXzGJQwvpGVPbMki/xbHMOuJY/JNtp4x0vHYqrVtibEvLr5E0E5gHfpOUEWObWjFpycRytHV3PNsOUlGCLPwjOupqlOU3SLYEcC7pbdLVx7blzbUElg3tsMNo2zySNckCEiR52boqc/VVuRTJNHb5njEZv+dEkpYNPeLdxrPmkKpSrH285i/zhniJZJdJb7Q/ZUpyp4C06Ih6zjFq4fV6lnSddBL10Ev6RAIc3S9kmhqNt+iKWRlqklHVpYOmVMrQFQkK+TpXUi29l//EAAwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBhz/v5O8Xq8IBALC7/eL/Px84XK5EDDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgAEDBgwYMGDAgP9bWPN4PDE3LRZLrXjyPWG+1lK/72NgkzNB7ou/f1uewaCqqvfjzpyZmXnhRigUEsFgkMbUIycUbG5uioGBgXBHR4c4ODi4CM/MzDz+g10sLCwog4ODV4eGhoxXsOzt7V0j0EoOzqPPmlBpFp4pMmM4HBanp6clgUDgLU3T+Hf0RV5entLV1fVlf39/3cnJSaSPwahRQeLzE9TR0dEPRkZGbh0dHfFBA2J1dZXtnq2trb1LoDMtLe2J7/Pz84j8fr+tr6/vw+zsbN3lcl04cMBqterp6el6b2/vxz6fT+NvZe/skDGenq1MTEy4afbT4uLiuCcWFBQU6Dk5OfsUvFr+OjcPoEq7gux+xLOurKzE3RDr6+s8UXB6evoOWU+jgYQlIyPDNj4+/unw8PCd4+NjjQJmuqPomX1jY8NDV21ubm5aIdhBs6/abDbn1tZWwi2ZlZXFTg9pWYtUh8MhyEUoGZAbrbmgZQza7XbBZ0XwSOGUsklVw8yhkvwvYEoGQds1ck0JpnWM7CS32y2KiooE7b7kYcoyvaqqytfW1va11+td5KxLCqa8FU6nU6msrPymp6fnfWq3y8vLfbIgmsOcnrRvRUNDw1xnZ+d3+/v7orq6+geC7+bm5moXqgi3wsJCB9WpgJH09fX1D6ampuq5GB4eHorl5WUxOTn5fEtLywPaz5E+3J85zaiaHFW6ISjLfq6pqbnH78milBXNzc2/kosuqmWfzc7OXjfKsirtcl6LioqKe1SnPmd7PCBnDg/A9svKyu5SPB7SCqgUfT1SgktLS51Ut/yNjY0z8/PzNQwZpZUqi9je3ha7u7uCKohYWloqbG1t/ZHW/5jKkJPrtkIznbW3t39LQfnFeA2jGUWe3dCaP+ru7r5NNV6lQTVlbGzMSnYa6urqfqKOZ7xBDIjrGcsYgFdicXFRocrJx/lMK//m8Ku/BBgAnrlLUgt5zAkAAAAASUVORK5CYII=" width="15" height="500" />' },
			]
		}
		return variables
	}
	return asyncProcess()
}


export function updatePredefinedPrintForms() {
	const asyncProcess = async () => {
		let repository = getRepository(Printforms);

		let printformsResurs = await $.ajax("../../../actions/reference/printforms/c54082ae-1325-4fe0-b9ab-a4b1bf0723b1.txt");
		let printform = {
			id: 'c54082ae-1325-4fe0-b9ab-a4b1bf0723b1',
			name: 'Абрис лесосеки (Приказ от 17 октября 2017 г. N 567)',
			predefined: true,
			type: 1,
			printform: printformsResurs,
		};
		let obj = await repository.preload(printform);
		if (!obj) {
			obj = repository.create(printform);
		}
		await repository.save(obj);

		printformsResurs = await $.ajax("../../../actions/reference/printforms/041fca06-3c5f-4403-a65e-7b9a9a56b914.txt");
		printform = {
			id: '041fca06-3c5f-4403-a65e-7b9a9a56b914',
			name: 'Абрис участка (к акту лесопатологического обследования)',
			predefined: true,
			type: 1,
			printform: printformsResurs,
		};
		obj = await repository.preload(printform);
		if (!obj) {
			obj = repository.create(printform);
		}
		await repository.save(obj);

		printformsResurs = await $.ajax("../../../actions/reference/printforms/1a2611b0-23c5-4bd1-b6c9-aaa194ed0615.txt");
		printform = {
			id: '1a2611b0-23c5-4bd1-b6c9-aaa194ed0615',
			name: 'Ведомость материально-денежной оценки лесосеки при сплошном или ленточном перечете',
			predefined: true,
			type: 2,
			printform: printformsResurs,
		};
		obj = await repository.preload(printform);
		if (!obj) {
			obj = repository.create(printform);
		}
		await repository.save(obj);

	}
	return asyncProcess()

}


export function getData(getState, repository) {
	const asyncProcess = async () => {
		let where = getState().printforms.where;
		let data = await repository.find({
			where: where,
		});
		return data
	}
	return asyncProcess()
}

export function fill_data(where = {}) {
	return (dispatch, getState) => {
		const asyncProcess = async () => {
			let repository = getRepository(Printforms);
			let data = await repository.find({
				where: where,
			});
			let variables = await getVariables()
			dispatch({
				type: PRINTFORMS_FILL_SUCCESS,
				data: data,
				where: where,
				variables: variables
			})
		}
		return asyncProcess()
	}
}

export function add(obj) {
	return (dispatch, getState) => {
		const asyncProcess = async () => {
			let repository = getRepository(Printforms);
			let currentObject = undefined;
			if (obj) {
				let newobj = { ...obj }
				delete newobj.id;
				delete newobj.predefined;
				currentObject = repository.create(newobj);
			} else {
				currentObject = repository.create();
			}
			await repository.save(currentObject);
			let data = await getData(getState, repository);
			dispatch({
				type: PRINTFORMS_ADD,
				data: data
			})
		}
		asyncProcess()
	}
}

export function del(ids) {
	return (dispatch, getState) => {
		const asyncProcess = async () => {
			let repository = getRepository(Printforms);
			let data = await repository.find({
				where: { status: 1 },
			});
			await repository.remove(data);
			webix.message({ type: "info", text: 'Удалено ' + data.length + ' элементов' });
			data = await getData(getState, repository);
			dispatch({
				type: PRINTFORMS_DEL,
				data: data
			})
		}
		asyncProcess()
	}
}

export function edit(obj, values) {
	return (dispatch, getState) => {
		const asyncProcess = async () => {
			let repository = getRepository(Printforms);
			if (obj) {
				for (var property in values) {
					obj[property] = values[property]
				}
				await repository.save(obj)
			}
			let data = await getData(getState, repository);
			dispatch({
				type: PRINTFORMS_EDIT,
				currentId: obj.id,
				data: data
			})
		}
		asyncProcess()
	}
}

export function load() {
	return (dispatch, getState) => {
		const asyncProcess = async () => {
			var input = $("<input/>", {
				style: "display:none",
				id: "inputFile",
				type: "file",
				accept: ".json"
			}).appendTo("body");
			input.unbind('change');
			input.change(function (evt) {
				var file = this.files;
				if (file.length == 1) {
					var fileReader = window.FileReader ? new FileReader() : null;
					fileReader.addEventListener("loadend", function (e) {					

						const asyncLoad = async () => {
							var printform = JSON.parse(e.target.result);

							let repository = getRepository(Printforms);

							let obj = await repository.preload(printform);
							if (!obj) {
								obj = repository.create(printform);
							}
							await repository.save(obj);

							let data = await getData(getState, repository);
							dispatch({
								type: PRINTFORMS_ADD,
								data: data
							})
						}

						asyncLoad();

					}, false);
					fileReader.readAsText(file[0]);
				}
			});
			input.trigger('click');
		}
		asyncProcess()
	}
}

export function save(printObject) {
	return (dispatch, getState) => {
		const asyncProcess = async () => {
			
			let saveobject = { id: printObject.id, name: printObject.name, printform: printObject.printform };
			var fileName = printObject.name + ".json";

			var data = JSON.stringify(saveobject, null, '\t');
			if (NODE_ENV == 'node-webkit') {
				var fs = require('fs');

				var input = $("<input/>", {
					style: "display:none",
					id: "outputFile",
					type: "file",
					nwsaveas: fileName,
					accept: ".json"
				}).appendTo("body");
				input.unbind('change');
				input.change(function (evt) {
					fs.writeFile(input.val(), data, function (err) {
						if (err) {
							w2alert(err);
						} else {
							callback();
						}
					});
					this.files.clear();
				});
				input.trigger('click');

			} else {
				var blob = new Blob([data], { type: "json;charset=utf-8" });
				FileSaver.saveAs(blob, fileName);
			}

		}
		asyncProcess()
	}
}


