import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';
import * as common from '../reference/common';

export default class ComponentRecount extends Component {

    constructor(props) {
        super(props);
        this.id         = 'plot_recount';   
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
                id: webix.uid(),
                objectTaxation: values.objectTaxation,
                objectsBreed:[],
            };
            this.data.push(node_objectTaxation)
        }
        node_objectTaxation.areacutting = values.areacutting;        
        //обновим породу

        let node_breed = node_objectTaxation.objectsBreed.find(function(item, index, array) {
            if((item.breed == values.breed) && (item.rank == values.rank)){
                return true
            }
        });
        if(!node_breed){
            node_breed = {
                id:webix.uid(),
                breed: values.breed,
                rank: values.rank,
            };
            node_objectTaxation.objectsBreed.push(node_breed)
        }

        let treeData = []
        for (let i = 0; i < this.data.length; i++) {            
            let objectTaxation = this.props.enumerations.objectTaxation.find(item => item.id == this.data[i].objectTaxation);
            let node_OT = {
               id:this.data[i].id, 
               value:objectTaxation.value+ "  ("+this.data[i].areacutting+" га.)",
               data:[],
            }
            treeData.push(node_OT)
            let objectsBreed = this.data[i].objectsBreed;
            for (let j = 0; j < objectsBreed.length; j++) { 
                let objectBreed = this.props.breed.find(item => item.id == objectsBreed[j].breed);
                let node_B = {
                    id:objectsBreed[j].id, 
                    value:objectBreed.value+ "  (разряд высот - "+objectsBreed[j].rank+")",
                }
                node_OT.data.push(node_B)
            }
        }  

        $$(this.id).define("data", treeData);
        $$(this.id).refresh();
    }


    openWindowEdit(edit) {          
        if(edit){
            let selectedItem = $$(this.id).getSelectedItem()
            if(!selectedItem){
                webix.message({ type:"error", text:"Не выбрана порода" });
                return
            }
            if(selectedItem.$level == 1){
                webix.message({ type:"error", text:"Укажите строку с породой" });
                return
            }
            let parentItem = this.data.find(item => item.id == selectedItem.$parent);
            if(parentItem){
                let dataItem = parentItem.objectsBreed.find(item => item.id == selectedItem.id);
                $$(this.id+"_form").setValues({
                    objectTaxation: parentItem.objectTaxation, 
                    areacutting: parentItem.areacutting,
                    breed: dataItem.breed,
                    rank: dataItem.rank,
                });
            }
        }else{
            $$(this.id+"_form").setValues({
                id: webix.uid(),
                objectTaxation: 1, 
                areacutting: undefined,
                breed: undefined,
                rank: undefined,
            });
        }
        let windowEdit = $$(this.id+"_window");
        windowEdit.show()
    }

    initUI(props){
        let self = this;

        let property = {
            rows:[
                {
                    view:"button", 
                    label:"Добавить", 
                    tooltip:'Добавить объект таксации',                 
                    inputWidth:100, 
                    on:{
                        'onItemClick': function(id){
                            self.openWindowEdit(false)
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
                    if(this.getItem(id).value == 'Добавить'){
                        self.openWindowEdit(false)
                    }
                    if(this.getItem(id).value == 'Изменить'){
                        self.openWindowEdit(true)
                    }
                    if(this.getItem(id).value == 'Удалить'){
                        //self.openWindowEdit(false)
                    }
                }
            }
        };

        let windowEdit = {
            view:"popup",
            id:this.id+"_window", 
            position:"centre",            
            body:{
                view:"form",
                id:this.id+"_form", 
                width:800,               
                elements:[
                    {
                        cols:[
                            {view:"select", label:"Объект таксации",  value:1, name:"objectTaxation", options:props.enumerations.objectTaxation,required:true},
                            {view:"text",label:"Площадь, га", name:"areacutting",required:true,format:"111,0000",}, 
                        ]
                    },
                    {
                        cols:[
                            {view:"select", label:"Порода",value:undefined,  name:"breed", options:props.breed,required:true,
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

    }

    componentDidMount(){
       
    }

    componentWillReceiveProps(nextProps) {

        if((nextProps.conteinerReady) && (!this.props.conteinerReady)){
            this.initUI(nextProps)
        }
        this.feelData(nextProps.props)

    }

    shouldComponentUpdate(nextProps, nextState){
        return false;
    }

    componentWillUnmount(){
        common.uiDestructor(this)
    }

    render() {
        return null
    }

}