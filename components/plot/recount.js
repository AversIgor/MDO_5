import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';
import * as common from '../reference/common';

export default class ComponentRecount extends Component {

    constructor(props) {
        super(props);
        this.id         = 'plot_recount';   
        this.ui         = [];   
                
    }      
    
    feelData(recount,curentId) {
        $$(this.id).clearAll();
        for (let i = 0; i < recount.length; i++) {        
            let objectTaxation = this.props.enumerations.objectTaxation.find(item => item.id == recount[i].objectTaxation);
            let node_OT = {
               id:recount[i].id, 
               value:objectTaxation.value+ "  ("+recount[i].areacutting+" га.)",
               data:[],
            }
            $$(this.id).data.add(node_OT);
            for (let j = 0; j < recount[i].objectsBreed.length; j++) {
                let objectBreed = this.props.breed.find(item => item.id == recount[i].objectsBreed[j].breed);
                let node_B = {
                    id:recount[i].objectsBreed[j].id, 
                    value:objectBreed.value+ "  (разряд высот - "+recount[i].objectsBreed[j].rank+")",
                }
                $$(this.id).data.add(node_B,0,recount[i].id);
            }
        }

        if(!curentId){
            if(recount.length != 0){
                curentId = recount[recount.length-1].id
            }
        }
        if(curentId){
            $$(this.id).select(curentId)
            $$(this.id).openAll()
        }
        $$(this.id+'_buttonAdd').define("disabled",!curentId)
        $$(this.id+'_buttonAdd').refresh()
    }
    
    treeEdit(level,mode) { 
        let self = this
        
        if($$("plot_recount_form").elements.hasOwnProperty("id")){
            $$(this.id+"_form").removeView('fields'); 
        }       
        if(level == 1){
            let options = this.props.enumerations.objectTaxation
            if(this.props.property.taxation.methodTaxation == 2){
                //только лесосека в целом
                options = this.props.enumerations.objectTaxation.filter(item => item.id == 1);
            }
            $$(this.id+"_form").addView({
                id:'fields',
                cols:[
                    {view:"text",name:"id",hidden:true,},
                    {view:"select", label:"Объект таксации", labelPosition:"top", value:1, name:"objectTaxation", options:options,required:true},
                    {view:"text",label:"Площадь, га", labelPosition:"top", name:"areacutting",required:true,format:"111,0000",}, 
                ]
            },0);                   
        }else{
            $$(this.id+"_form").addView({
                id:'fields',
                cols:[
                    {view:"text",name:"id",hidden:true,},
                    {view:"text",name:"parentid",hidden:true,},
                    {view:"select", label:"Порода",value:undefined,labelPosition:"top",  name:"breed", options:this.props.breed,required:true,
                        on:{
                            onChange(newv, oldv){                                    
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
                    },
                    {view:"select",id:'rankSelect', label:"Разряд высот", labelPosition:"top",name:"rank", options:[],required:true}, 
                ]
            },0); 
        }

        $$(this.id+"_window").show();

        let selectedItem = $$(this.id).getSelectedItem()

        if(mode == 'Добавить'){
            //добавление
            if(level == 1){
                //добавляем объект таксации
                $$(this.id+"_form").setValues({
                    id: webix.uid(),
                    objectTaxation: 1, 
                    areacutting: undefined,
                });                            
            }else{
                //добавляе породу
                if(!selectedItem){
                    webix.message({ type:"error", text:"Укажите объект таксации" });
                    return                }
                let parentid = undefined
                if(selectedItem.$level == 1){
                    parentid = selectedItem.id;
                }
                if(selectedItem.$level == 2){
                    parentid = selectedItem.$parent;
                }
                $$(this.id+"_form").setValues({
                    id: webix.uid(),
                    parentid: parentid,
                    breed: undefined, 
                    rank: undefined,
                });
            }
        }
        if(mode == 'Изменить'){
            //редактирование
            if(level == 1){
                //редактируе объект таксации
                let row = this.props.recount.find(item => item.id == selectedItem.id);
                $$(this.id+"_form").setValues(row);         
            }else{
                //редактируем породу
                let parent = this.props.recount.find(item => item.id == selectedItem.$parent);
                let row = parent.objectsBreed.find(item => item.id == selectedItem.id);
                row.parentid = selectedItem.$parent
                $$(this.id+"_form").setValues(row);         
            }
        }
        
       
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
                            id:this.id+'_buttonAdd',
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
                        if(this.getItem(id).value == "Удалить"){
                            if(selectedItem.$level == 1){
                                self.props.deleteObjectTaxation(selectedItem.id);
                            }  
                            if(selectedItem.$level == 2){
                                self.props.deleteBreed(selectedItem.id,selectedItem.$parent);
                            }                                                  
                        }else{
                            self.treeEdit(selectedItem.$level,this.getItem(id).value);
                        }
                    }                               
                }
            }
        };

        let formEdit = {view:"popup",id:this.id+"_window",position:"centre",            
            body:{
                view:"form",
                id:this.id+"_form", 
                width:400,               
                elements:[                    
                    { 
                        view:"button", value:"Сохранить", align:"right", width:150,
                        click:function(){
                            if (this.getParentView().validate()){
                                let value = this.getParentView().getValues()
                                if(value.hasOwnProperty('objectTaxation')){
                                    self.props.updateObjectTaxation(value);
                                }else{
                                    self.props.updateBreed(value);
                                }                                
                                $$(self.id+"_window").hide();
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
        this.ui.push(window.webix.ui(formEdit))   

    }

    componentDidMount(){}

    componentWillReceiveProps(nextProps) {
        if((nextProps.conteinerReady) && (!this.props.conteinerReady)){
            this.initUI(nextProps)
        }
        this.feelData(nextProps.recount,nextProps.curentId)
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