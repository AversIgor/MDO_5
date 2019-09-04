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
            width:500,
            position:"center",
            modal:true,
            head:{
                view:"toolbar",
                cols:[
                    {view:"label", label: "Выбор печатной формы" },
                    {
                        view:"icon",
                        tooltip:"Закрыть",
                        icon: "times",
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
                                if(id == 1){
                                    props.handlerOpen_saveaspng()
                                }
                                else if(id == 2){
                                    props.handlerOpen_567()
                                }
                                else{
                                    props.handlerOpenPrintForm(id)
                                }
                                $$('selectprintform').hide()
                            }
                        }
                    }
                ]
            },
            on:{
                onHide:function(){
                    props.handlerCloseSelectPrintForm();
                }
            }
        };

        this.ui = window.webix.ui(modalbox);

    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.show){
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

