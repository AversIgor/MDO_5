import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';
import * as common from '../common';

export default class ComponentBreed extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected:   {},
        };
        this.sort   = props.sort;
        this.id     = 'breed';
        this.ui     = []
        this.menu   = [
            {id: "showDel", value: "Показать (скрыть) помеченные на удаление"},
            {id: "deleteComplite", value: "Удалить помеченные на удаление"},
        ]
        this.rules   = {}
        this.search     = ["name"]
        this.editable = false;
        this.on = ["onSelectChange","onAfterSort","onItemDblClick"],
        this.columns    = [
            common.datatableFieldID(),
            { id:"name",	header:"Наименование", editor:"text", sort:"string", width:150},
            { id:"kodGulf",header:"Идентификатор",  editor:"text", sort:"string",},
            { id:"publication",	header:"Издание", fillspace:true,
                template:function(obj){
                    if(typeof(obj.publication) == "object"){
                        return obj.publication.name;
                    }else {
                        return '';
                    }
                }
            },
            { id:"table",	header:"Сортиментная таблица", fillspace:true,
                template:function(obj){
                    if(typeof(obj.table) == "object"){
                        return obj.table.name;
                    }else {
                        return '';
                    }
                }
            }
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