import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';
import * as common from '../reference/common';

export default class ComponenLayot extends Component {

    constructor(props) {
        super(props);
        this.ui         = [];
    }       
    componentDidMount(){  
        
        let layout = {
            id:this.id+'_layout',
            container:ReactDOM.findDOMNode(this.refs.root),
            rows:[
                {
                    cols:[
                        {id:'plot_recount'}, 
                        { view:"resizer" },
                        {id:'plot_steps'},                        
                        { view:"resizer" },
                        {id:'plot_property'},
                    ]
                },
            ]
        }
        this.ui.push(window.webix.ui(layout))
        this.props.conteinerReady()
    }  
   
    componentWillUnmount(){
        common.uiDestructor(this)
    }

    shouldComponentUpdate(){
        return false;
    }

    render() {        
        return (
            <div  ref="root" style={{height: "100%"}}></div>)
    }

}