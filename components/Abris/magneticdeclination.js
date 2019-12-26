import React, { Component, PropTypes } from "react";

export default class MagneticDeclination extends Component {

    constructor(props) {
        super(props);
		this.magneticdeclination = 0;
    }



    componentDidMount(){

        let self    = this;
        let props   = this.props;

        let form = {
            view:"form",
            id:"magnetic_declination_form",
            borderless:true,
            elements: [
				{ cols:[
                        {
                            view:"text",
                            label:"Магнитное склонение,&deg;",
                            name:"magneticdeclination",
                         }
                    ]
                },
                { view:"button", value: "ОК", click:function(){
                    if ( $$('magnetic_declination_form').validate() ){
						let magneticdeclination = $$("magnetic_declination_form").getValues().magneticdeclination
						if(magneticdeclination > 90 || magneticdeclination < -90) {
							window.webix.message({ type:"error", text:"Магнитное склонение должны быть задана в пределах от -90&deg; до +90&deg;" })
						}else {
							self.magneticdeclination = magneticdeclination
							this.getTopParentView().hide()
						}
                    }
                    else
                        window.webix.message({ type:"error", text:"Магнитное склонение указано неверно!" });

                }}
            ],
            rules:{
				"magneticdeclination":webix.rules.isNumber,
            },
            elementsConfig:{
                labelPosition:"top",
            }
        };

        var modalbox = {
            view:"window",
            id:"magnetic_declination",
            width:350,
            position:"top",
            modal:true,
            head:{
                view:"toolbar",
                cols:[
                    {view:"label", label: "Ввод магнитного склонения" },
                    {
                        view:"icon",
                        tooltip:"Закрыть",
                        icon: "mdi mdi-close",
                        click: "$$('magnetic_declination').hide()"
                    }
                ]
            },
            body:form,
            on:{
                onHide:function(){
					props.handlerMagneticDeclinationComplete(self.magneticdeclination)
                }
            }
        };

        this.ui = window.webix.ui(modalbox);

    }

    componentWillReceiveProps(nextProps) {

        if(nextProps.mode != 4){
            if(this.ui.isVisible()){
                this.ui.hide()
            }
        }else {
            if(!this.ui.isVisible()){
                this.ui.show()
            }
            $$("magnetic_declination_form").setValues({
                magneticdeclination: nextProps.magneticdeclination,
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