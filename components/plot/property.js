import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';
import * as common from '../reference/common';

export default class ComponentProperty extends Component {

    constructor(props) {
        super(props);
        this.id         = 'plot_property';
    }  
    
    filterArray(array,params) {
        for (let i = 0; i < params.length; i++) {
            array = array.filter(item => item[params[i].field] == params[i].value);
        }  
        return array
    }

    feelOptions(propertyName,options){
        let property = $$(this.id);
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

        let property = {
            view:"form",
            id:this.id,
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
                    {view:"select", label:"Лесничество",name:"location.forestry", options:[] ,required:true},
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
                        //$$(self.id).validate();
                    },                    
                },
                labelWidth:120,
			}
        }    
        
        window.webix.ui(property, $$(this.id))             
        
        let propertyForm = $$(this.id);
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
        $$(this.id).setValues(nextProps.property);
    }

    shouldComponentUpdate(){
        return false;
    }

    render() {
        return null
    }
}