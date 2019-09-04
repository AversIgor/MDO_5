import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';
import * as common from '../reference/common';

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
        this.subforestry   = [];
        this.columns    = []
    }

    updateColumns = (props) => {
        this.subforestry.splice(0, this.subforestry.length);
        for (let i = 0; i < props.subforestry.length; i++) {
            let item = {
                id:props.subforestry[i].id,
                value:props.subforestry[i].name
            }
            this.subforestry.push(item)
        }
        this.columns =  [
            common.datatableFieldID(),
            { id:"subforestry",	header:"Участковое лесничество", options:this.subforestry, editor:"select", fillspace:true,
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
    }

    componentWillReceiveProps(nextProps) {        this.updateColumns(nextProps)
        common.datatableUpdate(this,nextProps)
        common.datatableRefreshColumns(this)
        common.formResize(this)
    }

    componentWillUnmount(){
        common.uiDestructor(this)
    }

    shouldComponentUpdate(){
        return false;
    }

    render() {
        return (<div ref="root"></div>)
    }

}