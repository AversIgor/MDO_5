import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';
import * as common from '../reference/common';

export default class ComponentRecount extends Component {

    constructor(props) {
        super(props);
        this.id         = 'plot_recount';   
        this.ui         = [];   
                
    }   
    
    feelData(recount) {
        $$(this.id).clearAll();
        for (let i = 0; i < recount.length; i++) {            
            let objectTaxation = this.props.enumerations.objectTaxation.find(item => item.id == recount[i].objectTaxation);
            let node_OT = {
               id:recount[i].id, 
               value:objectTaxation.value+ "  ("+recount[i].areacutting+" га.)",
               data:[],
            }
            $$(this.id).data.add(node_OT,);
        }
    }

    //обновления дерева на основе данных  веденых в форме редактирования дерева
    updateData(values) {
   
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

        /*let treeData = []
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
        $$(this.id).refresh();*/
    }


    treeEdit(level,mode) { 
        let selectedItem = $$(this.id).getSelectedItem()
        if(mode == 'Добавить'){
            //добавление
            if(level == 1){
                //добавляем объект таксации
                $$(this.id+"_form_objectTaxation").setValues({
                    id: webix.uid(),
                    objectTaxation: 1, 
                    areacutting: undefined,
                });
                $$(this.id+"_window_objectTaxation").show();            
            }
        }
        if(mode == 'Изменить'){
            //редактирование
            if(level == 1){
                //редактируе объект таксации
                let row = this.props.recount.find(item => item.id == selectedItem.id);
                $$(this.id+"_form_objectTaxation").setValues(row);
                $$(this.id+"_window_objectTaxation").show();            
            }
        }
        if(mode == 'Удалить'){
            //удаление
            if(level == 1){
                this.props.deleteObjectTaxation(selectedItem.id);                       
            }
        }

        
        /*if(edit){
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
        windowEdit.show()*/
    }

    initUI(props){
        let self = this;

        let ui = {            
            rows:[
                {
                    view:"toolbar",
                    borderless:true,
                    padding:5,
                    cols:[
                        {
                            view:"button",
                            type:"icon",
                            icon: "mdi mdi-plus",
                            label:"Объект таксации",
                            width:180,
                            align:"center",
                            on:{
                                'onItemClick': function(id){
                                    self.treeEdit(1,'Добавить');
                                }
                            }
                        },
                        {
                            view:"button",
                            type:"icon",
                            icon: "mdi mdi-plus",
                            label:"Породу",
                            width:100,
                            align:"center",
                            on:{
                                'onItemClick': function(id){
                                    self.treeEdit(2,'Добавить');
                                }
                            }
                        },
                    ]
                },                  
                {view:"tree",id:this.id,select:true,borderless:true,data: []},
            ]
        }

        let contextmenu = {view:"contextmenu",id:"cmenu",data:["Изменить","Удалить"],
            on:{
                onItemClick:function(id){
                    let selectedItem = $$(self.id).getSelectedItem()
                    if(selectedItem){
                        self.treeEdit(selectedItem.$level,this.getItem(id).value);
                    }                               
                }
            }
        };

        let objectTaxationEdit = {view:"popup",id:this.id+"_window_objectTaxation",position:"centre",            
            body:{
                view:"form",
                id:this.id+"_form_objectTaxation", 
                width:400,               
                elements:[
                    {
                        cols:[
                            {view:"text",name:"id",hidden:true,},
                            {view:"select", label:"Объект таксации", labelPosition:"top", value:1, name:"objectTaxation", options:props.enumerations.objectTaxation,required:true},
                            {view:"text",label:"Площадь, га", labelPosition:"top", name:"areacutting",required:true,format:"111,0000",}, 
                        ]
                    },                    
                    { 
                        view:"button", value:"Сохранить", align:"right", width:150,
                        click:function(){
                            if (this.getParentView().validate()){
                                self.props.updateObjectTaxation(this.getParentView().getValues());
                                $$(self.id+"_window_objectTaxation").hide();
                            }
                            else{
                                webix.message({ type:"error", text:"Необходимо заполнить все поля формы" });
                            }
                        },                    
                    },
                ],
            }
        };

        let breedEdit = {view:"popup",id:this.id+"_window_breed",position:"centre",            
            body:{
                view:"form",
                id:this.id+"_form_breed", 
                width:400,               
                elements:[
                    {
                        cols:[
                            {view:"text",name:"id",hidden:true,},
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
                        view:"button", value:"Сохранить", align:"right", width:150,
                        click:function(){
                            if (this.getParentView().validate()){
                                self.props.updateObjectTaxation(this.getParentView().getValues());
                                $$(self.id+"_window_breed").hide();
                            }
                            else{
                                webix.message({ type:"error", text:"Необходимо заполнить все поля формы" });
                            }
                        },                    
                    },
                ],
            }
        };

        window.webix.ui(ui, $$(this.id))        
        this.ui.push(window.webix.ui(contextmenu))
        $$("cmenu").attachTo($$(this.id));
        this.ui.push(window.webix.ui(objectTaxationEdit))   
        this.ui.push(window.webix.ui(breedEdit))    

    }

    componentDidMount(){}

    componentWillReceiveProps(nextProps) {
        if((nextProps.conteinerReady) && (!this.props.conteinerReady)){
            this.initUI(nextProps)
        }
        this.feelData(nextProps.recount)
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