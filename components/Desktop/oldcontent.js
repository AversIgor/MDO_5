import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';

export default class ComponentOldContent extends Component {

    constructor(props) {
        super(props);
    }

    setSize = () => {
        let toolbar     = $('[view_id="toolbar"]');
        let left_menu   = $('#div_left_menu');
        let content     = $('#content');
        content.css({
            "left"           : left_menu.width() + "px",
            "height"         : left_menu.height() + "px",
            "width"          : (toolbar.width()-left_menu.width()) + "px",
        })
    }

    componentDidMount(){        
        this.setSize();
        this.props.module.init()
    }

    componentWillReceiveProps(nextProps) {
        this.setSize();
    }

    shouldComponentUpdate(){
        return false;
    }


    render() {
        return (<div id="content" className="content"></div>)
    }
}