import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';

export default class ComponentButton extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(){
        var props = this.props;
        let button = {
            view: "button",
            container:ReactDOM.findDOMNode(this.refs.root),
            css:'mdo_subsystem_toolbar_button',
            label:"МДО",
            align:'left',
            width:80,
            click: function(){
                props.handlerToolbarButton()
            }
        }
        this.ui = window.webix.ui(button);
    }

    shouldComponentUpdate(){
        return false;
    }
    componentWillUnmount(){
        this.ui.destructor();
        this.ui = null;
    }

    render() {
        return (<div ref="root"></div>)
    }
}