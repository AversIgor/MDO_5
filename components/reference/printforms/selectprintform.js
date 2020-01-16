import React, { Component, PropTypes } from "react";

export default class selectprintform extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(){
        let props = this.props;

        var modalbox = {
            view:"window",
            id:"selectprintform",
            width:700,
            position:"center",
            modal:true,
            head:{
                view:"toolbar",
                cols:[
                    {view:"label", label: "Выбор печатной формы" },
                    {
                        view:"icon",
                        tooltip:"Закрыть",
                        icon: "mdi mdi-close",
                        click: "$$('selectprintform').hide()"
                    }
                ]
            },
            body:{
                type: "clean",
                padding:5,
                rows:[
                    {
                        view:"list",
                        id:"selectprintform_list",
                        autoheight:true,
                        autowidth:true,
                        template:"#title#",
                        select:true,
                        data:[],
                        on:{
                            onItemDblClick:function(id, e, node){
                                props.selectPrintForm(id)
                                $$('selectprintform').hide()
                            }
                        }
                    }
                ]
            },
            on:{
                onHide:function(){
                    props.handlerOpenClose(false);
                }
            }
        };

        this.ui = window.webix.ui(modalbox);

    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.open){
            $$("selectprintform_list").define("data",nextProps.data);
            $$("selectprintform_list").refresh();
            this.ui.show();
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

