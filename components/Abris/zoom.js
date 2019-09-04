import React, { Component, PropTypes } from "react";


export default class Zoom extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(){

        let props = this.props;

        var modalbox = {
            view:"popup",
            id:"popup_zoom",
            hidden:true,
            width:300,
            position:"center",
            zIndex:500,
            head:false,
            body:
            {
                view:"counter",
                id:"Abris_zoom",
                label:"Zoom",
                step:1,
                min:10,
                max:1000,
                format:"1.111,00",
                on:{
                    onChange:function(newv, oldv){
                        if(window.webix.rules.isNumber(newv)){
                            props.setZoom(newv/100);
                        }else {
                            webix.message({ type:"error", text:'Допускаются только целые числа!'});
                        }
                    },
                    onEnter:function(){
                        props.handlerCloseZoomForm()
                    }
                }
            },
            on:{
                onHide:function(){
                    props.handlerCloseZoomForm();
                }
            }
        };

        this.ui = window.webix.ui(modalbox);

    }

    componentWillReceiveProps(nextProps) {
        let zoom = Math.round(nextProps.zoom*100);
        let Abris_zoom = $$("Abris_zoom")
        Abris_zoom.define("value",zoom);
        Abris_zoom.refresh();
        if(nextProps.show){
            this.ui.show();
            Abris_zoom.focus();
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

