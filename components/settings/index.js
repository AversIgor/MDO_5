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

        let settingsMDO = {
            view:"property",
            id:this.id+'_MDO',
            complexData:true,
            autoheight:true,
            autowidth:true,
            nameWidth:350,
            css:'webix_dark',
            borderless:true,
            elements:[
                { label:"Оценивать дровяную древесину по общему запасу", type:"checkbox", id:"mdo.assessfirewoodcommonstock",},
                { label:"Оценивать отходы от дровяных стволов", type:"checkbox", id:"mdo.assesswastefirewood",},
                { label:"Дровяные стволы липы учитывать в коре", type:"checkbox", id:"mdo.firewoodtrunkslindencountedinbark",},
                { label:"Распределение полуделовых", type:"select", id:"mdo.distributionhalfbusiness",options:this.props.enumerations.distributionhalfbusiness},
                { label:"Округления", type:"label"},
                { label:"Сумм", type:"select", id:"mdo.orderRoundingRates",options:this.props.enumerations.orderRoundingRates},
                { label:"Объема", type:"select", id:"mdo.orderRoundingValues",options:this.props.enumerations.orderRoundingValues},                
            ],
            on:{
                "onAfterEditStop":function(state, editor, ignoreUpdate){
                    self.props.handlerEdit("mdo",this.getValues())
                },
                "onCheck":function(id,state){
                    self.props.handlerEdit("mdo",this.getValues())
                },
            }
        }

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

        let settingsDB = {
            cols:[
                {
                    view:"button",
                    value:"Сохранить настройки",
                    width:200,
                    align:"center",
                    on:{
                        'onItemClick': function(id){
                           self.props.dumpDB();
                        }
                    }
                },  
                {
                    rows:[
                        {
                            view:"uploader",
                            multiple:false,
                            id:"DB_uploader",
                            value:"Выбрать файл с настройками",
                            link:"filelist", autosend:false
                        },
                        { view:"list", scroll:false, id:"filelist", type:"uploader", autoheight:true,},
                    ]
                },
                {
                    view:"button",
                    value:"Загрузить настройки",
                    width:200,
                    align:"center",
                    on:{
                        'onItemClick': function(id){
                            let lastId = $$('filelist').getLastId()
                            if(lastId){
                                let item = $$('filelist').getItem(lastId)    
                                self.props.restoreDB(item);                           
                            }
                        }
                    }
                },                        
           
            ]
        }

        var progress = {
            view:"popup",
            id:this.id+'_window',
            modal:true,
            zIndex:100,
            width: 800,
            move:true,
            position:"center",
            hidden:true,
            body: {
                view:"bullet",
                value:0, 
                id:this.id+'_bullet',
                labelWidth:400,
                label:"Импорт данных",
                placeholder:"",
                hidden:true,
                bands:[
                    { value:100, color:"#ffffff"},
                ],
                //height: 55,
            },
        };


        let layout = {
            id:this.id+'_layout',
            container:ReactDOM.findDOMNode(this.refs.root),
            css:'content',
            padding:10,
            rows:[
                {cols:[
                    {},
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
                                    { header:"Настроки МДО", body:settingsMDO,collapsed:true,  }, 
                                    { header:"Настройки абриса", body:settingsAbris,collapsed:true, },
                                    { header:"Контактная информация", body:settingsContacts,collapsed:true, },
                                    { header:"База данных", body:settingsDB,collapsed:true, },
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
        this.ui.push(window.webix.ui(progress))
        $$(this.id+'_MDO').setValues(this.props.settings);
        $$(this.id+'_abris').setValues(this.props.settings);
        $$(this.id+'_contacts').setValues(this.props.settings);
    }


    componentWillReceiveProps(nextProps) {
        if(nextProps.progress.value>0){
            $$(this.id+'_window').show()            
            $$(this.id+'_bullet').define("placeholder", nextProps.progress.text);
            $$(this.id+'_bullet').refresh();
            $$(this.id+'_bullet').setValue(nextProps.progress.value)
        }
        if(nextProps.progress.value>99){
            $$(this.id+'_window').hide()
        }
        $$(this.id+'_MDO').setValues(nextProps.settings);
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