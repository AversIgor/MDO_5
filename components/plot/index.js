import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';
import * as common from '../reference/common';

export default class ComponenLayot extends Component {

    constructor(props) {
        super(props);
        this.ui         = [];
    }       
    componentDidMount(){ 

        let self = this;

        if(!this.props.plotObject){
            if(this.props.curentproject){
                if(!this.props.curentproject.saved){
                    webix.modalbox({
                        title: "Внимание!",
                        buttons:["Продолжить проект", "Начать новый"],
                        text: "Зафиксирован не сохраненный проект",
                        type:"confirm-warning",
                        width:400,
                    }).then(function(result){
                        switch(result){
                            case "0": 
                            self.props.initPlot(self.props.curentproject.plot);
                                break;
                            case "1":
                            self.props.initPlot();
                                break;
                        }   
                    });
                }else{
                    this.props.initPlot()
                }
            }else{
                this.props.initPlot()
            }
        } 

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
        this.props.conteinerReady()
    }  
   
    componentWillUnmount(){
        common.uiDestructor(this)
        webix.modalbox.hideAll();
    }

    shouldComponentUpdate(){
        return false;
    }

    render() {        
        return (
            <div  ref="root" style={{height: "100%"}}></div>)
    }

}