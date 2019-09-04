import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';

import {BD} from "../dao";
import Confirm from './confirm';


export default class Setup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            confirmIsOpen: false
        };
    }

    restoreDB () {
        BD.restoreDB();
    }

    openConfirm () {
        this.setState({confirmIsOpen: true});
    }


    componentWillMount(){

        let _this = this;

        var elements = [
            { rows:[
                { view:"toggle", name:"RestoreDB", label:"Загрузить базу данных", icon:"", click:function(){
                        _this.openConfirm();
                    }
                },
                { view:"toggle", name:"dumpBD", icon:"", label:"Выгрузить базу данных", click:function(){
                        BD.dumpData();
                    }
                }
            ]},
        ];

        var form = {
            view:"form",
            container:"content",
            scroll:false,
            elements:elements,
        }


        this.ui = window.webix.ui(form);

    }

    componentWillUnmount(){
        this.ui.destructor();
        this.ui = null;
    }

    shouldComponentUpdate(){
        return true;
    }

    componentWillUpdate(nextProps, nextState){
        return true;
    }

    render() {

        let FormConfirm = () => {
            if(this.state.confirmIsOpen == false){
                return null
            }else {
                return <Confirm restoreDB={this.restoreDB} />
            }
        };
        
        return (
            <div ref="root"><FormConfirm/></div>
        )
    }

}