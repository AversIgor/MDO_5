import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';

export default class ComponentQuestionButton extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(){
        let props = this.props;

        const projectMenu = {
            view: "popup",
            id: "questionPopup",
            width: 220,
            padding:0,
            body:{
                type: "clean",
                    borderless:true,
                    rows:[
                    {
                        view: "list",
                        autoheight: true,
                        id: "questionSubmenu",
                        data: [],
                        type:{
                            template: function(obj){
                                if(obj.type){
                                    return "<div class='separator'></div>";
                                }else {
                                    return "</span><span>"+obj.value+"</span>";
                                }
                            },
                            height:36
                        },
                        on:{
                            onItemClick:function(id){
                                props.handlerItemClick(id);
                            }
                        },
                    },
                ]
            }
        }


        this.projectMenu = window.webix.ui(projectMenu);

        let element = {
            view:"icon",
            css:'question_toolbar_button',
            id: "question_toolbar_button",
            container:ReactDOM.findDOMNode(this.refs.root),
            icon: "question-circle-o",
            height:50,
            popup: "questionPopup",
        }

        this.ui = window.webix.ui(element);

    }


    componentWillUnmount(){
        this.projectMenu.destructor();
        this.projectMenu = null;
        this.ui.destructor();
        this.ui = null;
    }

    componentWillReceiveProps(nextProps) {
        $$("questionSubmenu").clearAll();
        $$("questionSubmenu").define("data",nextProps.data);
        $$('questionSubmenu').refresh();
    }
    
    render() {
        return (
            <div ref="root"></div>
        )
    }
    
}