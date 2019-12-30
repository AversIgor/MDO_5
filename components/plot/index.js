import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';
import * as common from '../reference/common';

export default class ComponenLayot extends Component {

    constructor(props) {
        super(props);
        this.ui         = [];
    }  
    
    shouldComponentUpdate(nextProps, nextState){
        return true
    }    

    componentDidMount(){ 

        let props =  this.props
        let layout = {
            id:this.id+'_layout',
            container:ReactDOM.findDOMNode(this.refs.root),
            rows:[
                {
                    cols:[
                        {id:'plot_recount'}, 
                        { view:"resizer" },
                        {id:'plot_steps'},                                            
                        { view:"resizer" },
                        {id:'plot_property'},
                    ]
                },
            ]
        }
        this.ui.push(window.webix.ui(layout))
        props.conteinerReady();

        if(!props.plotObject){
            if(props.curentproject.plot){
                webix.modalbox.hide("saveProject");
                webix.modalbox({
                id:"saveProject", 
                title: "Внимание!",
                buttons:["Продолжить расчет", "Начать новый"],
                text: "Зафиксирован не сохраненный расчет МДО",
                type:"confirm-warning",
                width:400,
                }).then(function(result){
                    switch(result){
                        case "0": 
                            props.newPlot(props.curentproject.plot);
                            break;
                        case "1":
                            props.newPlot();
                            break;
                    }   
                });
            }else{
                props.newPlot();
            }
        }  
    }  
   
    componentWillUnmount(){
        common.uiDestructor(this)
    }

    shouldComponentUpdate(){
        return false;
    }

    render() {        
        return (
            <div  ref="root" style={{height: "100%"}}></div>)
    }

}