import React, { Component, PropTypes } from "react";

export default class Confirm extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount(){

        let props = this.props;
        let confirm = {
            title:props.title,
            ok:"Да",
            cancel:"Нет",
            type:props.type,
            text:props.text,
            callback:function(result){
                if(result) props.handlerConfirmResult();
            }
        }

        window.webix.confirm(confirm);
    }

    shouldComponentUpdate(){
        return false;
    }

    render() {
        return (
            <div ref="root"></div>
        )
    }

}