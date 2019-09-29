import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';
import * as common from '../common';

export default class Cuttingmethods extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected:   {},
        };
        this.sort   = props.sort;
        this.id     = 'cuttingmethods';
        this.menu   = [
            {id: "showDel", value: "Показать (скрыть) помеченные на удаление"},
            {id: "deleteComplite", value: "Удалить помеченные на удаление"},
        ]

        this.columns = [
            common.datatableFieldID(),
            { id:"name",	header:"Наименование", editor:"text", sort:"string", fillspace:true },
            { id:"cod",header:"Идентификатор",  editor:"text", sort:"string", fillspace:true},
            { id:"formCutting", header:["Форма рубки", {content:"selectFilter"}],  editor:"select", options:props.formCutting, fillspace:true},
            { id:"groupCutting", header:["Группа рубки", {content:"selectFilter"}],  editor:"select", options:props.groupCutting, fillspace:true}
        ]
        this.rules   = {
            "name": webix.rules.isNotEmpty,
        }
        this.editable = true;
        this.on = ["onAfterEditStop","onSelectChange","onAfterSort"],
        this.search     = ["name","cod"]
        this.ui = []
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
                common.header("Способы рубки"),
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
        common.datatableUpdate(this,nextProps)
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