
let ui = function(context,conteiner){

    function handlerswitch(){
        context.props.handlernChangeMode()
    }

    return {
        view:"toolbar",
        css:"property_toolbar_head",
        cols:[
            {
                view:"checkbox",
                id:conteiner+"_property_switch_head",
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

let update = function(props,conteiner){
    let _switch = $$(conteiner+"_property_switch_head")
    if(props.mode == 0){
        _switch.define("value",1);
    }else {
        _switch.define("value",0);
    }
    _switch.refresh();
}



export {ui,update};