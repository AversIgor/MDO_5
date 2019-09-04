import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';


export default class ComponentInfoButton extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(){
        let props = this.props;

        let element = {
            view:"icon",
            css:'info_toolbar_button',
            id: "info_button",
            container:ReactDOM.findDOMNode(this.refs.root),
            icon: "envelope-o",
            height:50,
            click: function(){
                props.handlerInfoButton($$("info_button").config.badge);
            }
        }

        this.ui = window.webix.ui(element);
    }

    componentWillUnmount(){
        this.ui.destructor();
        this.ui = null;
    }

    componentWillReceiveProps(nextProps) {
        $$("info_button").define("badge","");
        if(nextProps.isUpdate){
            $$("info_button").define("badge","!");            
        }
        $$("info_button").refresh();
    }

    render() {
        return (
            <div ref="root"></div>
        )
    }

}