import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';
import * as common from '../common';

export default class ComponentTract extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected:   {},
        };
        this.sort   = props.sort;
        this.id     = 'tract';
        this.ui     = []
        this.menu   = [
            {id: "showDel", value: "Показать (скрыть) помеченные на удаление"},
            {id: "deleteComplite", value: "Удалить помеченные на удаление"},
        ]
        this.rules   = {
            "subforestry": webix.rules.isNotEmpty,
        }
        this.search     = ["subforestry","name","fullname"]
        this.editable = true;
        this.on = ["onAfterEditStop","onSelectChange","onAfterSort"],
        this.columns    = []
    }

    updateColumns = (props) => {
        this.columns =  [
            common.datatableFieldID(),
            { id:"subforestry",	header:"Участковое лесничество", options:props.subforestry, editor:"select", fillspace:true,
                template:function(obj){
                    if(typeof(obj.subforestry) == "object"){
                        return obj.subforestry.name;
                    }else {
                        return '';
                    }
                }
            },
            { id:"name",	header:"Наименование", editor:"text", sort:"string", fillspace:true },
            { id:"fullname",header:"Полное наименование",  editor:"text", sort:"string", fillspace:true},
            { id:"cod",header:"Идентификатор",  editor:"text", sort:"string", fillspace:true},
        ]
    }

    componentDidMount(){
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

        let layout = {
            id:this.id+'_layout',
            container:ReactDOM.findDOMNode(this.refs.root),
            css:'content',
            rows:[
                common.header("Урочища"),
                {
                    padding:10,
                    borderless:true,
                    rows:[
                        toolbar,
                        common.datatable(this)
                    ]
                },
            ]
        }

        this.ui.push(window.webix.ui(layout))
        this.ui.push(window.webix.ui(common.settingsMenu(this)))

        common.searchBind(this)

        this.updateColumns(this.props)
        common.datatableUpdate(this,this.props)
        common.datatableRefreshColumns(this)
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