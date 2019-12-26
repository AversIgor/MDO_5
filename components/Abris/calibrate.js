import React, { Component, PropTypes } from "react";



export default class Calibrate extends Component {

    constructor(props) {
        super(props);
        this.distance = 0
    }

    componentDidMount(){

        let self    = this;
        let props   = this.props;

        let form = {
            view:"form",
            id:"calibrate_form",
            borderless:true,
            elements: [
                { view:"text",label:"Расстояние", name:"distance"},
                { view:"button", value: "ОК", click:function(){
                    if (($$('calibrate_form').validate()) && ($$("calibrate_form").getValues().distance != 0)){
                        self.distance = $$("calibrate_form").getValues().distance
                        this.getTopParentView().hide();
                    }
                    else
                        window.webix.message({ type:"error", text:"Расстояние не указано!" });

                }}
            ],
            rules:{
                "distance":webix.rules.isNumber,
            },
            elementsConfig:{
                labelPosition:"top",
            }
        };

        var modalbox = {
            view:"window",
            id:"calibrate",
            width:350,
            position:"top",
            move:true,
            head:{
                view:"toolbar",
                cols:[
                    {view:"label", label: "Калибровка (Укажите расстояние в метрах)" },
                    {
                        view:"icon",
                        tooltip:"Закрыть",
                        icon: "mdi mdi-close",
                        click: "$$('calibrate').hide()"
                    }
                ]
            },
            body:form,
            on:{
                onHide:function(){
                    props.handlersetCoefficientCalibrate(self.distance)
                }
            }
        };

        this.ui = window.webix.ui(modalbox);

    }

    componentWillReceiveProps(nextProps) {

        if(nextProps.mode != 2){
            this.distance = 0
            this.ui.hide();
        }else {
            if(!this.ui.isVisible()){
                this.ui.show()
            }
            $$("calibrate_form").setValues({
                distance: nextProps.calibrate.distance,
            });
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

