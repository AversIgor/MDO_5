import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';

export default class ComponentFeedrates extends Component {

    constructor(props) {
        super(props);
    }

    /*filterTables = (publicationID) => {

        let table_options = [{id:'',value:''}]
        for (var i = 0; i < this.props.tables.length; i++) {
            if(this.props.tables[i].publication.id == publicationID){
                table_options.push({
                    id:this.props.tables[i].id,
                    value:this.props.tables[i].name
                })
            }
        }
        $$("table").define("options",table_options)
        $$("table").refresh();

        $$("tablefirewood").define("options",table_options)
        $$("tablefirewood").refresh();

    }*/


    componentDidMount(){

        let self = this

        let table = {
            view:"datatable",
            id:'feedrates_datatable',
            select:"cell",
            multiselect:false,
            editable:true,
            editaction:"dblclick",
            css:'box_shadow',
            borderless:true,
            columns:[
                { id:"breed", header:["Порода"],  editor:"combo", options:this.props.breed, fillspace:true,sort:"string"},
                { id:"ranktax", header:{text:"Разряд такс",}, editor:"combo", options:this.props.rankTax,fillspace:true,sort:"string"},
                { id:"large", header:{text:"Крупная",}, editor:"text", numberFormat:"1.111,00",fillspace:true},
                { id:"average", header:{text:"Средняя",}, editor:"text", numberFormat:"1.111,00",fillspace:true},
                { id:"small", header:{text:"Мелкая",}, editor:"text", numberFormat:"1.111,00",fillspace:true},
                { id:"firewood", header:{text:"Дрова",}, editor:"text", numberFormat:"1.111,00",fillspace:true},
            ],
            //on:common.creatOn(this),
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
                    id:'feedrates_window_icon_edit',
                    type:"icon",
                    tooltip:"Сохранить и закрыть",
                    icon: "edit",
                    label:"Сохранить",
                    width:100,
                    align:"center",
                    on:{
                        'onItemClick': function(id){
                            let values = {
                                feedrates:$$("feedrates_datatable").serialize(),
                            }
                            self.props.seve(self.props.feedrates,values);
                        }
                    }
                },
                {
                    view:"button",
                    type:"icon",
                    tooltip:"Добавить строку",
                    icon: "plus",
                    width:30,
                    align:"center",
                    on:{
                        'onItemClick': function(id){
                            $$("feedrates_datatable").add({});
                        }
                    }
                },
                {
                    view:"button",
                    type:"icon",
                    tooltip:"Скопировать строку",
                    icon: "copy",
                    width:30,
                    align:"center",
                    on:{
                        'onItemClick': function(id){
                            if($$("feedrates_datatable").getSelectedItem()){
                                let copy = window.webix.copy($$("feedrates_datatable").getSelectedItem());
                                delete copy.id;
                                $$("feedrates_datatable").add(copy)                             
                            }                            
                        }
                    }
                },
                {
                    view:"button",
                    type:"icon",
                    tooltip:"Удалить строку",
                    icon: "cut",
                    width:30,
                    align:"center",
                    on:{
                        'onItemClick': function(id){
                            if($$("feedrates_datatable").getSelectedId()){
                                $$("feedrates_datatable").remove($$("feedrates_datatable").getSelectedId());
                            }                            
                        }
                    }
                },                
                {},
                {
                    view:"icon",
                    id:"feedrates_window_icon_close",
                    tooltip:"Закрыть",
                    icon: "times",
                    click: "$$('feedrates_window_icon_close').getParentView().getParentView().hide()"
                }
            ]
        }

        var conteiner = {
            view:"window",
            id:"feedrates_window",
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



    sortbBreedRanktax() {
        $$("feedrates_datatable").markSorting("breed", "asc");
        $$("feedrates_datatable").sort(function(a,b){
            if (a.breed == b.breed)
                return (a.ranktax>b.ranktax)?1:-1;
            else
                return (a.breed>b.breed)?1:-1;
        });
        
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.feedrates){
            $$("feedrates_datatable").clearAll();
            $$("feedrates_datatable").define("data",nextProps.feedrates.feedrates);
            $$("feedrates_datatable").refresh();
            this.sortbBreedRanktax();    
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