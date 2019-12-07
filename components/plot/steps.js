import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';
import * as common from '../reference/common';

export default class ComponentSteps extends Component {

    constructor(props) {
        super(props);
        this.id         = 'plot_steps';   
        this.ui         = [];   
                
    }   
    
    feelData(props) {

        let curentRecount = props.plotObject.curentRecount
        $$(this.id).editCancel();
        $$(this.id).clearAll()
        let curentRow = undefined;
        if(curentRecount.breed){
            let parent     = props.plotObject.recount.find(item => item.id == curentRecount.objectTaxation);
            curentRow  = parent.objectsBreed.find(item => item.id == curentRecount.breed);
        }
        if(curentRow){
            if(curentRow.hasOwnProperty('steps')){
                for (let i = 0; i < curentRow.steps.length; i++) {                    
                    let objectStep = curentRow.objectsStep.find(item => item.step == curentRow.steps[i]);
                    let newRow = {
                        step:curentRow.steps[i]
                    }
                    if(objectStep){
                        newRow.business = objectStep.business
                        newRow.halfbusiness = objectStep.halfbusiness
                        newRow.firewood = objectStep.firewood
                    }
                    $$(this.id).add(newRow)
                }            
            }
        }
    }
  
    initUI(){
        let self = this;

        let ui = {
            paddingY:5,
            paddingX:2,
            rows:[
                {
                    view:"toolbar",                    
                    borderless:true,                    
                    paddingY:2,
                    //css:"webix_dark",
                    cols:[
                        {
                            view:"button",
                            type:"icon",
                            icon: "mdi mdi-calculator",
                            label:"Печать",
                            width:150,
                            on:{
                                'onItemClick': function(id){
                                    //проверка заполнения реквизитов
                                    self.props.mdoRecount();
                                }
                            }
                        },
                        {},
                        {
                            view:"button",
                            type:"icon",
                            icon: "mdi mdi-percent",
                            label:"Коэффициенты",
                            width:150,
                            on:{
                                'onItemClick': function(id){
                                    self.props.formCoefficients(true);
                                }
                            }
                        },                        
                    ]
                },
                {
                    view:"datatable",                    
                    id:this.id,
                    select:"cell",
                    multiselect:false,
                    editable:true,
                    editaction:"click",
                    css:'box_shadow',
                    borderless:true,
                    headermenu:true,
                    scroll:false,
                    css:"webix_header_border webix_data_border",
                    columns:[
                        { id:"step", header:'', disabled:true,  width:50,},
                        { id:"business", header:{text:"Деловые",}, editor:"text", fillspace:true,
                            editFormat:function(value){return webix.i18n.intFormat(value);},
                            format:function(value){return webix.i18n.intFormat(value);},
                            editParse:function(value){return webix.i18n.intFormat(value);},
                        },
                        { id:"halfbusiness", header:{text:"Полуделовые",}, editor:"text",fillspace:true,
                            editFormat:function(value){return webix.i18n.intFormat(value);},
                            format:function(value){return webix.i18n.intFormat(value);},
                            editParse:function(value){return webix.i18n.intFormat(value);},
                        },
                        { id:"firewood", header:{text:"Дровяные",}, editor:"text", fillspace:true,
                            editFormat:function(value){return webix.i18n.intFormat(value);},
                            format:function(value){return webix.i18n.intFormat(value);},
                            editParse:function(value){return webix.i18n.intFormat(value);},                            
                        },
                    ],
                    on:{
                        "onAfterEditStop":function(state, editor, ignoreUpdate){
                            if(!ignoreUpdate) {
                                let item    = this.getItem(editor.row)
                                self.props.updateStep(item)
                            }
                        },
                        "onKeyPress":function(code){
                            if (code == 13){
                                var now = this.getEditor();
                                var next = this.data.getNextId(now.row);
                                webix.delay(function(){
                                if (next)
                                    this.edit({row:next, column:now.column});
                                }, this);
                            }
                        },
                    }
                },
            ]
        }  
        
        window.webix.ui(ui, $$(this.id))  


    }

    componentDidMount(){}

    componentWillReceiveProps(nextProps) {
        if((nextProps.conteinerReady) && (!this.props.conteinerReady)){
            this.initUI()
        }
        if(nextProps.plotObject){
            this.feelData(nextProps)
        }
    }

    shouldComponentUpdate(nextProps, nextState){
        return false;
    }

    componentWillUnmount(){
        common.uiDestructor(this)
    }

    render() {
        return null
    }
}