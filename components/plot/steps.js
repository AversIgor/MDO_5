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
        let curentRecount = props.curentRecount
        $$(this.id).editCancel();
        $$(this.id).clearAll()
        if(curentRecount){
            if(curentRecount.hasOwnProperty('steps')){
                for (let i = 0; i < curentRecount.steps.length; i++) {                    
                    let objectStep = curentRecount.objectsStep.find(item => item.step == curentRecount.steps[i]);
                    let newRow = {
                        step:curentRecount.steps[i]
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
  
    initUI(props){
        let self = this;

        let ui = {
            paddingY:5,
            rows:[
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
                            let item    = this.getItem(editor.row)
                            self.props.updateStep(item)
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
            this.initUI(nextProps)
        }
        this.feelData(nextProps)
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