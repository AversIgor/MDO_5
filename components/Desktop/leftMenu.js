import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';

export default class ComponentLeftMenu extends Component {

    constructor(props) {
        super(props);
    }

    resize = () => {
        let toolbar     = $('[view_id="toolbar"]');
        $('#div_left_menu').css({
            "height"            : $(window).height()-toolbar.height() + "px",
        })
        $$("container_left_menu").adjust()
    }

    componentDidMount(){
        var self    = this

        var menu = {
            container:ReactDOM.findDOMNode(this.refs.root),
            id:'container_left_menu',
            rows:[
            {
                css: "menu",
                padding: 2,
                view: "form",
                cols:[
                    { view: "button", type: "icon", icon: "bars", inputWidth: 37, align: "left", css: "app_button menu",
                        click: function(){
                            $$("left_menu").toggle()
                            self.props.resize()
                        }
                    }
                ]
            },
            {
                view: "sidebar",
                id:'left_menu',
                data: [],
                
                on:{
                    onAfterSelect: function(id){
                        self.props.handlerItemClick(id);
                    }
                }
            }
        ]}

        this.ui = window.webix.ui(menu);
        window.webix.event(window, "resize", function(){
            self.resize()
        })
    }

    


    
    componentWillReceiveProps(nextProps) {
        $$("left_menu").clearAll();
        $$("left_menu").define("data",nextProps.data);
        $$('left_menu').refresh();
        this.resize()
        $$('left_menu').expand();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    componentWillUnmount(){
        this.ui.destructor();
        this.ui = null;
    }

    render() {
        return(
            <div ref="root"
                 id="div_left_menu"
                 style={{
                    position: 'absolute',
                    top: '50px',
                    left: '0px',
                    zIndex: '50'
                  }}>

            </div>
        )
    }
}