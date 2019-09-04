import React, { Component, PropTypes } from "react";

export default class Backgroundloadform extends Component {

    constructor(props) {
        super(props);
        this.file = {};
        this.scale = props.scale;
    }

    componentDidMount(){

        let _this = this;
        let props = this.props;
        var loadform = {
            view:"window",
            width:350,
            head:"Выбор файла подложки",
            position:"center",
            id:'window_load_form',
            zIndex:300,
            body:{
                view:"form",
                id:"abris_load_form",
                elements:[
                    {
                        view:"select",
                        label:"Масштаб",
                        name:"scale",
                        id:"scale",
                        options:[],
                    },
                    {
                        view:"uploader",
                        multiple:false,
                        id:"abris_uploader",
                        name:"files",
                        value:"Выбрать файл",
                        link:"doclist", autosend:false
                    },
                    { view:"list", scroll:false, id:"doclist", type:"uploader", autoheight:true,},
                    {
                        margin:5,
                        cols:[
                            { view:"button", value:"ОК" , type:"form", click:function(){
                                let lastId = $$('doclist').getLastId()
                                if(lastId){
                                    let item = $$('doclist').getItem(lastId)                                    
                                    props.handlerLoadFile(_this.file);
                                    props.handlerScale(_this.scale);
                                }
                                $$("window_load_form").hide();
                                props.handlerCloseLoadForm()
                            }
                            },
                            { view:"button", value:"Отмена", click:function(){
                                $$("window_load_form").hide();
                                props.handlerCloseLoadForm()
                            }
                            }
                        ]
                    }
                ]
            }
        }

        this.ui = window.webix.ui(loadform);

        $$("abris_load_form").elements["files"].attachEvent("onAfterFileAdd", function(event){
            _this.file = event;
        });
        $$("abris_load_form").elements["scale"].attachEvent("onChange", function(newv, oldv){
            _this.scale = newv;
        });
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.show){
            this.ui.show();
            $$("scale").define("value",nextProps.scale);
            $$("scale").define("options",nextProps.scaleArray);
            $$("scale").refresh();
            this.scale = nextProps.scale;
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

