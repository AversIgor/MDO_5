import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';
import logo from '../../img/logo-w-big.png'



const cssMenu = {
    'background': '#00000000!important',
    'padding-top': '10px',
}

export default class ComponentToolbar extends Component {

    constructor(props) {
        super(props);
        this.toolbar = null;
    }

    componentDidMount(){
       var props = this.props;  

       const questionMenu = { 
            view:'menu', 
            id: 'questionMenu', 
            type:{
                subsign:false
            }, 
            width:48,
            align:"right",
            data:[
                {
                    id: 'actions',  icon:"mdi mdi-help", width:48, value:'',$css: cssMenu,
                    submenu:[
                        {id: "about", value: "О программе/лицензия",},
                        {id: "site",  value: "Сайт программы"},
                        {id: "question", value: "Задать вопрос",},
                    ]
                }
            ],
            on:{
                onMenuItemClick:function(id){
                    props.clickQuestionMenu(id)                    
                }
            },
        };


        const projectMenu = { 
            view:'menu', 
            id: 'projectMenu', 
            type:{
                subsign:true
            },    
            data:[
                {
                    id: 'actions', value:'Проект',$css: cssMenu,
                    submenu:[
                        {id: "new", icon: "mdi mdi-folder-plus", value: "Новый"},
                        {id: "open", icon: "mdi mdi-folder-open", value: "Открыть"},
                        { $template:"Separator" },
                        {id: "save", icon: "mdi mdi-content-save", value: "Сохранить"}
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
            //css:css_toolbar,
            css:"webix_dark",  
            height:50,
            type: "clean",
            elements: [
                {view: "label", label: "<img src="+logo+" />", width:180,},
                projectMenu,
                {},
                questionMenu,
            ]
        }

        this.toolbar = window.webix.ui(toolbar);

    }


    shouldComponentUpdate(){
        return true;
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