import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';


export default class Update extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(){
        let element = {
            view:"window",
            id:"update_window",
            head:"Обновление",
            container:ReactDOM.findDOMNode(this.refs.root),
            modal:true,
            position:"center",
            body:{
                view: "template",
                autoheight:true,
                id:"update_window_template",
                template:''
            }
        }

        this.ui = window.webix.ui(element);
    }


    shouldComponentUpdate(){
        return false;
    }

    componentWillUnmount(){
        this.ui.destructor();
        this.ui = null;
    }

    componentWillReceiveProps(nextProps) {

        if(nextProps.textUpdate){
            $$("update_window_template").setHTML("<h3 align='center'>"+nextProps.textUpdate+"</h3>");
            this.ui.show();
        }else{
            this.ui.hide();
        }
    }

    render() {
        return (
            <div ref="root"></div>
        )
    }

}