import React, { Component, PropTypes } from "react";

export default class ComponentToolbarButton extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount(){
        var props = this.props;
        var menu = {
            view: "button",
            id: "admin__toolbar_button",
            label:"Администрирование",
            width:140,
            align:'left',
            click: function(){
                props.handlerToolbarButton()
            }
        }
        $$(this.props.container).addView(menu,this.props.index);
    }

    render() {
        return(
            <div ref="root"></div>
        )
    }
}