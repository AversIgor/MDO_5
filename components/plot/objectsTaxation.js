import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';
import * as common from '../reference/common';

export default class ComponentObjectsTaxation extends Component {

    constructor(props) {
        super(props);
        this.id         = 'plot_objectsTaxation';   
        this.ui         = [];                        
    }   
    
    filterArray(array,params) {
        for (let i = 0; i < params.length; i++) {
            array = array.filter(item => item[params[i].field] == params[i].value);
        }  
        return array
    }

    feelData(props) {
        let data = []
        $$(this.id).define("data", data);
        $$(this.id).refresh();
    }

    updateData(values) {

        //Обновления объекта данных со ссылками, и на его основании обновления дерева


        let node_objectTaxation = undefined
        let array_objectTaxation = $$(this.id).find(function(obj){
            return obj.id == values.objectTaxation;
        })
        if(array_objectTaxation.length != 0){
            node_objectTaxation = array_objectTaxation[0];
        }else{
            node_objectTaxation = $$(this.id).add({ 
                id:values.objectTaxation,
                value:"Новый объект",
            });
        }

    }

    componentDidMount(){
        let self = this;

        let property = {
            rows:[
                {
                    view:"button", 
                    label:"Добавить объект таксации",                   
                    inputWidth:250, 
                    on:{
                        'onItemClick': function(id){
                            let windowEdit = $$(self.id+"_window");
                            windowEdit.show()
                        }
                    }
                },
                {
                    view:"tree",
                    id:this.id,
                    select:true,
                    borderless:true,
                    data: []
                },
            ]
        }

        let contextmenu = {
            view:"contextmenu",
            id:"cmenu",
            data:["Добавить","Изменить","Удалить"],
            on:{
                onItemClick:function(id){
                    var context = this.getContext();
                    var list = context.obj;
                    var listId = context.id;
                    webix.message("List item: <i>"+list.getItem(listId).title+"</i> <br/>Context menu item: <i>"+this.getItem(id).value+"</i>");
                }
            }
        };

        let windowEdit = {
            view:"popup",
            id:this.id+"_window", 
            position:"center",            
            body:{
                view:"form", 
                width:800,               
                elements:[
                    {
                        cols:[
                            {view:"select", label:"Объект таксации",  value:1, name:"objectTaxation", options:self.props.enumerations.objectTaxation,required:true},
                            {view:"text",label:"Площадь, га",  value:0.000, name:"areacutting",required:true,format:"111,0000",}, 
                        ]
                    },
                    {
                        cols:[
                            {view:"select", label:"Порода",  value:0, name:"breed", options:self.props.breed,required:true},
                            {view:"select", label:"Разряд высот",  value:1, name:"rank", options:[],required:true}, 
                        ]
                    },
                    { 
                        view:"button", value:"Сохранить", align:"right", width:200,
                        click:function(){
                            if (this.getParentView().validate())
                                self.updateData(this.getParentView().getValues())
                            else
                                webix.message({ type:"error", text:"Form data is invalid" });
                        },                    
                    },
                ],
                elementsConfig:{
                    on:{
                        onChange:function(new_v,old_v){
                            //$$(self.id).validate();
                        },                    
                    },
                    labelWidth:120,
                }
            }
        };

        window.webix.ui(property, $$(this.id))        
        this.ui.push(window.webix.ui(contextmenu))
        $$("cmenu").attachTo($$(this.id));
        this.ui.push(window.webix.ui(windowEdit))        

        this.feelData(this.props)

       
    }

    componentWillReceiveProps(nextProps) {

        this.feelData(nextProps.props)

    }

    shouldComponentUpdate(){
        return false;
    }

    componentWillUnmount(){
        common.uiDestructor(this)
    }

    render() {
        return null
    }

}