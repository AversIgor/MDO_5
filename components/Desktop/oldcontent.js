import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';

export default class ComponentOldContent extends Component {

    constructor(props) {
        super(props);
    }


    componentDidMount(){        
        this.props.module.init()
    }

    shouldComponentUpdate(){
        return false;
    }

    render() {
        return (<div id="content" className="content" style={{"height":"100%","width":"100%",}}></div>)
    }
}