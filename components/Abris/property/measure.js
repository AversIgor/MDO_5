import {
    thumb_azimut_format
} from "../../../actions/Abris/common";

let ui = function(setSelected,contourDelete,contourAdd,props){
    return {
        rows:[
            { view:'toolbar',
                elements:[
                    {
                        view:"button",
                        value:"Добавить",
                        width:100,
                        align:"center",
                        on:{
                            'onItemClick': function(id){
                                contourAdd();
                            }
                        }
                    },
                    {
                        view:"button",
                        value:"Удалить",
                        width:100,
                        align:"center",
                        on:{
                            'onItemClick': function(id){
                                contourDelete();
                            }
                        }
                    },
                    {},
                    {
                        view:"select",
                        id:'select_angle',
                        options:props.getTypeangle(),
                        width:100,
                        on:{
                            onChange:function(newv, oldv){
                                if(oldv){
                                    props.chengeTypeangle(newv)
                                    updateColumns(newv)
                                }
                            }
                        }
                    },
                ]
            },
            {
                view:"datatable",
                id:'plot_circuit',
                select:"row",
                editable:true,
                editaction:"dblclick",
                columns:[],
                data: [],
                on:{
                    "onAfterEditStop":function(state, editor, ignoreUpdate){   
                        if((editor.column == 'gpsX') || (editor.column == 'gpsY')){
                            let item    = this.getItem(editor.row)
                            if((item.gpsX == 0) || (item.gpsY == 0)){
                                return
                            }
                        }
                        props.contourEdit()
                    },
                    "onCheck":function(row, column, state){
                        if((column == 'start_polygon') && (state == 1)){
                            for (let i = 0; i < this.count(); i++) {
                                let id = this.getIdByIndex(i);
                                let item = this.getItem(id);
                                if(item.id == row) {
                                    continue
                                }
                                item[column] = 0;
                            }
                            props.contourUnite(this.getIndexById(row))
                        }
                        if((column == 'natural_boundary') && (state == 1)){
                            let item        = this.getItem(row);
                            if((row == this.getLastId())){
                                item[column]    = 0;
                                webix.message({ type:"error", text:'Последняя точка не может быть естественной границей!'});
                                this.refresh()
                            }
                        }
                        props.contourEdit()
                    },
                    "onSelectChange":function(){
                        let selectedId  = this.getSelectedId(true,true)[0];
                        let index       = this.getIndexById(selectedId);
                        if(index >= 0){
                            setSelected(index)
                        }
					},
                }
            },
        ]
    }
}

let updateColumns = function(typeangle,props){
	
	if(props == undefined) return;

	let table           = $$('plot_circuit');
	
    let column
    if(typeangle == 'Румбы'){
        column = [
            { id:"id",	    header:"id", hidden:true},
            { id:"position",	            header:"№",        width:60,},
            { id:"start_polygon",header:"*",             width:40, template: "{common.checkbox()}",checkValue:1, uncheckValue:0, tooltip:"Отметка начала полигона",},
            { id:"direct",	        header:[{ text:"Румб,&deg;", colspan:2 }],   editor:"select",	options:props.getDirect(),  fillspace:true },
            { id:"rhumb",
                editor:"rhumbeditor",
                fillspace:true,
                format:thumb_azimut_format,
            },
            { id:"distance",       header:[{ text:"Промер, м", colspan:2 }],    editor:"text",fillspace:true,editor:"distanceditor",},
            { id:"natural_boundary",     width:40, template: "{common.checkbox()}", checkValue:1, uncheckValue:0,tooltip:"Отметка естественной границы",},
        ];
    }else if(typeangle == 'Координаты'){ //координаты GPS
		column = [
            { id:"id",	    header:"id", hidden:true},
            { id:"position",header:"№", width:60,},
            { id:"start_polygon",header:"*", width:40, template: "{common.checkbox()}",checkValue:1, uncheckValue:0,},
			{ id:"gpsX", header:"Широта,&deg;", editor:"text",fillspace:true,editor:"gpseditor",},
			{ id:"gpsY", header:"Долгота,&deg;", editor:"text",fillspace:true,editor:"gpseditor",}
        ];
	} else{
        column = [
            { id:"id",	    header:"id", hidden:true},
            { id:"id",	    header:"id", hidden:true},
            { id:"position",	        header:"№",                 width:60, 	},
            { id:"start_polygon",header:"*", width:40, template: "{common.checkbox()}",checkValue:1, uncheckValue:0,},
            { id:"azimut",          header:"Азимут,&deg;",
                editor:"azimuteditor",
                fillspace:true,
                format:thumb_azimut_format,
            },
            { id:"distance",         header:[{ text:"Промер, м", colspan:2 }],    editor:"text",fillspace:true,editor:"distanceditor",},
            { id:"natural_boundary",      width:40, template: "{common.checkbox()}", checkValue:1, uncheckValue:0,},
        ];
	}
    table.refreshColumns(column);

}

let update = function(curentObject,index){
    let table   = $$('plot_circuit');
    table.clearAll();
    table.define("data",curentObject.contour);
    table.refresh();
    window.webix.UIManager.setFocus("plot_circuit")
    if(index >= 0){
        let id = table.getIdByIndex(index)
        if(id){
            table.select(id);
            try {
                table.showItem(id);
            } catch (err) {

            }
        }
    }

    let select_angle   = $$('select_angle');
    select_angle.setValue(curentObject.typeangle);
}

export {ui,updateColumns,update};