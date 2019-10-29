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

        let objectsTaxation = {
            view:"datatable", 
            columns:[
                { id:"id",    header:"",              width:50},
                { id:"name",   header:"Объект таксации",    width:200},
                { id:"areacutting",    header:"Площадь",      width:80},
            ],
            data: [
                { id:1, name:"Волока", areacutting:1.2, },
                { id:2, name:"Пасека", year:1972, areacutting:5.2,}
            ]
        }

        let property = {
            view:"form",
            id:this.id+'_property',
            complexData:true,
            autoheight:true,
            //maxWidth:400,
            css:'webix_dark',
            //borderless:true,
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
                    {view:"select", label:"Метод таксации", name:"taxation.methodTaxation", options:self.props.enumerations.methodTaxation},
                    {view:"select", label:"Вид ставки", name:"taxation.typesrates", options:[]},
                    {view:"select", label:"Разряд такс", name:"taxation.rankTax", options:self.props.enumerations.rankTax},
                    {cols:[
                            {view:"datepicker",label:"Дата отвода", name:"taxation.releasedate",  stringResult:true, format:"%d  %M %Y"},
                            {view:"datepicker", label:"Дата оценки",  name:"taxation.valuationdate",  stringResult:true, format:"%d  %M %Y"},  
                        ]
                    },  
                    {view:"text",label:"Расчет произвел",  name:"taxation.estimator",},  
                    {template:"Характеристика рубки", type:"section"},
                    {view:"select", label:"Форма", name:"felling.formCutting", options:self.props.enumerations.formCutting},
                    {view:"select", label:"Группа", name:"felling.groupCutting", options:self.props.enumerations.groupCutting},
                    {view:"select", label:"Способ", name:"felling.cuttingmethods", options:[]},
                    {view:"text",label:"Площадь",  name:"felling.areacutting",},               
                    {template:"Местоположение", type:"section"},
                    {view:"select", label:"Лесничество",name:"location.forestry", options:[] },
                    {view:"select", label:"Участковое лесничество", name:"location.subforestry",options:[]},
                    {view:"select", label:"Урочище",  name:"location.tract",options:[]},
                    {cols:[
                            {view:"text",label:"№ квартала", name:"location.quarter", },
                            {view:"text", label:"№ лесосеки",  name:"location.cuttingarea", },
                            {view:"text",label:"№ выдела(ов)",  name:"location.isolated",},
                        ]
                    },
                    {template:"Характеристика выдела", type:"section"},
                    {view:"select", label:"Целевое назначение лесов", name:"parameters.purposeForests", options:self.props.enumerations.purposeForests},
                    {view:"select", label:"Хозяйство", name:"parameters.property", options:self.props.enumerations.property},
                    {view:"select", label:"Способ очистки", name:"parameters.methodscleaning", options:[]},
                    {view:"text", label:"Подрост", name:"parameters.undergrowth",},
                    {view:"text", label:"Семенники", name:"parameters.seedtrees", },
                ]
            }],
            elementsConfig:{
				on:{
					onChange:function(new_v,old_v){
                        //$$(self.id+'_property').validate();
					}
				}
			}
        }        
        
        let layout = {
            id:this.id+'_layout',
            container:ReactDOM.findDOMNode(this.refs.root),
            css:'content',
            rows:[
                {
                    cols:[ //or rows 
                        //{ header:"Настроки МДО", body:"Объекты", }, 
                        //{ view:"resizer" },
                        objectsTaxation,
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