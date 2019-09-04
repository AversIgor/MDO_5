import React, { Component, PropTypes } from "react";


export default class Rotate extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(){

        let props = this.props;

        var modalbox = {
            view:"popup",
            id:"popup_rotate",
            hidden:true,
            width:300,
            position:"center",
            zIndex:500,
            head:false,
            body:
            {
                view:"counter",
                id:"Abris_rotate",
                label:"Поворот",
                step:1,
                min:0,
                max:360,
                on:{
                    onChange:function(newv, oldv){
                        if(window.webix.rules.isNumber(newv)){
                            props.setRotate(newv);
                        }else {
                            webix.message({ type:"error", text:'Допускаются только целые числа!'});
                        }
                    },
                    onEnter:function(){
                        props.handlerCloseRotateForm()
                    }
                }
            },
            on:{
                onHide:function(){
                    props.handlerCloseRotateForm();
                }
            }
        };

        this.ui = window.webix.ui(modalbox);

    }

    componentWillReceiveProps(nextProps) {
        $$("Abris_rotate").define("value",Math.round(nextProps.rotate));
        $$("Abris_rotate").refresh();
        if(nextProps.show){
            this.ui.show();
            $$("Abris_rotate").focus();
        }else{
            this.ui.hide();
        }
    }

    componentWillUnmount(){
        this.ui.destructor();
        this.ui = null;
    }

    render() {
        return null
    }
}

