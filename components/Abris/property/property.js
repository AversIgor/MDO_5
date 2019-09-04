let ui = function(props){

    return {
        type: "clean",
        padding:5,
        borderless:true,
        css:"layot_background_white",
        rows:[
            { view:"text",id:'name', value:'', label:"Название",
                on:{
                    onChange:function(newv, oldv){
                        props.nameCorrect(newv)
                    }
                }
            },
            { cols:[
                { view:"text",id:'area', value:'', label:"Площадь",disabled:true,css:"layot_background_white"},
                { view:"checkbox", id:"nonexploitationarea", labelRight:"не экспл.", value:0,css:"layot_background_white",
                    on:{
                        onChange:function(newv, oldv){
                            props.nonexploitationareaCorrect(newv)
                        }
                    }
                }
            ]},           
        ]
    }
}

let update = function(curentObject){

    let name   = $$('name');
    name.setValue(curentObject.name);
    name.refresh();

    let area   = $$('area');
    area.setValue(curentObject.area+' га');
    area.refresh();

    let nonexploitationarea   = $$('nonexploitationarea');
    nonexploitationarea.setValue(curentObject.nonexploitationarea);
    let disabled = true
    if(curentObject) {
        if(curentObject.parent != undefined){
            disabled = false
        }
    }
    nonexploitationarea.define("disabled",disabled);
    nonexploitationarea.refresh();
   
}


export {ui,update};