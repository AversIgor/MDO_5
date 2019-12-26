import React, { Component, PropTypes } from "react";

export default class Gpsbinding extends Component {

    constructor(props) {
        super(props);
		this.x = 0;
		this.y = 0;
    }

    componentDidMount(){

        let self    = this;
        let props   = this.props;

        let form = {
            view:"form",
            id:"gps_binding_form",
            borderless:true,
            elements: [
				{ cols:[
					{ view:"text",label:"Широта,&deg;", name:"x"},
					{ view:"text",label:"Долгота,&deg;", name:"y"},
				]},
                { view:"button", value: "ОК", click:function(){
                    if ( $$('gps_binding_form').validate() ){

						let x = $$("gps_binding_form").getValues().x
						let y = $$("gps_binding_form").getValues().y

						if(x > 90 || x < -90) {
							window.webix.message({ type:"error", text:"Широта должна быть задана в пределах от -90&deg; до +90&deg;" })
						} else if(y > 180 || y < -180) {
							window.webix.message({ type:"error", text:"Долгота должна быть задана в пределах от -180&deg; до +180&deg;" })
						} else {
							self.x = x
							self.y = y
							this.getTopParentView().hide()
						}
                    }
                    else
                        window.webix.message({ type:"error", text:"Координаты не указаны или указаны неверно!" });

                }}
            ],
            rules:{
				"x":webix.rules.isNumber,
				"y":webix.rules.isNumber,
            },
            elementsConfig:{
                labelPosition:"top",
            }
        };

        var modalbox = {
            view:"window",
            id:"gps_binding",
            width:350,
            position:"top",
            head:{
                view:"toolbar",
                cols:[
                    {view:"label", label: "Координаты точки географической привязки" },
                    {
                        view:"icon",
                        tooltip:"Закрыть",
                        icon: "mdi mdi-close",
                        click: "$$('gps_binding').hide()"
                    }
                ]
            },
            body:form,
            on:{
                onHide:function(){
					props.handlerGpsComplete(self.x, self.y)
                }
            }
        };

        this.ui = window.webix.ui(modalbox);

    }

    componentWillReceiveProps(nextProps) {

		if(this.props.mode == 3 && nextProps.mode != 3) this.props.handlerGpsHide();

        if(nextProps.mode != 3){
			this.ui.hide()
        }else {
            if(!this.ui.isVisible()){
                this.ui.show()
            }
            $$("gps_binding_form").setValues({
				x: nextProps.gps.x,
				y: nextProps.gps.y,
            });
            this.x = nextProps.gps.x;
		    this.y = nextProps.gps.y;
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