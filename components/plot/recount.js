import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';
import * as common from '../reference/common';

export default class ComponentRecount extends Component {

    constructor(props) {
        super(props);
        this.id         = 'plot_recount';   
        this.ui         = [];   
                
    }      
    
    feelData(props) {
        let recount         = props.plotObject.recount
        let curentRecount   = props.plotObject.curentRecount

        $$(this.id).clearAll();
       
        for (let i = 0; i < recount.length; i++) {        
            let objectTaxation = props.enumerations.objectTaxation.find(item => item.id == recount[i].objectTaxation);
            let css = {}
            let open = true
            if(props.plotObject.property.taxation.methodTaxation == 1){
                //сплошной перечет
                if(objectTaxation.id == 5){
                    //ленты перечета
                    css = {'text-decoration': 'line-through;'}
                    open = false
                } 
            }
            if(props.plotObject.property.taxation.methodTaxation == 2){
                //ленточный перечет
                if(objectTaxation.id != 5){
                    //не ленты перечета
                    css = {'text-decoration': 'line-through;'}
                    open = false
                } 
            }

            let node_OT = {
                id:recount[i].id, 
                value:objectTaxation.value+ "  ("+recount[i].areacutting+" га.)",
                data:[],
                $css:css,  
                open:open,             
            }
            $$(this.id).data.add(node_OT);
            for (let j = 0; j < recount[i].objectsBreed.length; j++) {
                let objectBreed = props.breed.find(item => item.id == recount[i].objectsBreed[j].breed);
                let node_B = {
                    id:recount[i].objectsBreed[j].id, 
                    value:objectBreed.value+ "  (разряд высот - "+recount[i].objectsBreed[j].rank+")",
                    $css:css,
                }
                $$(this.id).data.add(node_B,0,recount[i].id);
            }
        }

        let selectId = undefined
        if(curentRecount.breed){
            selectId = curentRecount.breed
        }else{
            selectId = curentRecount.objectTaxation
        }
        if(!selectId){
            if(recount.length != 0){
                selectId = recount[recount.length-1].id
            }
        }
        if(selectId){
            $$(this.id).select(selectId)
        }
        $$(this.id+'_buttonAdd').define("disabled",!selectId)
        $$(this.id+'_buttonAdd').refresh()
    }
    
    openFormEdit(level,mode) { 
        let self = this
        
        if($$("plot_recount_form").elements.hasOwnProperty("id")){
            $$(this.id+"_form").removeView('fields'); 
        }       
        if(level == 1){
            let options = this.props.enumerations.objectTaxation
            if(this.props.plotObject.property.taxation.methodTaxation == 2){
                //только ленты перечета
                options = this.props.enumerations.objectTaxation.filter(item => item.id == 5);
            }
            $$(this.id+"_form").addView({
                id:'fields',
                cols:[
                    {view:"text",name:"id",hidden:true,},
                    {view:"select", label:"Элемент лесосеки", labelPosition:"top", value:1, name:"objectTaxation", options:options,required:true},
                    {view:"text",label:"Площадь, га",placeholder:"Площадь, га", labelPosition:"top", name:"areacutting",required:true,format:"111,0000",}, 
                ]
            },0);                   
        }else{
            $$(this.id+"_form").addView({
                id:'fields',
                cols:[
                    {view:"text",name:"id",hidden:true,},
                    {view:"text",name:"parent",hidden:true,},
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
                //добавляем Элемент лесосеки
                $$(this.id+"_form").setValues({
                    id: webix.uid(),
                    objectTaxation: 1, 
                    areacutting: undefined,
                });                            
            }else{
                //добавляем породу
                if(!selectedItem){
                    webix.message({ type:"error", text:"Укажите элемент лесосеки" });
                    return                }
                let parent = undefined
                if(selectedItem.$level == 1){
                    parent = selectedItem.id;
                }
                if(selectedItem.$level == 2){
                    parent = selectedItem.$parent;
                }
                $$(this.id+"_form").setValues({
                    id: webix.uid(),
                    parent: parent,
                    breed: undefined, 
                    rank: undefined,
                });
            }
        }
        if(mode == 'Изменить'){
            //редактирование
            if(level == 1){
                //редактируе Элемент лесосеки
                let row = this.props.plotObject.recount.find(item => item.id == selectedItem.id);
                $$(this.id+"_form").setValues(row);         
            }else{
                //редактируем породу
                let parent = this.props.plotObject.recount.find(item => item.id == selectedItem.$parent);
                let row = parent.objectsBreed.find(item => item.id == selectedItem.id);
                row.parent = selectedItem.$parent
                $$(this.id+"_form").setValues(row);         
            }
        }
        
       
    }

    initUI(props){
        let self = this;

        let ui = {
            width:300,  
            padding:5,         
            rows:[
                {
                    view:"toolbar",                    
                    borderless:true,
                    paddingY:2,
                    css:"webix_dark",
                    cols:[
                        {
                            view:"button",
                            type:"icon",
                            icon: "mdi mdi-plus",
                            label:"Элемент лесосеки",
                            width:170,
                            align:"left",
                            on:{
                                'onItemClick': function(id){
                                    self.openFormEdit(1,'Добавить');
                                }
                            }
                        },
                        {
                            view:"button",
                            id:this.id+'_buttonAdd',
                            type:"icon",
                            icon: "mdi mdi-plus",
                            label:"Породу",
                            width:90,
                            align:"right",                            
                            on:{
                                'onItemClick': function(id){
                                    self.openFormEdit(2,'Добавить');
                                }
                            }
                        },
                    ]
                },                  
                {
                    view:"tree",
                    id:this.id,
                    select:true,
                    borderless:true,
                    data: [],
                    on:{
                        'onItemClick': function(id, e, node){
                            self.props.changeCurentRecount(this.getItem(id));
                        }
                    }
                },
            ]
        }

        let contextmenu = {view:"contextmenu",id:"cmenu",data:["Изменить","Удалить"],
            on:{
                onItemClick:function(id){
                    let selectedItem = $$(self.id).getSelectedItem()
                    if(selectedItem){
                        if(this.getItem(id).value == "Удалить"){
                            if(selectedItem.$level == 1){
                                webix.confirm("Удалить элемент лесосеки: " + selectedItem.value).then(function(result){
                                    self.props.deleteObjectTaxation(selectedItem.id);
                                });
                            }  
                            if(selectedItem.$level == 2){
                                webix.confirm("Удалить породу: " + selectedItem.value).then(function(result){
                                    self.props.deleteBreed(selectedItem.id,selectedItem.$parent);
                                });                                
                            }                                                  
                        }else{
                            self.openFormEdit(selectedItem.$level,this.getItem(id).value);
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
                        hotkey: "enter",
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
        if(nextProps.plotObject){
            this.feelData(nextProps)
        }
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