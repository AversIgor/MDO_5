import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';

export default class ComponentСoefficientsrandom extends Component {

    constructor(props) {
        super(props);
        this.tableid = 'coefficientsrandom_datatable';
    }

    componentDidMount(){

        let self = this

        let table = {
            view:"datatable",
            id:self.tableid,
            select:"cell",
            multiselect:false,
            editable:true,
            editaction:"dblclick",
            css:'box_shadow',
            borderless:true,
            columns:[
                { id:"value", header:["Наименование"],  editor:"text", fillspace:true,sort:"string"},
                { id:"percent", header:{text:"Коэффициент",}, editor:"text", numberFormat:"1.111,00",fillspace:true},
            ],
            data: [],
            rules:{
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
                                coefficientsrandom:$$(self.tableid).serialize(),
                            }
                            self.props.saveTable(values);
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
                            $$(self.tableid).add({});
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
                            if($$(self.tableid).getSelectedItem()){
                                let copy = window.webix.copy($$(self.tableid).getSelectedItem());
                                delete copy.id;
                                $$(self.tableid).add(copy)                             
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
                            if($$(self.tableid).getSelectedId()){
                                $$(self.tableid).remove($$(self.tableid).getSelectedId());
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
                            self.props.closeTable();                           
                        }
                    }
                }
            ]
        }

        var conteiner = {
            view:"window",
            id:"coefficientsrandom_window",
            move:true,
            zIndex:100,
            width: 800,
            height: 400,
            resize: true,
            move:true,
            head:head,
            position:"center",
            body: table,
        };
        this.ui = window.webix.ui(conteiner);

    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.openNameTable == 'coefficientsrandom'){
            $$(this.tableid).clearAll();
            $$(this.tableid).define("data",nextProps.table);
            $$(this.tableid).refresh();
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