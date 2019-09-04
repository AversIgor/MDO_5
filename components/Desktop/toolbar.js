import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';

import logo from '../../img/logo-w-big.png'



export default class ComponentToolbar extends Component {

    constructor(props) {
        super(props);
    }


    shouldComponentUpdate(){
        return false;
    }


    render() {
        return (<div ref="root" className="toolbar" view_id="toolbar"><img className='logo' src={logo} /></div>)
    }
}