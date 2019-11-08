import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';

export default class ComponentCoefficients extends Component {

    constructor(props) {
        super(props);
        this.id = 'plot_coefficients';
    }

    initUI(props){

        let self = this

        let table = {
            view:"datatable",
            id:self.id,
            select:"cell",
            multiselect:false,
            editable:true,
            editaction:"click",
            css:'box_shadow',
            borderless:true,
            columns:[
                { id:"type", header:["Вид коэффициента"],  editor:"combo", options:props.enumerations.typesCoefficients, fillspace:true},
                { id:"condition", header:["Условие/наименование"],  editor:"combo", options:[], fillspace:true},                
                { id:"value", header:{text:"Значение",}, editor:"text", numberFormat:"1.111,00",fillspace:true},
            ],
            data: [],
            rules:{
                "type": webix.rules.isNotEmpty,
                "condition": webix.rules.isNotEmpty,
                "value": webix.rules.isNotEmpty,
            },     
        }

        let head = {
            view:"toolbar",
                width:24,
            cols:[
                {
                    view:"button",
                    type:"icon",
                    tooltip:"Сохранить и закрыть",
                    icon: "mdi mdi-pencil",
                    label:"Сохранить",
                    width:110,
                    align:"center",
                    on:{
                        'onItemClick': function(id){
                            let values = {
                                coefficientsrandom:$$(self.id).serialize(),
                            }
                            //self.props.saveTable(values);
                        }
                    }
                },
                {
                    view:"button",
                    type:"icon",
                    tooltip:"Добавить строку",
                    icon: "mdi mdi-plus",
                    width:24,
                    align:"center",
                    on:{
                        'onItemClick': function(id){
                            $$(self.id).add({});
                        }
                    }
                },
                {
                    view:"button",
                    type:"icon",
                    tooltip:"Скопировать строку",
                    icon: "mdi mdi-content-copy",
                    width:24,
                    align:"center",
                    on:{
                        'onItemClick': function(id){
                            if($$(self.id).getSelectedItem()){
                                let copy = window.webix.copy($$(self.id).getSelectedItem());
                                delete copy.id;
                                $$(self.id).add(copy)                             
                            }                            
                        }
                    }
                },
                {
                    view:"button",
                    type:"icon",
                    tooltip:"Удалить строку",
                    icon: "mdi mdi-delete",
                    width:24,
                    align:"center",
                    on:{
                        'onItemClick': function(id){
                            if($$(self.id).getSelectedId()){
                                $$(self.id).remove($$(self.id).getSelectedId());
                            }                            
                        }
                    }
                },                     
                {},
                {
                    view:"icon",
                    tooltip:"Закрыть",
                    icon: "mdi mdi-close",
                    on:{
                        'onItemClick': function(id){
                            //self.props.closeTable();                           
                        }
                    }
                }
            ]
        }

        var conteiner = {
            view:"window",
            id:this.id + "_window",
            move:true,
            zIndex:100,
            width: 800,
            height: 400,
            resize: true,
            head:head,
            position:"center",
            body: table,
        };
        this.ui = window.webix.ui(conteiner);

        $$(self.id).attachEvent("onBeforeEditStart", function(cell){
            if (cell.column == "condition"){
                //узнаем что за вид коэффициента
                var collection = this.getColumnConfig(cell.column).collection;
                console.log(collection)

                collection.clearAll();
                let item = this.getItem(cell.row)
                let options = []
                if(item.type){
                    if(item.type == 2){
                        options = self.props.enumerations.formCutting
                    }
                    if(item.type == 3){
                        options = self.props.enumerations.rangesLiquidation
                    }
                    if(item.type == 4){
                        options = self.props.enumerations.damage
                    }
                    if(item.type == 5){
                        let typesratesID = self.props.property.taxation.typesrates                        
                        let typesrates   = self.props.typesrates.find(item => item.id == typesratesID); 
                        if(typesrates){
                            options = typesrates.coefficientsrandom
                        }
                    }
                }
                collection.parse(options)
            }
            return true;
        });

    }

    componentWillReceiveProps(nextProps) {
                
        if((nextProps.conteinerReady) && (!this.props.conteinerReady)){
            this.initUI(nextProps)
        }
        if(nextProps.openCoefficients){
            //$$(this.id).clearAll();
            //$$(this.id).define("data",nextProps.table);
           // $$(this.id).refresh();
            this.ui.show();
        }else{
            //this.ui.hide();
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