import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';

export default class ComponentBreedForm extends Component {

    constructor(props) {
        super(props);
    }

    filterTables = (publicationID) => {

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

    }


    componentDidMount(){

        let self = this;
        let form = {
            view:"form",
            id:"breed_form",
            scroll:false,
            width:600,
            autoheight:true,
            elements:[
                { cols:[
                    { view:"text", name:"name", label:"Наименование", width:450, labelWidth:160},
                    { view:"text", name:"kodGulf", label:"Код",labelWidth:40},
                ]},
                { view:"select", id:"publication", name:"publication", label:"Издание", labelWidth:160,options:[],
                    on:{
                        onChange:function(newv, oldv){
                            if(newv){
                                self.filterTables(newv)
                            }
                        }
                    }},
                { template:"Сортиментная таблица", type:"section"},
                { view:"select", id:"table", name:"table", label:"основная", labelWidth:160,options:[]},
                { view:"select", id:"tablefirewood", name:"tablefirewood", label:"для дровяных стволов", labelWidth:160,options:[]},
            ]
        };

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
                            self.props.handlerEdit(self.props.editObject,values);
                        }
                    }
                },
                {
                    view:"button",
                    value:"Отмена",
                    width:100,
                    align:"center",
                    on:{
                        'onItemClick': function(id){
                            this.getParentView().getParentView().hide();
                        }
                    }
                },
                {},
            ]
        }

        var conteiner = {
            view:"window",
            id:"breed_window",
            modal:true,
            container:ReactDOM.findDOMNode(this.refs.root),
            zIndex:100,
            width: 600,
            move:true,
            head:head,
            position:"center",
            body: form,
        };

        this.ui = window.webix.ui(conteiner);

    }


    componentWillReceiveProps(nextProps) {
        if(nextProps.editObject){
            this.ui.show();

            let publication_options = []
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
            $$("breed_form").setValues(values);


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
        return (
            <div  ref="root"></div>)
    }

}