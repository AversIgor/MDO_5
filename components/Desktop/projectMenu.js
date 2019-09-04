import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';

export default class ComponentProjectMenu extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(){
        var props = this.props;      

        const projectMenu = {
            view: "submenu",
            id: "projectMenu",
            width: 120,
            padding:0,
            css:'projectSubmenu',
            data: [
                {id: "new", icon: "file-o", value: "Новый",config:{
                    height:36,}
                },
                {id: "open", icon: "folder-open-o", value: "Открыть"},
                { $template:"Separator" },
                {id: "save", icon: "save", value: "Сохранить"}
            ],
            type:{
                template: function(obj){
                    if(obj.type){
                        return "<div class='separator'></div>";
                    }else {
                        return "<span class='webix_icon alerts fa-"+obj.icon+"'></span><span>"+obj.value+"</span>";
                    }
                },
                height:36
            },
            on:{
                onMenuItemClick:function(id){
                    if(id == 'new'){
                        window.webix.confirm({
                            text:"Удалить вседанные и начать новый проект?", ok:"Да", cancel:"Нет",
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

        this.projectMenu = window.webix.ui(projectMenu);

        var menu =  {
            view:"template",
            container:ReactDOM.findDOMNode(this.refs.root),
            css: "projectMenu",
            borderless:true,
            width: 180,
            height: 50,
            template: function(obj){
                var html = 	"<div style='height:100%;width:100%;overflow: hidden;' onclick='webix.$$(\"projectMenu\").show(this)'>";
                html += "<div style='float: left;margin-top: 7px;margin-right: 7px;'>"+'Проект'+"</div>";
                html += "<div style='float: left;line-height: 30px;' class='webix_icon fa-angle-down'></div></div>";
                return html;
            }
        }

        this.menu = window.webix.ui(menu);

    }

    shouldComponentUpdate(){
        return false;
    }
    componentWillUnmount(){
        this.menu.destructor();
        this.menu = null;
        this.projectMenu.destructor();
        this.projectMenu = null;
    }

    render() {
        return (
            <div ref="root"></div>
        )
    }
}