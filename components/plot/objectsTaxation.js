import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';
import * as common from '../reference/common';

export default class ComponentObjectsTaxation extends Component {

    constructor(props) {
        super(props);
        this.id         = 'plot_objectsTaxation';   
        this.ui         = [];   
        this.data       = [];                     
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

    //обновления дерева на основе данных  веденых в форме редактирования дерева
    updateData(values) {
        //Обновления объекта данных со ссылками, и на его основании обновления дерева        
        //обновим объект таксации
        let node_objectTaxation = this.data.find(item => item.objectTaxation == values.objectTaxation);
        if(!node_objectTaxation){
            node_objectTaxation = {
                objectTaxation: values.objectTaxation,
                objectsBreed:[],
            };
            this.data.push(node_objectTaxation)
        }
        node_objectTaxation.areacutting = values.areacutting;        
        //обновим породу
        let node_breed = node_objectTaxation.objectsBreed.find(item => item.breed == values.breed);
        if(!node_breed){
            node_breed = {
                breed: values.breed,
            };
            node_objectTaxation.objectsBreed.push(node_breed)
        }
        node_breed.rank = values.rank; 

        let treeData = []
        for (let i = 0; i < this.data.length; i++) {            
            let objectTaxation = this.props.enumerations.objectTaxation.find(item => item.id == this.data[i].objectTaxation);
            let node_OT = {
               id:objectTaxation.id, 
               value:objectTaxation.value+ "  ("+this.data[i].areacutting+" га.)",
               data:[],
            }
            treeData.push(node_OT)
            let objectsBreed = this.data[i].objectsBreed;
            for (let j = 0; j < objectsBreed.length; j++) { 
                let objectBreed = this.props.breed.find(item => item.id == objectsBreed[j].breed);
                let node_B = {
                    id:objectTaxation.id+'.'+objectBreed.id, 
                    value:objectBreed.value+ "  (разряд высот - "+objectsBreed[j].rank+")",
                }
                node_OT.data.push(node_B)
            }
        }  

        $$(this.id).define("data", treeData);
        $$(this.id).refresh();
    }


    openWindowEdit(param) {
        let item = $$(this.id).getSelectedItem()
        let windowEdit = $$(this.id+"_window");
        if(param){

        }
        windowEdit.show()
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
                            self.openWindowEdit()
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
                    webix.message("</i> <br/>Context menu item: <i>"+this.getItem(id).value+"</i>");
                }
            }
        };

        let windowEdit = {
            view:"popup",
            id:this.id+"_window", 
            position:"top",            
            body:{
                view:"form", 
                width:800,               
                elements:[
                    {
                        cols:[
                            {view:"select", label:"Объект таксации",  value:1, name:"objectTaxation", options:self.props.enumerations.objectTaxation,required:true},
                            {view:"text",label:"Площадь, га", name:"areacutting",required:true,format:"111,0000",}, 
                        ]
                    },
                    {
                        cols:[
                            {view:"select", label:"Порода",  name:"breed", options:self.props.breed,required:true,
                            on:{
                                onChange(newv, oldv){                                    
                                    if(newv != oldv){
                                        //сформируем список разрядов высот
                                        let breed = self.props.breed.find(item => item.id == newv);
                                        if(breed){
                                            let rank = [];
                                            for (let property in breed.table.sorttables) {
                                                rank.push(property)
                                            }
                                            $$("rankSelect").define('options',rank)
                                            $$("rankSelect").refresh()
                                        }
                                    }
                                }
                              }
                            },
                            {view:"select",id:'rankSelect', label:"Разряд высот", name:"rank", options:[],required:true}, 
                        ]
                    },
                    { 
                        view:"button", value:"Сохранить", align:"right", width:200,
                        click:function(){
                            if (this.getParentView().validate())
                                self.updateData(this.getParentView().getValues())
                            else
                                webix.message({ type:"error", text:"Необходимо заполнить все поля формы" });
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