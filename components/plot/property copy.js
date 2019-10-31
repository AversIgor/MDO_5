import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';
import * as common from '../reference/common';

export default class ComponentPlot extends Component {

    constructor(props) {
        super(props);
        this.id         = 'plot';
        this.ui         = [];
    }   
    
    filterArray(array,params) {
        for (let i = 0; i < params.length; i++) {
            array = array.filter(item => item[params[i].field] == params[i].value);
        }  
        return array
    }

    feelOptions(propertyName,options){
        let property = $$(this.id+'_property');
        let field = property.elements[propertyName];     
        if(field){            
            let configOptions = field.config.options;
            configOptions.length = 0
            configOptions.push({id:0,value:''})
            for (let i = 0; i < options.length; i++) {
                configOptions.push(options[i])
            }
            field.setValue(0);
            field.refresh()
        }        
    }

    componentDidMount(){
        let self = this;

        let objectsBreed = {
            cols:[                
                {
                    view:"datatable",
                    headerRowHeight:24,
                    multiselect:false,
                    select:"row",
                    editable:true,
                    editaction:"dblclick",
                    columns:[
                        { id:"id", header:"",hidden:true},
                        { id:"breed", header:"Порода", editor:"combo",	options:self.props.breed,fillspace:true,required:true,},
                        { id:"tables", header:"Таблица",hidden:true},
                        { id:"rank",  header:"Разряд высот", editor:"combo",width:150,options:self.props.enumerations.rankTax,required:true,},
                    ],
                    data:[],
                    scrollX:false,
                    autoheight:true,
                    on:{
                        'onAfterEditStop': function(state, editor, ignoreUpdate){
                            if((editor.column == 'breed') && (state.old == undefined)){
                                this.editCell(this.getLastId(),"rank",true)
                            }
                        }
                    } 
                },
                {                                       
                    view:"button", 
                    type:"icon",
                    icon: "mdi mdi-plus",
                    tooltip:"Добавить породу",                 
                    width:24, 
                    inputHeight:28,
                    on:{
                        'onItemClick': function(id){
                            let curentTable = this.getParentView().getChildViews()[0];
                            let selectedId = curentTable.add({})  
                            curentTable.select(selectedId)                          
                            $$(self.id+'_objectsTaxation').refresh()
                            curentTable.editCell(selectedId,"breed",true)
                        }
                    }
                },
                {                                    
                    view:"button", 
                    type:"icon",
                    icon: "mdi mdi-delete",
                    tooltip:"Удалить породу",                 
                    width:24, 
                    inputHeight:28,
                    on:{
                        'onItemClick': function(id){
                            let selectedId = this.getParentView().getChildViews()[0].getSelectedId()                                                
                            if(selectedId){
                                this.getParentView().getChildViews()[0].remove(selectedId);
                            }  
                            $$(self.id+'_objectsTaxation').refresh()
                        }
                    }
                },
            ]                   

        }

        let objectsTaxation = {
            rows:[
                {cols:[
                        {
                            view:"button", 
                            label:"Добавить объект таксации",                   
                            width:250, 
                            on:{
                                'onItemClick': function(id){
                                    let curentTable = $$(self.id+'_objectsTaxation')
                                    let selectedId = curentTable.add({...self.props.rows.objectTaxation});
                                    curentTable.editCell(selectedId,"objectTaxation",true)  
                                }
                            }
                        },
                        {
                            view:"button", 
                            type:"icon",
                            icon: "mdi mdi-delete",
                            tooltip:"Удалить объект таксации",                 
                            width:28, 
                            on:{
                                'onItemClick': function(id){
                                    if($$(self.id+'_objectsTaxation').getSelectedId()){
                                        $$(self.id+'_objectsTaxation').remove($$(self.id+'_objectsTaxation').getSelectedId());
                                    }     
                                }
                            }
                        },
                        {}
                    ]
                },                
                {
                    view:"datatable",
                    id:this.id+'_objectsTaxation',
                    select:"row",
                    multiselect:false,
                    editable:true,
                    editaction:"dblclick",
                    css:'box_shadow',
                    columns:[
                        { id:"id", header:"",hidden:true},                        
                        { id:"objectTaxation",header:"Объект таксации", editor:"combo",	options:self.props.enumerations.objectTaxation,  fillspace:true },
                        { id:"areacutting",  editor:"text", header:"Площадь, га",width:100,numberFormat:"111,0000"},
                        {template:"{common.subrow()} Породы"},
                    ],
                    data: [],
                    on:{
                        'onAfterAdd': function(id){
                            this.openSub(id);                           
                        },
                    },
                    subview:objectsBreed,   
                }
            ],            
        }

        let property = {
            view:"form",
            id:this.id+'_property',
            complexData:true,
            css:'webix_dark',
            scroll:true,
            rules:{
                "location.forestry":webix.rules.isNotEmpty,
                "location.subforestry":webix.rules.isNotEmpty,
                "location.isolated":webix.rules.isNotEmpty,
                "location.quarter":webix.rules.isNumber,
                "location.cuttingarea":webix.rules.isNumber,
                "felling.areacutting":webix.rules.isNotEmpty,
			},
            elements:[{
                rows:[   
                    {template:"Параметры таксации", type:"section"},
                    {view:"select", label:"Метод таксации", name:"taxation.methodTaxation", options:self.props.enumerations.methodTaxation,required:true,},
                    {view:"select", label:"Вид ставки", name:"taxation.typesrates", options:[],required:true,},
                    {view:"select", label:"Разряд такс", name:"taxation.rankTax", options:self.props.enumerations.rankTax,required:true,},
                    {cols:[
                            {view:"datepicker",label:"Дата отвода", name:"taxation.releasedate",  stringResult:true, format:"%d  %M %Y",},
                            {view:"datepicker", label:"Дата оценки",  name:"taxation.valuationdate",  stringResult:true, format:"%d  %M %Y"},  
                        ]
                    },  
                    {view:"text",label:"Расчет произвел",  name:"taxation.estimator",},  
                    {template:"Характеристика рубки", type:"section"},
                    {view:"select", label:"Форма", name:"felling.formCutting", options:self.props.enumerations.formCutting,required:true,},
                    {view:"select", label:"Группа", name:"felling.groupCutting", options:self.props.enumerations.groupCutting,required:true,},
                    {view:"select", label:"Способ", name:"felling.cuttingmethods", options:[],required:true,},
                    {view:"text",label:"Площадь, га",  name:"felling.areacutting",required:true,format:"111,0000"},               
                    {template:"Местоположение", type:"section"},
                    {view:"select", label:"Лесничество",name:"location.forestry", options:[] ,required:true,},
                    {view:"select", label:"Участковое лесничество", name:"location.subforestry",options:[],required:true,},
                    {view:"select", label:"Урочище",  name:"location.tract",options:[],},
                    {cols:[
                            {view:"text",label:"№ квартала", name:"location.quarter",required:true,format:"111"},
                            {view:"text", label:"№ лесосеки",  name:"location.cuttingarea",required:true,format:"111"},
                            {view:"text",label:"№ выдела(ов)",  name:"location.isolated",required:true,},
                        ]
                    },
                    {template:"Характеристика выдела", type:"section"},
                    {view:"select", label:"Целевое назначение лесов", name:"parameters.purposeForests", options:self.props.enumerations.purposeForests,},
                    {view:"select", label:"Хозяйство", name:"parameters.property", options:self.props.enumerations.property,},
                    {view:"select", label:"Способ очистки", name:"parameters.methodscleaning", options:[],},
                    {view:"text", label:"Подрост", name:"parameters.undergrowth",},
                    {view:"text", label:"Семенники", name:"parameters.seedtrees"},
                ]
            }],
            elementsConfig:{
				on:{
					onChange:function(new_v,old_v){
                        //$$(self.id+'_property').validate();
                    },                    
                },
                labelWidth:120,
			}
        }        
        
        let layout = {
            id:this.id+'_layout',
            container:ReactDOM.findDOMNode(this.refs.root),
            rows:[
                {
                    cols:[
                        objectsTaxation,
                        { view:"resizer" },
                        {
                            view:"datatable", 
                            columns:[
                                { id:"rank",    header:"",              width:50},
                                { id:"title",   header:"Film title",    width:200},
                                { id:"year",    header:"Released",      width:80},
                                { id:"votes",   header:"Votes",         width:100}
                            ],
                            data: [
                                { id:1, title:"The Shawshank Redemption", year:1994, votes:678790, rank:1},
                                { id:2, title:"The Godfather", year:1972, votes:511495, rank:2}
                            ]
                        },
                        { view:"resizer" },
                        property,
                    ]
                },
            ]
        }
        this.ui.push(window.webix.ui(layout))
        let propertyForm = $$(this.id+'_property');
        propertyForm.elements["location.forestry"].attachEvent("onChange", function(newv, oldv){
            if(newv != oldv){
                //отфильтруем записи участковые лесничества                
                let arraySubforestry = self.props.subforestry.filter(item => item.forestry.id == newv);
                self.feelOptions('location.subforestry',arraySubforestry)
            }
        });
        propertyForm.elements["location.subforestry"].attachEvent("onChange", function(newv, oldv){
            if(newv != oldv){
                //отфильтруем записи урочищь
                let arrayTract = self.props.tract.filter(item => item.subforestry.id == newv);
                self.feelOptions('location.tract',arrayTract)
            }
        });
        propertyForm.elements["felling.formCutting"].attachEvent("onChange", function(newv, oldv){
            if(newv != oldv){
                //отфильтруем способы рубки
                let values = propertyForm.getValues();
                let arraycuttingmethods = self.filterArray(self.props.cuttingmethods,[
                    {field:'formCutting',value:newv},
                    {field:'groupCutting',value:values.felling.groupCutting}
                ])
                self.feelOptions('felling.cuttingmethods',arraycuttingmethods)
            }
        });
        propertyForm.elements["felling.groupCutting"].attachEvent("onChange", function(newv, oldv){
            if(newv != oldv){
                //отфильтруем способы рубки
                let values = propertyForm.getValues();
                let arraycuttingmethods = self.filterArray(self.props.cuttingmethods,[
                    {field:'formCutting',value:values.felling.formCutting},
                    {field:'groupCutting',value:newv}
                ])
                self.feelOptions('felling.cuttingmethods',arraycuttingmethods)
            }
        });
        this.feelOptions('location.forestry',this.props.forestry)
        this.feelOptions('parameters.methodscleaning',this.props.methodscleanings)  
        this.feelOptions('taxation.typesrates',this.props.typesrates)      

        let values = propertyForm.getValues();
        let arraycuttingmethods = self.filterArray(self.props.cuttingmethods,[
            {field:'formCutting',value:values.felling.formCutting},
            {field:'groupCutting',value:values.felling.groupCutting}
        ])
        self.feelOptions('felling.cuttingmethods',arraycuttingmethods,)

        propertyForm.setValues(this.props.property);
    }

    componentWillReceiveProps(nextProps) {
        this.feelOptions('location.forestry',nextProps.forestry)
        this.feelOptions('parameters.methodscleaning',nextProps.methodscleanings)
        this.feelOptions('felling.cuttingmethods',nextProps.cuttingmethods)
        $$(this.id+'_property').setValues(nextProps.property);
    }

    componentWillUnmount(){
        common.uiDestructor(this)
    }

    shouldComponentUpdate(){
        return false;
    }

    render() {
        return (
            <div  ref="root" style={{height: "100%"}}></div>)
    }

}