import React, { Component, PropTypes } from "react";


export default class Scale extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(){

        let props = this.props;

        var modalbox = {
            view:"window",
            id:"popup_scale",
            width:300,
            position:"center",
            modal:true,
            zIndex:500,
            head:{
                view:"toolbar",
                cols:[
                    {view:"label", label: "Изменение масштаба" },
                    {
                        view:"icon",
                        tooltip:"Закрыть",
                        icon: "times",
                        click: "$$('popup_scale').hide()"
                    }
                ]
            },
            body:
            {
                view:"select",
                label:"Масштаб",
                name:"popup_scale_select",
                id:"popup_scale_select",
                on:{
                    onChange:function(newv, oldv){
                        props.setScale(newv);
                        let menu = this
                        setTimeout(function() {
                            props.handlerCloseScaleForm();
                        }, 500);
                    }
                }
            },
            on:{
                onHide:function(){
                    props.handlerCloseScaleForm();
                }
            }
        };

        this.ui = window.webix.ui(modalbox);

    }

    componentWillReceiveProps(nextProps) {
        $$("popup_scale_select").define("value",nextProps.scale);
        $$("popup_scale_select").define("options",nextProps.scaleArray);
        $$("popup_scale_select").refresh();
        if(nextProps.show){
            this.ui.show();
            $$("popup_scale_select").focus();
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

