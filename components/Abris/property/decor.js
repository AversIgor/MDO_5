let ui = function(editStyle,updateStyle){

    return {
        type: "clean",
        padding:5,
        css:"layot_background_white",
        rows:[
            { cols:[
                { view:"select",
                    id:"style_decor",
                    label:"Стиль",
                    options:[],
                    css:"layot_background_white",
                    on:{
                        'onChange': function(newv, oldv){
                            if(oldv){
                                editStyle(newv,undefined)
                            }
                        }
                    }
                },
                {
                    view: "button",
                    type: "htmlbutton",
                    width: 30,
                    label:'<i class="material-icons">refresh</i>',
                    click: function(){
                        updateStyle() 
                    }
                }
            ]},
            {
                view:"property",
                id:"decor",
                complexData:true,
                //autoheight:true,
                autowidth:true,
                elements:[
                    { label:"Полигон", type:"label"},
                    { label:"Цвет фона", type:"color", id:"poliline.fill",},
                    { label:"Прозрачность", type:"text", id:"poliline.fillOpacity",},
                    { label:"Цвет контура", type:"color", id:"poliline.stroke", },
                    { label:"Толщина контура", type:"text", id:"poliline.strokeWidth",},
                    { label:"Тип контура", type:"text", id:"poliline.strokeDasharray",},
                    { label:"Точки", type:"label"},
                    { label:"Цвет точки", type:"color", id:"points.fill",},
                    { label:"Размер точки", type:"text", id:"points.r",},
                    { label:"Подпись", type:"checkbox", id:"points.visible",},
                    { label:"Цвет шрифта", type:"color", id:"points.fontfill",},
                    { label:"Размер шрифта", type:"text", id:"points.fontSize", },
                    { label:"Название", type:"label"},
                    { label:"Отображать", type:"checkbox", id:"name.visible",},
                    { label:"Цвет шрифта", type:"color", id:"name.fontfill", },
                    { label:"Размер шрифта", type:"text", id:"name.fontSize", },
                ],
                on:{
                    "onAfterEditStop":function(state, editor, ignoreUpdate){
                        editStyle(undefined,this.getValues())
                    },
                    "onCheck":function(id,state){
                        editStyle(undefined,this.getValues())
                    },
                }
            }
        ]
    }
}

let update = function(curentObject,props){
    $$("decor").setValues(curentObject.style);

    let style_decor = $$("style_decor")
    let options = []
    for (var i = 0; i < props.styles.length; i++) {
        options.push({
            id:props.styles[i].id,
            value:props.styles[i].name,
        })
    }
    style_decor.define("options",options);
    style_decor.refresh();
    style_decor.setValue(curentObject.styleId);
}


export {ui,update};