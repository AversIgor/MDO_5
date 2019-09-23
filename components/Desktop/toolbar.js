import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';

import logo from '../../img/logo-w-big.png'

const css_toolbar = {
    'background': '#545454ad!important'
}

const css_projectMenu = {
    'padding-top': '10px',
    'background': '#54545400!important'
}

export default class ComponentToolbar extends Component {

    constructor(props) {
        super(props);
        this.toolbar = null;
    }

    componentDidMount(){
        var props = this.props;  

        const projectMenu = { 
            view:'menu', 
            id: 'projectMenu', 
            css: css_projectMenu, 
            type:{
                subsign:true
            },    
            data:[
                {
                    id: 'actions', value:'Проект',height:50,$css:{ "color": "#ffffff!important;" },
                    submenu:[
                        {id: "new", icon: "file-o", value: "Новый",config:{
                            height:36,}
                        },
                        {id: "open", icon: "folder-open-o", value: "Открыть"},
                        { $template:"Separator" },
                        {id: "save", icon: "save", value: "Сохранить"}
                    ]
                }
            ],
            on:{
                onMenuItemClick:function(id){
                    if(id == 'new'){
                        window.webix.confirm({
                            text:"Удалить все данные и начать новый проект?", ok:"Да", cancel:"Нет",
                            callback:(res) => {
                                if(res){
                                    props.newProject()
                                }
                            }
                        });
                    }
                    if(id == 'open'){
                        window.webix.confirm({
                            text:"При загрузке все данные текущего проекта будут утеряны. Продолжить?", ok:"Да", cancel:"Нет",
                            callback:(res) => {
                                if(res){
                                    props.openProject()
                                }
                            }
                        });
                    }
                    if(id == 'save'){
                        props.saveProject()
                    }
                }
            },
        };

        const toolbar = { 
            view: "toolbar",
            id: "toolbar",
            container:ReactDOM.findDOMNode(this.refs.root), 
            css:css_toolbar, 
            height:50,
            type: "clean",
            elements: [
                {view: "label", label: "<img class='logo' src="+logo+" />", width:180},
                projectMenu,
                {},
                { view: "button", type: "icon", width: 45, css: "app_button", icon: "mdi mdi-comment",  badge:4},
                { view: "button", type: "icon", width: 45, css: "app_button", icon: "mdi mdi-bell",  badge:10}
            ]
        }

        this.toolbar = window.webix.ui(toolbar);
    }


    shouldComponentUpdate(){
        return true;
    }

    componentWillUnmount(){
        this.toolbar.destructor();
        this.toolbar = null;
    }


    render() {
        return (
            <div ref="root"></div>
          );        
    }
}