import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';
import * as common from '../reference/common';

export default class ComponentSubforestry extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected:   {},
        };
        this.sort   = props.sort;
        this.id     = 'subforestry';
        this.ui     = []
        this.menu   = [
            {id: "showDel", value: "Показать (скрыть) помеченные на удаление"},
            {id: "deleteComplite", value: "Удалить помеченные на удаление"},
        ]
        this.rules   = {
            "forestry": webix.rules.isNotEmpty,
        }
        this.search     = ["forestry","name","fullname"]
        this.editable = true;
        this.on = ["onAfterEditStop","onSelectChange","onAfterSort"],
        this.forestry   = [];
        this.columns    = []
    }

    updateColumns = (props) => {
        this.forestry.splice(0, this.forestry.length);
        for (let i = 0; i < props.forestry.length; i++) {
            let item = {
                id:props.forestry[i].id,
                value:props.forestry[i].name
            }
            this.forestry.push(item)
        }

        this.columns =  [
            common.datatableFieldID(),
            { id:"forestry",	header:"Лесничество", options:this.forestry, editor:"select", fillspace:true,
                template:function(obj){
                    if(typeof(obj.forestry) == "object"){
                        return obj.forestry.name;
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
                common.header("Участковые лесничества"),
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

    componentWillReceiveProps(nextProps) {
        this.updateColumns(nextProps)
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