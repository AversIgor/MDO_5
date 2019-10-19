import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';

export default class ComponentFeedrates extends Component {

    constructor(props) {
        super(props);
    }

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
                    icon: "mdi mdi-pencil",
                    label:"Сохранить",
                    width:110,
                    align:"center",
                    on:{
                        'onItemClick': function(id){
                            let values = {
                                feedrates:$$("feedrates_datatable").serialize(),
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
                            $$("feedrates_datatable").add({});
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
                    icon: "mdi mdi-delete",
                    width:24,
                    align:"center",
                    on:{
                        'onItemClick': function(id){
                            if($$("feedrates_datatable").getSelectedId()){
                                $$("feedrates_datatable").remove($$("feedrates_datatable").getSelectedId());
                            }                            
                        }
                    }
                },  
                {
                    view:"button",
                    id:'feedrates_window_icon_fill',
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
                    id:"feedrates_window_icon_close",
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
        if(nextProps.id){
            $$("feedrates_datatable").clearAll();
            $$("feedrates_datatable").define("data",nextProps.feedrates);
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