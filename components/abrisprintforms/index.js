import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';
import * as common from '../reference/common';

export default class ComponentAbrisprintforms extends Component {

	loadButton() {
		this.props.handlerLoad();
	}

	saveButton() {
        if (this.state.selected) {
            this.props.handlerSave($$(this.id + '_datatable').getItem(this.state.selected.id));
        }        
	}

    constructor(props) {
        super(props);
        this.state = {
            selected:   {},
        };
        this.id     = 'abrisprintforms';
        this.editable = false;
        this.menu   = [
            {id: "showDel", value: "Показать (скрыть) помеченные на удаление"},
            {id: "deleteComplite", value: "Удалить помеченные на удаление"},
            {id: "load", value: "Загрузить печатную форму", target:this.loadButton},
            {id: "save", value: "Сохранить печатную форму", target:this.saveButton},
        ]

        this.columns = [
            common.datatableFieldID(),
            { id:"name",	header:"Наименование", editor:"text", fillspace:true },

        ]
        this.rules   = {
            "name": webix.rules.isNotEmpty,
        }
        this.on = ["onSelectChange","onItemDblClick"],
        this.search     = ["name","fullname"]
        this.ui = []
    }


    componentDidMount(){

        let toolbar = {
            view:'toolbar',
            elements:[
                common.addButton(this),
                common.copyButton(this),
				common.deleteButton(this),
				//this.loadButton(),
				//this.saveButton(),
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

    }


    componentWillReceiveProps(nextProps) {
        common.datatableUpdate(this,nextProps)
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