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

        let table = {
            view:"datatable",
            id:'feedrates_datatable',
            select:"cell",
            multiselect:false,
            editable:true,
            editaction:"click",
            css:'box_shadow',
            borderless:true,
            columns:[
                { id:"breed", header:["Порода"],  editor:"combo", options:this.props.breed, fillspace:true},
                { id:"ranktax", header:{text:"Разряд такс",}, editor:"combo", options:this.props.rankTax,fillspace:true},
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
                    value:"Сохранить",
                    width:100,
                    align:"center",
                    on:{
                        'onItemClick': function(id){
                            let values = $$("breed_form").getValues()
                            //self.props.handlerEdit(self.props.editObject,values);
                        }
                    }
                },
                {
                    view:"button",
                    value:"Добавить",
                    width:100,
                    align:"center",
                    on:{
                        'onItemClick': function(id){
                            let rowid = $$("feedrates_datatable").add({});
                        }
                    }
                },
                {},
            ]
        }

        var conteiner = {
            view:"window",
            id:"feedrates_window",
            move:true,
            zIndex:100,
            width: 600,
            move:true,
            head:head,
            position:"center",
            body: table,
        };

        this.ui = window.webix.ui(conteiner);

    }


    componentWillReceiveProps(nextProps) {
        if(nextProps.feedrates){
            this.ui.show();

            /*let publication_options = []
            for (var i = 0; i < nextProps.publications.length; i++) {
                publication_options.push({
                    id:nextProps.publications[i].id,
                    value:nextProps.publications[i].name
                })
            }
            $$("publication").define("options",publication_options)
            $$("publication").refresh();


            let values = {
                name: nextProps.editObject.name,
                kodGulf: nextProps.editObject.kodGulf,
            }

            if(nextProps.editObject.publication){
                values.publication = nextProps.editObject.publication.id
            }
            if(nextProps.editObject.table){
                values.table = nextProps.editObject.table.id
            }
            if(nextProps.editObject.tablefirewood){
                values.tablefirewood = nextProps.editObject.tablefirewood.id
            }
            $$("breed_form").setValues(values);*/


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