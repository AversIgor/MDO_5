import React, { Component, PropTypes } from "react";


export default class Opacity extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(){

        let props = this.props;

        var modalbox = {
            view:"window",
            id:"popup_opacity",
            width:300,
            position:"center",
            modal:true,
            zIndex:500,
            head:{
                view:"toolbar",
                cols:[
                    {view:"label", label: "Изменение прозрачности" },
                    {
                        view:"icon",
                        tooltip:"Закрыть",
                        icon: "times",
                        click: "$$('popup_opacity').hide()"
                    }
                ]
            },
            body:{
                view:"slider",
                id:"Abris_opacity",
                moveTitle:false,
                on:{
                    onSliderDrag:function(){
                        let newv = this.getValue()
                        this.define("title", "Прозрачность "+newv+" %");
                        this.refresh();
                        if(newv>100) {
                            newv = 100;
                        }
                        props.setOpacity(newv/100);
                    }
                }
            },
            on:{
                onHide:function(){
                    props.handlerCloseOpacityForm();
                }
            }
        };

        this.ui = window.webix.ui(modalbox);

    }

    componentWillReceiveProps(nextProps) {
        let control = $$("Abris_opacity");
        let value = Math.round(nextProps.opacity*100);
        let title = "Прозрачность " + value+" %";

        control.define("value",value);
        control.define("title",title);
        control.refresh();
        if(nextProps.show){
            this.ui.show();
            control.focus();
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

