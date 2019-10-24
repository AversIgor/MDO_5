import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';
import * as common from '../reference/common';

export default class ComponentSettings extends Component {

    constructor(props) {
        super(props);
        this.id     = 'Settings';
        this.ui     = []
    }

    componentDidMount(){
        let self = this;

        let settingsAbris = {
            view:"property",
            id:this.id+'_abris',
            complexData:true,
            autoheight:true,
            autowidth:true,
            nameWidth:220,
            css:'webix_dark',
            borderless:true,
            elements:[
                { label:"Основные", type:"label"},
                { label:"Формат данных", type:"select", id:"abris.main.typeangle",options:this.props.enumerations.typesAngle},
                { label:"Округления", type:"label"},
                { label:"Площади", type:"select", id:"abris.rounding.square",options:this.props.enumerations.roundingSquar},
                { label:"Углов", type:"select", id:"abris.rounding.angle", options:this.props.enumerations.roundingAngle},
                { label:"Промеров", type:"select", id:"abris.rounding.lengths", options:this.props.enumerations.roundingLength},
                { label:"Допустимые невязки", type:"label"},
                { label:"Угловая, минут", type:"text", id:"abris.residual.angle",},
                { label:"Линейная, м./300 м.", type:"text", id:"abris.residual.linear",},
            ],
            on:{
                "onAfterEditStop":function(state, editor, ignoreUpdate){
                    self.props.handlerEdit("abris",this.getValues())
                },
                "onCheck":function(id,state){
                    self.props.handlerEdit("abris",this.getValues())
                },
            }
        }

        let settingsContacts = {
            view:"property",
            id:this.id+'_contacts',
            complexData:true,
            autoheight:true,
            autowidth:true,
            nameWidth:220,
            css:'webix_dark',
            borderless:true,
            elements:[
                { label:"Наименование организации", type:"text", id:"contacts.organization",},
                { label:"Имя пользователя", type:"text", id:"contacts.responsible",},
                { label:"Адрес", type:"text", id:"contacts.adress",},
                { label:"Телефон", type:"text", id:"contacts.fon",},
                { label:"E-mail", type:"text", id:"contacts.email",},
                { label:"Веб сайт", type:"text", id:"contacts.site",},
            ],
            on:{
                "onAfterEditStop":function(state, editor, ignoreUpdate){
                    self.props.handlerEdit("contacts",this.getValues())
                },
                "onCheck":function(id,state){
                    self.props.handlerEdit("contacts",this.getValues())
                },
            }
        }

        let layout = {
            id:this.id+'_layout',
            container:ReactDOM.findDOMNode(this.refs.root),
            css:'content',
            rows:[
                {cols:[
                    {
                        padding:10,
                        borderless:true,
                        type: "wide",
                        width:700,
                        rows:[
                            {
                                view:"accordion",
                                multi:true,
                                css:"webix_dark",
                                type:"wide",
                                rows:[ //or rows 
                                    { header:"Настроки МДО", body:'settingsContacts',collapsed:true,  }, 
                                    { header:"Настройки абриса", body:settingsAbris,collapsed:true, },
                                    { header:"Контактная информция", body:settingsContacts,collapsed:true, }
                                ]
                            },                            
                        ]
                    },
                    {}
                    ]
                },
            ]
        }
        this.ui.push(window.webix.ui(layout))
        $$(this.id+'_abris').setValues(this.props.settings);
        $$(this.id+'_contacts').setValues(this.props.settings);
    }


    componentWillReceiveProps(nextProps) {
        $$(this.id+'_abris').setValues(nextProps.settings);
        $$(this.id+'_contacts').setValues(nextProps.settings);
    }

    componentWillUnmount(){
        common.uiDestructor(this)
    }

    shouldComponentUpdate(){
        return false;
    }

    render() {
        return (
            <div  ref="root"></div>)
    }

}