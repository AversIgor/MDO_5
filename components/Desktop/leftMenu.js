import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';

export default class ComponentLeftMenu extends Component {

    constructor(props) {
        super(props);
        this.ui = null;
    }

    componentDidMount(){
        var self    = this;
        var menu = {
            container:ReactDOM.findDOMNode(this.refs.root),
            id:'container_left_menu',
            rows:[
            {
                //css: "menu",
                //padding: 2,
                view: "form",
                cols:[
                    { view: "button", type: "icon", icon: "bars", inputWidth: 37, align: "left",
                        click: function(){
                            $$("left_menu").toggle()
                        }
                    }
                ]
            },
            {
                view: "sidebar",
                id:'left_menu',
                data: self.props.data,  
                autoheight:true,              
                on:{
                    onAfterSelect: function(id){
                        self.props.clickMenu(id);
                    }
                }
            }
        ]}
        this.ui = window.webix.ui(menu);
    }

    componentDidUpdate(prevProps, prevState){
        $$("container_left_menu").adjust() 
    }

    componentWillUnmount(){
        this.ui.destructor();
        this.ui = null;
    }

    render() {
        return(
            <div ref="root" style={{height: "100%"}}></div>
        )
    }
}