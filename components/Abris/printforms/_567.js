//ПРИКАЗ от 17 октября 2017 г. N 567

import React, { Component, PropTypes } from "react";


var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default class _567 extends Component {

    constructor(props) {
        super(props);
    }


    setPDF = (props) => {

        if(props.params.definition){
            pdfMake.createPdf(props.params.definition).getDataUrl(function(outDoc) {
                document.getElementById('pdfV').src = outDoc;
            });
        }

    }

    componentDidMount(){

        let self = this;
        let node        = document.getElementById('paint')

        this.modalbox = {
            view:"window",
            id:'_567',
            height:node.clientHeight+44,
            width:node.clientWidth,
            position:"center",
            modal:true,
            head:{
                view:"toolbar",
                cols:[
                    {view:"label", label: "Абрис лесосеки (Приказ от 17 октября 2017 г. N 567)" },
                    {
                        view:"icon",
                        tooltip:"Закрыть",
                        icon: "times",
                        click: "$$('_567').hide()"
                    }
                ]
            },
            body:{
                cols:[
                    {
                        view: "template",
                        type:"clean",
                        height:node.clientHeight,
                        width:node.clientWidth-450,
                        template: "<iframe id='pdfV' style='height: 100%; width: 100%'></iframe>"
                    },
                    {
                        width:450,
                        rows:[
                            {
                                view:"textarea",
                                label:"Местоположение:",
                                labelWidth:140,
                                height:50,
                                css:"layot_background_white",
                                value:this.props.params.location,
                                on:{
                                    'onChange': function(newv, oldv){
                                        if(oldv){
                                            self.props.newLocation(newv);
                                        }
                                    }
                                }
                            },
                            {
                                view:"text",
                                label:"Площадь, га:",
                                labelWidth:140,
                                value:this.props.params.area,
                                css:"layot_background_white",
                                on:{
                                    'onChange': function(newv, oldv){
                                        if(oldv != undefined){
                                            self.props.newArea(newv);
                                        }
                                    }
                                }
                            },
                            {
                                view:"checkbox",
                                labelRight :"Экспликация внутренних контуров",
                                value:this.props.params.viewChildrens,
                                on:{
                                    'onChange': function(newv, oldv){
                                        if(oldv != undefined){
                                            self.props.newViewChildrens(newv);
                                        }
                                    }
                                }
                            },
                            {
                                view:"textarea",
                                label:"Подпись:",
                                labelWidth:140,
                                height:50,
                                css:"layot_background_white",
                                value:this.props.params.sign,
                                on:{
                                    'onChange': function(newv, oldv){
                                        if(oldv){
                                            self.props.newSign(newv);
                                        }
                                    }
                                }
                            },
                        ]
                    },
                ]
            },
            on:{
                onHide:function(){
                    self.props.handlerClose();
                }
            }
        };

        this.ui = window.webix.ui(this.modalbox);
        this.ui.show();
        this.setPDF(this.props)

    }


    componentWillUnmount(){
        if(this.ui){
            this.ui.destructor();
            this.ui = null;
        }
    }

    render() {
        return null
    }
}