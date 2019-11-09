import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';

export default class ComponentCoefficients extends Component {

    constructor(props) {
        super(props);
        this.id = 'plot_coefficients';
        this.typesrates = undefined;
    }

    updateUI(props){
        let coefficientsrandom = [] 
        let typesratesID  = props.property.taxation.typesrates                        
        this.typesrates   = props.typesrates.find(item => item.id == typesratesID); 
        if(this.typesrates ){
            coefficientsrandom = this.typesrates.coefficientsrandom
        }
        $$(this.id+"_datatable").refreshColumns([
            { id:"name", header:["Произвольные коэффициенты"],  editor:"combo", options:coefficientsrandom, fillspace:true},                
            { id:"value", header:{text:"Значение",}, editor:"text", numberFormat:"1.111,00",width:100,},
        ]);
    }


    initUI(){

        let self = this

        let table = {
            view:"datatable",
            id:self.id+"_datatable",
            select:"cell",
            multiselect:false,
            editable:true,
            editaction:"dblclick",
            css:'box_shadow',
            borderless:true,            
            columns:[],
            data: [],
            rules:{
                "name": webix.rules.isNotEmpty,
                "value": webix.rules.isNotEmpty,
            }, 
            on:{
                "onAfterEditStop":function(state, editor, ignoreUpdate){
                    if(!ignoreUpdate) {
                        if(editor.column == 'name'){
                            let row    = this.getItem(editor.row)
                            row.value = 0
                            if(self.typesrates.coefficientsrandom.length){
                                let item   = self.typesrates.coefficientsrandom.find(item => item.id == state.value);
                                if(item) row.value = item.percent
                            }     
                            this.updateItem(editor.row, row)
                        }
                    }
                },
            }    
        }

        let head = {
            view:"toolbar",
            id:self.id+"_head",
            width:24,
            cols:[
                {
                    view:"button",
                    id:self.id+"_save",
                    type:"icon",
                    tooltip:"Сохранить и закрыть",
                    icon: "mdi mdi-pencil",
                    label:"Сохранить",
                    width:110,
                    align:"center",
                    on:{
                        'onItemClick': function(id){
                            let values = {
                                //coefficientsrandom:$$(self.id).serialize(),
                            }
                            //self.props.saveTable(values);
                        }
                    }
                },                    
                {},
                {
                    view:"icon",
                    id:self.id+"_close",
                    tooltip:"Закрыть",
                    icon: "mdi mdi-close",
                    on:{
                        'onItemClick': function(id){
                            self.props.formCoefficients(false);                           
                        }
                    }
                }
            ]
        }

        let toolbar = {
            view:"toolbar",
            id:self.id+"_toolbar",
            width:24,
            cols:[               
                {
                    view:"button",
                    id:self.id+"_add",
                    type:"icon",
                    tooltip:"Добавить строку",
                    icon: "mdi mdi-plus",
                    width:24,
                    align:"center",
                    on:{
                        'onItemClick': function(id){
                            $$(self.id+"_datatable").add({});
                        }
                    }
                },               
                {
                    view:"button",
                    id:self.id+"_delete",
                    type:"icon",
                    tooltip:"Удалить строку",
                    icon: "mdi mdi-delete",
                    width:24,
                    align:"center",
                    on:{
                        'onItemClick': function(id){
                            if($$(self.id+"_datatable").getSelectedId()){
                                $$(self.id+"_datatable").remove($$(self.id+"_datatable").getSelectedId());
                            }                            
                        }
                    }
                },
            ]
        }

        let form = {
            view:"form", 
            id:self.id+"_form",
            elements:[
                {cols:[
                    {view:"label",label:"Коэффициент индексации ставок",  labelWidth:250,width:400,},                   
                    {view:"text",  name:"coefficientsindexing",format:"111,00",width:100,},                   
                ]},
                {cols:[
                    {view:"select", label:"Коэффициент на форму рубки", name:"formCutting", options:self.props.enumerations.formCutting,labelWidth:250,width:400,},
                    {view:"text", name:"coefficientsformcutting",format:"111,00",width:100,},                
                ]},
                {cols:[
                    {view:"select", label:"Коэффициент на ликвидный запас", name:"rangesLiquidation", options:self.props.enumerations.rangesLiquidation,labelWidth:250,width:400,},
                    {view:"text",  name:"coefficientsrangesliquidation",format:"111,00",width:100,},                
                ]},
                {cols:[
                    {view:"select", label:"Коэффициент на поврежденность", name:"damage", options:self.props.enumerations.damage,labelWidth:250,width:400,},
                    {view:"text", name:"coefficientsdamage",format:"111,00",width:100,},                
                ]}
            ],
        }
        var conteiner = {
            view:"window",
            id:self.id + "_window",
            move:true,
            zIndex:100,
            width: 700,
            height: 400,
            resize: true,
            head:head,
            position:"center",
            body: {
                rows:[
                    form,
                    toolbar,
                    table
                ]
            },
        };
        self.ui = window.webix.ui(conteiner);

        $$(self.id+"_form").elements["formCutting"].attachEvent("onChange", function(newv, oldv){            
            let values = $$(self.id+"_form").getValues()
            values.coefficientsformcutting = 0
            if(self.typesrates.coefficientsformcutting.length){
                let item   = self.typesrates.coefficientsformcutting.find(item => item.formCutting == newv);
                if(item) values.coefficientsformcutting = item.percent
            }            
            $$(self.id+"_form").setValues(values)
        }); 
        $$(self.id+"_form").elements["rangesLiquidation"].attachEvent("onChange", function(newv, oldv){            
            let values = $$(self.id+"_form").getValues()
            values.coefficientsrangesliquidation = 0
            if(self.typesrates.coefficientsrangesliquidation.length){
                let item   = self.typesrates.coefficientsrangesliquidation.find(item => item.rangesLiquidation == newv);
                if(item) values.coefficientsrangesliquidation = item.percent
            } 
            $$(self.id+"_form").setValues(values)
        }); 
        $$(self.id+"_form").elements["damage"].attachEvent("onChange", function(newv, oldv){            
            let values = $$(self.id+"_form").getValues()
            values.coefficientsdamage = 0
            if(self.typesrates.coefficientsdamage.length){
                let item   = self.typesrates.coefficientsdamage.find(item => item.damage == newv);
                if(item) values.coefficientsdamage = item.percent
            } 
            $$(self.id+"_form").setValues(values)
        });
     
    }

    componentWillReceiveProps(nextProps) {
                
        if((nextProps.conteinerReady) && (!this.props.conteinerReady)){
            this.initUI()
        }
        if(nextProps.openCoefficients){
            //$$(this.id).clearAll();
            //$$(this.id).define("data",nextProps.table);
           // $$(this.id).refresh();
            this.updateUI(nextProps)
            this.ui.show();
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
        return null
    }

}