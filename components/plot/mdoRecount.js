import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';

export default class ComponentMdoRecount extends Component {

    constructor(props) {
        super(props);
        this.id = 'plot_mdoRecount';
        this.typesrates = undefined;
    }

    updateUI(props){
       
    }


    initUI(){

        let self = this
        
        let head = {
            view:"toolbar",
            id:self.id+"_head",
            width:24,
            cols:[                        
                {},
                {
                    view:"icon",
                    id:self.id+"_close",
                    tooltip:"Закрыть",
                    icon: "mdi mdi-close",
                    on:{
                        'onItemClick': function(id){
                            self.props.formMdoRecount(false);                           
                        }
                    }
                }
            ]
        }


        let conteiner = {
            view:"window",
            id:self.id + "_window",
            move:true,
            zIndex:100,
            width: 1100,
            height: 600,
            resize: true,
            head:head,
            position:"center",
            body: {
                rows:[
                    {
                        view: "template",
                        template: "Default template with some text inside"
                    },
                ]
            },
        };
       
        self.ui = window.webix.ui(conteiner);     
    }

    componentWillReceiveProps(nextProps) {
                
        if((nextProps.conteinerReady) && (!this.props.conteinerReady)){
            this.initUI()
        }
        if(nextProps.openMdoRecount){
            this.updateUI(nextProps)
            this.ui.show();
        }else{
            this.ui.hide();
        }
    }

    componentWillUnmount(){        
        this.ui.destructor();
        this.ui = null;
    }

    shouldComponentUpdate(){
        return false;
    }

    render() {
        return null
    }

}