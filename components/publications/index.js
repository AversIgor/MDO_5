import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';
import * as common from '../reference/common';

export default class Publications extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected:   {},
        };
        this.sort   = props.sort;
        this.id     = 'publications';
        this.menu   = [
            {id: "showDel", value: "Показать (скрыть) помеченные на удаление"},
            {id: "deleteComplite", value: "Удалить помеченные на удаление"},
        ]

        this.columns = [
            common.datatableFieldID(),
            { id:"name",	header:"Наименование", sort:"string", fillspace:true },
            { id:"version",	header:"Версия", sort:"string", fillspace:true },

        ]
        this.rules   = {
            "name": webix.rules.isNotEmpty,
        }
        this.editable = false;
        this.on = ["onSelectChange","onAfterSort"],
        this.search    = ["name","version"]
        this.ui = []
    }

    componentDidMount(){

        let context = this

        let toolbar = {
            view:'toolbar',
            elements:[
                common.menuButton(this,'Добавить','add'),
                common.deleteButton(this),
                {},
                common.search(this),
                common.settingsButton(this),
            ]
        }


        let popupMenu = {
            view:"popup",
            id:context.id+"_"+'add',
            width:750,
            body:{
                view:"list",
                id:context.id+"_"+'add'+'_list',
                autoheight:true,
                autowidth:true,
                select:true,
                template:'#name#',
                on:{
                    'onAfterSelect': function(id){
                        let name = this.getItem(id).name;
                        let text = 'Добавить издание "'+name+'"?'
                        window.webix.confirm({
                            text:text, ok:"Да", cancel:"Нет",
                            callback:(res) => {
                                if(res){
                                    context.props.handlerAdd(id);
                                }
                            }
                        });
                        this.getParentView().hide();
                    }
                }
            }
        }

        let layout = {
            id:this.id+'_layout',
            container:ReactDOM.findDOMNode(this.refs.root),
            css:'content',
            rows:[
                common.header("Издания сортиментных таблиц"),
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
        this.ui.push(window.webix.ui(popupMenu))

    }


    componentWillReceiveProps(nextProps) {
        common.datatableUpdate(this,nextProps)
        common.menuUpdate(this,'add',nextProps.listPublication)
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