import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';
import * as common from '../common';

export default class sTypesrates extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected:   {},
        };
        this.sort   = props.sort;
        this.id     = 'typesrates';
        this.menu   = [
            {id: "showDel", value: "Показать (скрыть) помеченные на удаление"},
            {id: "deleteComplite", value: "Удалить помеченные на удаление"},
        ]
        this.columns = []
        this.rules   = {
            "name": webix.rules.isNotEmpty,
        }
        this.editable = true;
        this.on = ["onAfterEditStop","onSelectChange","onAfterSort"],
        this.search     = ["name"]
        this.ui = []
    }

    updateColumns = (props) => {
        this.columns = [
            common.datatableFieldID(),
            { id:"name",	header:"Наименование",  template:"{common.subrow()} #name#", editor:"text", sort:"string", fillspace:true },
            { id:"region",	header:"Лесотаксовый район", editor:"combo", options:props.regions, fillspace:true },
            { id:"orderroundingrates", header:["Порядок округления"],  editor:"combo", options:props.orderRoundingRates, fillspace:true},
            { id:"coefficientsindexing", header:{text:"Коэффициент индексации",}, editor:"text", numberFormat:"1.111,00",fillspace:true},
        ]
    }
    

    componentDidMount(){

        let self = this;
        
        let toolbar = {
            view:'toolbar',
            elements:[
                common.addButton(this),
                common.deleteButton(this),
                {},
                common.search(this),
                common.settingsButton(this),
            ]
        }

 
        let datatable = {
            view:"datatable",
            id:this.id+'_datatable',
            select:"row",
            multiselect:false,
            editable:true,
            editaction:"click",
            css:'box_shadow',
            borderless:true,            
            columns:this.columns,
            on:{...common.creatOn(this),
                onSubViewOpen:function(id){
                    if(id){
                        this.select(id);
                    }
                }            
            },
            data: [],
            rules:this.rules,
            subview:{
                borderless:true,
                view:"form",
                width:250,
                elements:[  
                        {
                        rows:[
                            { view:"button", value:"Ставки платы",css:'webix_primary', click:function(){
                                let selectedItem = this.getFormView().getMasterView().getSelectedItem()
                                self.props.openFeedrates(selectedItem)
                                }
                            },
                            
                            { template:"Коэффициенты", type:"section"},
                            { view:"button", value:"на форму рубки", click:function(){
                                let selectedItem = this.getFormView().getMasterView().getSelectedItem()
                                self.props.openFeedrates(selectedItem)
                                }
                            },
                            { view:"button", value:"на ликвидный запас", click:function(){
                                let selectedItem = this.getFormView().getMasterView().getSelectedItem()
                                self.props.openCoefficientsrangesliquidation(selectedItem)
                                }
                            },
                            { view:"button", value:"на степень поврежденности", click:function(){
                                let selectedItem = this.getFormView().getMasterView().getSelectedItem()
                                self.props.openFeedrates(selectedItem)
                                }
                            }
                        ]
                    }                        
                ]
            },   
        }
    

        
        let layout = {
            id:this.id+'_layout',
            container:ReactDOM.findDOMNode(this.refs.root),
            css:'content',
            rows:[
                {
                    padding:10,
                    borderless:true,
                    rows:[
                        toolbar,
                        datatable
                    ]
                },
            ]
        }

        
        this.ui.push(window.webix.ui(layout))
        this.ui.push(window.webix.ui(common.settingsMenu(this)))

        common.searchBind(this)
    }


    componentWillReceiveProps(nextProps) {
        this.updateColumns(nextProps)
        common.datatableUpdate(this,nextProps)
        common.datatableRefreshColumns(this)
    }

    componentWillUnmount(){
        common.uiDestructor(this)
    }

    shouldComponentUpdate(){
        return false;
    }

    render() {
        return (<div ref="root" style={{height: "100%"}}></div>)
    }
}