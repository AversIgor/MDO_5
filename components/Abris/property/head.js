
let ui = function(context,conteiner){

    function handlerswitch(){
        context.props.handlernChangeMode()
    }

    return {
        view:"toolbar",
        //width:24,
        css:"property_toolbar_head",
        cols:[
            /*{
                view: "switch",
                id:"property_switch_head",
                onLabel: "Редактрование",
                offLabel:"Перемещение",
                click: handlerswitch
            },*/
            {
                view:"checkbox",
                id:"property_switch_head",
                label  :"Редактировать:",
                tooltip:"Смена режима (редактирование/перемещение)",
                labelWidth:120,
                css:"property_switch_head",
                click: handlerswitch
            },
            {},
            {
                view:"icon",
                id:conteiner+"_icon_close",
                tooltip:"Закрыть",
                icon: "times",
                click: "$$('"+conteiner+"_icon_close').getParentView().getParentView().hide()"
            }
        ]
    }
}

let update = function(props){
    let _switch = $$("property_switch_head")
    if(props.mode == 0){
        _switch.define("value",1);
    }else {
        _switch.define("value",0);
    }
    _switch.refresh();
}



export {ui,update};