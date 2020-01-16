import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';


export default class ComponentToolbar extends Component {

    constructor(props) {
        super(props);
        this.toolbar = null;
    }


    shouldComponentUpdate(nextProps, nextState){
    
        return true
    }    

    componentDidMount(){

        let props = this.props;
        
        const projectMenu = {
            view: "submenu",
            id: "projectMenu",
            autowidth: true,
            padding:0,
            data: [
                {id: "new", icon: "mdi mdi-folder-plus", value: "Новый"},
                {id: "open", icon: "mdi mdi-folder-open", value: "Открыть"},
                { $template:"Separator" },
                {id: "save", icon: "mdi mdi-content-save", value: "Сохранить"}
            ],            
            on:{
                onMenuItemClick:function(id){
                    if(id == 'new'){
                        window.webix.confirm({
                            text:"Удалить все данные и начать новый проект?", ok:"Да", cancel:"Нет",
                            callback:(res) => {
                                if(res){
                                    props.newProject(false);
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
        }

        const questionMenu = {
            view: "submenu",
            id: "questionMenu",
            autowidth: true,
            padding:0,
            data: [
                {id: "about", value: "О программе/лицензия"},
                {id: "site", value: "Сайт программы"},
                {id: "question", value: "Задать вопрос"},
            ],            
            on:{
                onMenuItemClick:function(id){
                    props.clickQuestionMenu(id)                     
                }
            },
        }

        const leftMenu = {
			view: "sidemenu",
			id: "leftMenu",
			width: 230,
			position: "left",
			state:function(state){
				var toolbarHeight = $$("toolbar").$height;
				state.top = toolbarHeight;
                state.height -= toolbarHeight;
            },
            zIndex:120,
			body:{
                view:"grouplist",
                select:true,
                scroll:"auto",
                data:props.leftMenuData,
                on:{
                    onAfterSelect: function(id){
                        props.clickMenu(id);
                        this.getParentView().hide();
                    }
                }
            }
        }

        const toolbar = { 
            view: "toolbar",
            id: "toolbar",
            container:ReactDOM.findDOMNode(this.refs.root), 
            css:"webix_dark",  
            height:50,
            type: "clean",
            borderless:true,
            elements: [
                { 
                    view:"button", 
                    type:"htmlbutton", 
                    width:48,
                    label:'<span class="mdi mdi mdi-menu" style="font-size: 24px;"></span>',
                    css:"webix_transparent",
                    on:{
                        onItemClick:function(id){
                            if( $$("leftMenu").config.hidden){
                                $$("leftMenu").show();
                            }
                            else{
                                $$("leftMenu").hide();
                            }                           
                        }
                    },
                },
                { 
                    view:"button", 
                    type:"button", 
                    width:100,
                    label:'Проект',
                    css:"webix_transparent",
                    on:{
                        onItemClick:function(id){
                            $$('projectMenu').show(this.getNode(),{pos:"bottom"})                            
                        }
                    },
                },
                {},
                { 
                    view:"button", 
                    type:"htmlbutton", 
                    width:48,
                    label:'<span class="mdi mdi-help-circle-outline" style="font-size: 24px;"></span>',
                    css:"webix_transparent",
                    on:{
                        onItemClick:function(id){
                            $$('questionMenu').show(this.getNode(),{pos:"bottom"})                            
                        }
                    },
                },
            ]
        }

        this.toolbar = window.webix.ui(toolbar);
        window.webix.ui(projectMenu);
        window.webix.ui(questionMenu);
        window.webix.ui(leftMenu);

    }    

    componentDidUpdate(prevProps, prevState){
        this.toolbar.adjust()         
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