import React, { Component, PropTypes } from "react";

import * as residual from "./residual";
import * as decor from "./decor";
import * as measure from "./measure";
import * as head from "./head";
import * as property from "./property";

import {roundingLengths,roundingAngle,roundingGps} from "../../../actions/Abris/common";



window.webix.editors.rhumbeditor = window.webix.extend({
    getValue:function(){
        let value = this.getInputNode(this.node).value
        value = value.toString().replace(',', '.');
        value = parseFloat(value)
        if(!window.webix.rules.isNumber(value)){
            return 0;
        }
        if((value > 90) || (value < 0)){
            return 0;
        }
        value = roundingAngle(value);
        return value;
    },
},  window.webix.editors.text);

window.webix.editors.azimuteditor = window.webix.extend({
    getValue:function(){
        let value = this.getInputNode(this.node).value
        value = value.toString().replace(',', '.');
        value = parseFloat(value)
        if(!window.webix.rules.isNumber(value)){
            return 0;
        }
        if((value > 360) || (value < 0)){
            return 0;
        }
        value = roundingAngle(value);

        return value;
    },
},  window.webix.editors.text);

window.webix.editors.distanceditor = window.webix.extend({
    getValue:function(){
        let value = this.getInputNode(this.node).value
        value = value.toString().replace(',', '.');
        value = parseFloat(value)
        if(!window.webix.rules.isNumber(value)){
            return 0;
        }
        if(value < 0){
            return 0;
        }
        value = roundingLengths(value);
        return value;
    },
},  window.webix.editors.text);

window.webix.editors.gpseditor = window.webix.extend({
    getValue:function(){
        let value = this.getInputNode(this.node).value
        value = value.toString().replace(',', '.');
        value = parseFloat(value)
        if(!window.webix.rules.isNumber(value)){
            return 0;
        }
        value = roundingGps(value);
        return value;
    },
},  window.webix.editors.text);


export default class PlotProperty extends Component {

    constructor(props) {
        super(props);
        this.curentObject           = undefined
        this.selected_plot_circuit  = -1
    }


    setSelected = (index) => {
        this.selected_plot_circuit  = index
    }

    contourDelete = () => {
        let self    = this;
        if(this.selected_plot_circuit >=0){
            window.webix.confirm({
                title:"Title",
                ok:"Да", cancel:"Нет",
                text:"Удалить выделенную строку?",
                callback: function(result){
                    if(result){
                        self.selected_plot_circuit  = self.selected_plot_circuit-1
                        self.props.contourDelete(self.selected_plot_circuit+1); 
                    }
                }
            })
        }
    }
    contourAdd = () => {
        this.selected_plot_circuit  = this.props.curentObject.contour.length
        this.props.contourAdd();
    }

    updateUI = (props) => {

        if(this.curentObject == undefined){
            this.ui.hide();
            return
        }
        //отображение
        this.ui.show();

        //промеры
        measure.updateColumns(this.curentObject.typeangle,this.props)
        measure.update(this.curentObject,this.selected_plot_circuit)

        //невязки и свойства
        property.update(this.curentObject)
        residual.update(this.curentObject)

        //оформления
        decor.update(this.curentObject,props)

        head.update(props)

        //доступность
       $$('tabview_property').define('disabled',props.mode)


    }

    componentDidMount(){

        let self    = this;
        this.curentObject = this.props.curentObject;        
     
        var conteiner = {
            view:"window",
            id:"window_property",
            zIndex:100,
            width: 350,
            move:true,
            top:105,
            left:document.documentElement.clientWidth-355,
            maxHeight:document.documentElement.clientHeight-135,
            head:head.ui(this,"window_property"),
            headHeight:25,
            body: {
                borderless:true,
                view:"tabview",
                tabbar:{
                    height:25
                },
                id:"tabview_property",
                cells: [
                    {
                        header:"<span class='webix_icon fa-info'></span>Свойства",
                        body:{
                            rows:[
                                property.ui(this.props),
                                measure.ui(this.setSelected,this.contourDelete,this.contourAdd,this.props),
                                residual.ui(this.props),
                            ]
                        },
                    },
                    {
                        //header:"Оформление",
                        header:"<span class='webix_icon fa-paint-brush'></span>Оформление",
                        body:decor.ui(this.props.editStyle,this.props.updateStyle)
                    }
                ]
            },
            
            on:{
                'onHide': function(id){
                    //self.props.clearCurentObject()
                    self.props.changeMode(1,undefined)
                }
            }
        };


        this.ui = window.webix.ui(conteiner);

        window.webix.UIManager.addHotKey("Delete", function() {
            self.contourDelete();
            return false;
        }, $$('plot_circuit'));
        window.webix.UIManager.addHotKey("Insert", function() {
            self.contourAdd();
            return false;
        }, $$('plot_circuit'));

        window.webix.UIManager.addHotKey("Ctrl+Z", function() {
            self.props.ctrl_z();
        });

    }

    componentWillReceiveProps(nextProps) {
        this.curentObject           = nextProps.curentObject;
        this.updateUI(nextProps)
    }

    componentWillUnmount(){

        let self    = this;

        this.ui.destructor();
        this.ui = null;
        window.webix.UIManager.removeHotKey("Ctrl+Z", function() {
            self.props.ctrl_z();
        });

    }

    render() {
        return null
    }
}