import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';
import * as common from '../reference/common';


export default class ComponentPlot extends Component {

    constructor(props) {
        super(props);
        this.id         = 'plot';
        this.ui         = [];
    }   

    componentDidMount(){
        let self = this;

        let property = {
            view:"property",
            id:this.id+'_property',
            complexData:true,
            autoheight:true,
            autowidth:true,
            nameWidth:220,
            css:'webix_dark',
            borderless:true,
            elements:[
                { label:"Местоположение", type:"label"},
                { label:"Лесничество", type:"select", id:"location.forestry",options:[]},
                { label:"Участковое лесничество", type:"select", id:"location.subforestry",options:[]},
            ],
            on:{
                "onBeforeEditStart":function(cell){
                    if (cell == "location.forestry"){
                        $$(self.id+'_property').getItem(cell).collection.clearAll()
                        $$(self.id+'_property').getItem(cell).collection.add(self.props.forestry[0])
                    }
                },
                "onAfterEditStop":function(state, editor, ignoreUpdate){
                    console.log(this.getValues())
                    //self.updateProperty(self.props);
                    //self.props.handlerEdit("contacts",this.getValues())
                },
                "onCheck":function(id,state){
                    //self.props.handlerEdit("contacts",this.getValues())
                },
            }
        }
        
        
        let layout = {
            id:this.id+'_layout',
            container:ReactDOM.findDOMNode(this.refs.root),
            css:'content',
            rows:[
                {
                    view:"accordion",
                    multi:true,
                    css:"webix_dark",
                    type:"wide",
                    cols:[ //or rows 
                        { header:"Настроки МДО", body:"Объекты", }, 
                        { view:"resizer" },
                        { header:"Настройки абриса", body:"Объекты",},
                        { view:"resizer" },
                        { header:"Описание лесосеки", body:property, }
                    ]
                }
            ]
        }
        this.ui.push(window.webix.ui(layout))
    }


    componentWillReceiveProps(nextProps) {        
        //$$(this.id+'_property').setValues(nextProps.property);

        $$(this.id+'_property').setValues({
            location:{
                forestry:1,
                subforestry:1
            }
        });
        $$(this.id+'_property').getItem('location.subforestry').collection.clearAll()
        $$(this.id+'_property').getItem('location.subforestry').collection.add(nextProps.subforestry[0])
    }

    componentWillUnmount(){
        common.uiDestructor(this)
    }

    shouldComponentUpdate(){
        return false;
    }

    render() {
        return (
            <div  ref="root"></div>)
    }

}