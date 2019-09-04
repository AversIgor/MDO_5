import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';

export default class ComponentStylesForm extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(){

        let self = this;
        let form = {
            view:"form",
            id:"styles_form",
            scroll:false,
            width:450,
            autoheight:true,
            elements:[
                { view:"text", name:"name", label:"Наименование" },
                { view:"checkbox", name:"main", labelRight:"Основной стиль",checkValue:true,uncheckValue:false},
                {
                    view:"property",
                    id:"styles_decor",
                    complexData:true,
                    autoheight:true,
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
                    ]
                }
            ]
        };

        let head = {
            view:"toolbar",
                width:24,
            cols:[
                { view:"segmented", width: 80, options:[
                    {id:"save", value:"Сохранить"},
                ],
                    click: function(e){
                        let id = $$(e).getValue();
                        if(id == 'save'){
                            let value = {
                                main:$$("styles_form").getValues().main,
                                name:$$("styles_form").getValues().name,
                                style:JSON.stringify($$("styles_decor").getValues())
                            }
                            self.props.handlerEdit(self.props.editObject,value);
                        }
                    }
                },
                {},
            ]
        }

        var conteiner = {
            view:"window",
            id:"styles_window",
            container:ReactDOM.findDOMNode(this.refs.root),
            zIndex:100,
            width: 350,
            move:true,
            head:head,
            position:"center",
            body: form,
        };

        this.ui = window.webix.ui(conteiner);

    }


    componentWillReceiveProps(nextProps) {
        if(nextProps.editObject){
            this.ui.show();
            $$("styles_form").setValues({
                name: nextProps.editObject.name,
                main: nextProps.editObject.main
            });
            $$("styles_decor").setValues(JSON.parse(nextProps.editObject.style));
        }else{
            this.ui.hide();
        }
    }

    componentWillUnmount(){        
        this.ui.destructor();
        this.ui = null;
    }

    shouldComponentUpdate(){
        return false;
    }

    render() {
        return (
            <div  ref="root"></div>)
    }

}