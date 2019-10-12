import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';
import * as common from '../reference/common';

export default class ComponentContactinformation extends Component {

    constructor(props) {
        super(props);
        this.id     = 'contactinformation';
        this.ui     = []
    }

    componentDidMount(){
       
        let self = this;

        var elements = [
            { view:"text", label:"Адрес", name:"adress"},
            { view:"text",  label:"Телефон", name:"fon"},
            { view:"text",  label:"E-mail", name:"email"},
            { view:"text",  label:"Веб-сайт", name:"site"},
        ];

        let form =  {
            view:"form",
            id:this.id+'_form',
            width:300, 
            scroll:false, 
            elements:elements
        };

       let layout = {
            id:this.id+'_layout',
            container:ReactDOM.findDOMNode(this.refs.root),
            css:'content',
            rows:[
                {cols:[
                    {
                        padding:10,
                        borderless:true,
                        type: "clean",
                        width:500,
                        rows:[
                            { view:'toolbar',
                                elements:[
                                    {
                                        view:"button",
                                        value:"Сохранить",
                                        width:100,
                                        align:"center",
                                        on:{
                                            'onItemClick': function(){
                                                let values = $$(self.id+'_form').getValues();
                                                self.props.handlerEdit(values)                                                
                                            }
                                        }
                                    },
                                    {},
                                ]
                            },
                            form,
                        ]
                    },
                    {}
                    ]
                },
            ]
        }
        this.ui.push(window.webix.ui(layout))
        $$(this.id+'_layout').adjust()
    }


    componentWillReceiveProps(nextProps) {
        $$(this.id+'_form').setValues(nextProps.data);       
    }

    componentWillUnmount(){
        common.uiDestructor(this)
    }

    shouldComponentUpdate(){
        return false;
    }

    render() {
        return (
            <div  ref="root" style={{"height":"100%","width":"100%",}}></div>)
    }

}