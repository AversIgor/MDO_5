import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';
import * as common from '../common';

export default class Typesrates extends Component {

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
            { id:"name",	header:"Наименование", editor:"text", sort:"string", fillspace:true },
            { id:"region",	header:"Лесотаксовый район", editor:"combo", options:props.regions, fillspace:true },
            { id:"orderroundingrates", header:["Порядок округления"],  editor:"combo", options:props.orderRoundingRates, fillspace:true},
            { id:"coefficientsindexing", header:{text:"Коэффициент индексации",}, editor:"text", numberFormat:"1.111,00",fillspace:true},
            { id:"feedrate", header:["Ставки платы"], template: "{common.buttonFeedrates()}",fillspace:true }
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

        window.webix.protoUI({ name:'activeTable'}, window.webix.ui.datatable, window.webix.ActiveContent );

        let activeTable = {
            view:"activeTable",
            id:this.id+'_datatable',
            select:"row",
            multiselect:false,
            editable:true,
            editaction:"click",
            css:'box_shadow',
            borderless:true,
            columns:this.columns,
            on:common.creatOn(this),
            data: [],
            rules:this.rules,
            activeContent: {
                buttonFeedrates: { 
                    id:"buttonfeedrates",
                    view:"button", 
                    label:"Открыть", 
                    width: 70,           
                    height:30,          
                    click:function(id, e){
                        let selectedItem = ($$(self.id+'_datatable').getSelectedItem())
                        self.props.openFeedrates(selectedItem)
                    }
                },
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
                        activeTable
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