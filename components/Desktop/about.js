import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';

export default class ComponentAbout extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(){
        let props = this.props
        let head ={
            view:"toolbar",
            cols:[
                { view:"label", label: "О программе" },
                {},
                {
                    view:"icon",
                    id:"Aboutclose",
                    tooltip:"Закрыть",
                    align:"right",
                    icon: "times",
                    click: "$$('AboutWindow').hide()"
                }
            ]
        }
        let AboutWindow = {
            view:"window",
            id:"AboutWindow",
            head:head,
            width: 550,
            height: 150,
            position:"center",
            body:{
                data: { 
                    curentVersion: props.curentVersion,
                },
                template:'<div style="width: 100%;">'+
                '    <div style="width: 100%; height: 35px; text-align: center;">'+
                '        <label style="font-weight: bold;">АВЕРС:Материально-денежная оценка лесосек #5</label>'+
                '    </div>'+
                '    <div style="width: 100%; height: 35px;">'+
                '        <label style="width: 120px;display: inline-block;">Версия:</label>'+
                '        <label style="width: 400px;  text-align: left; padding-left: 10px">#curentVersion#</label>'+
                '    </div>'+
                '    <div style="width: 100%;height: 35px;">'+
                '        <label style="width: 120px;display: inline-block;">Разработчик:</label>'+
                '        <label style="width: 400px;  text-align: left; padding-left: 10px">©&nbsp;ООО "Аверс информ", 2009-2019. Все права защищены.</label>'+
                '    </div>'+ 
                '</div>'
            },
            on:{
                'onHide': function(id){ 
                    props.clickQuestionMenu(''); 
                }
            }
        }     

        this.ui = window.webix.ui(AboutWindow);
        this.ui.show()
    }

    componentWillUnmount(){
        this.ui.destructor();
        this.ui = null;
    }

    render() {
        return null
    }

}