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
            width:220,
            rows:[
                {
                    view:"grouplist",
                    id:"left_menu",
                    select:true,
                    data:self.props.data,
                    on:{
                        onAfterSelect: function(id){
                            self.props.clickMenu(id);
                        }
                    }
                }
            ]
        }
        this.ui = window.webix.ui(menu);
        this.props.resizeLeftMenu($$("left_menu").$width+17)
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
            <div ref="root" style={{height: "100%",position: 'absolute',zIndex: '20'}}></div>
        )
    }
}