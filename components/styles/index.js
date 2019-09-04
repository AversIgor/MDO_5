import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';
import * as common from '../reference/common';

export default class ComponentStyles extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected:   {},
        };
        this.sort   = props.sort;
        this.id     = 'styles';
        this.editable = false;
        this.menu   = [
            {id: "showDel", value: "Показать (скрыть) помеченные на удаление"},
            {id: "deleteComplite", value: "Удалить помеченные на удаление"},
        ]

        this.columns = [
            common.datatableFieldID(),
            { id:"name",	header:"Наименование", editor:"text", sort:"string", fillspace:true },
            { id:"style",	header:"Стиль", hidden:true },
            { id:"main",	header:"Основной",
                template: function(obj){
                    if(obj.main){
                        return "Да"
                    }else {
                        return ""
                    }
                },
                checkValue:true,
                uncheckValue:false,
            },
        ]
        this.rules   = {
            "name": webix.rules.isNotEmpty,
        }
        this.on = ["onSelectChange","onAfterSort","onItemDblClick"],
        this.search     = ["name","fullname"]
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
                common.header("Стили абриса"),
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