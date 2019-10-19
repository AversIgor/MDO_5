import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';

export default class ComponentCoefficientsrangesliquidation extends Component {

    constructor(props) {
        super(props);
        this.tableid = 'coefficientsrangesliquidation_datatable';
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
            /*columns:[
                { id:"breed", header:["Порода"],  editor:"combo", options:this.props.breed, fillspace:true,sort:"string"},
                { id:"ranktax", header:{text:"Разряд такс",}, editor:"combo", options:this.props.rankTax,fillspace:true,sort:"string"},
                { id:"large", header:{text:"Крупная",}, editor:"text", numberFormat:"1.111,00",fillspace:true},
                { id:"average", header:{text:"Средняя",}, editor:"text", numberFormat:"1.111,00",fillspace:true},
                { id:"small", header:{text:"Мелкая",}, editor:"text", numberFormat:"1.111,00",fillspace:true},
                { id:"firewood", header:{text:"Дрова",}, editor:"text", numberFormat:"1.111,00",fillspace:true},
            ],*/
            data: [],
            rules:{
                "breed": webix.rules.isNotEmpty,
                "ranktax": webix.rules.isNotEmpty,
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
                                feedrates:$$(self.tableid).serialize(),
                            }
                            self.props.saveFeedrates(values);
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
                {
                    view:"button",
                    type:"icon",
                    tooltip:"Заполнить ставки платы по лесотаксовому району",
                    icon: "mdi mdi-cloud-download-outline",
                    label:"Заполнить",
                    width:110,
                    align:"center",
                    on:{
                        'onItemClick': function(id){
                            self.props.fillFeedrates(self.props.region,self.props.breed);
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
                            self.props.closeFeedrates();                           
                        }
                    }
                }
            ]
        }

        var conteiner = {
            view:"window",
            id:"rangesLiquidation_window",
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
        if(nextProps.opencoefficientsrangesliquidation){
            $$(this.tableid).clearAll();
            $$(this.tableid).define("data",nextProps.rangesLiquidation);
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