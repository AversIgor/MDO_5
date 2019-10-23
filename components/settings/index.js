import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';
import * as common from '../reference/common';

export default class ComponentSettings extends Component {

    constructor(props) {
        super(props);
        this.id     = 'Settings';
        this.ui     = []
    }

    componentDidMount(){
        let self = this;
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
                                            'onItemClick': function(id){
                                            }
                                        }
                                    },
                                    {},
                                ]
                            },

                            {
                                view:"property",
                                id:this.id+'_decor',
                                complexData:true,
                                autoheight:true,
                                autowidth:true,
                                nameWidth:150,
                                css:'box_shadow',
                                borderless:true,
                                elements:[
                                    { label:"Основные", type:"label"},
									{ label:"Формат данных", type:"select", id:"abris.main.typeangle",options:this.props.enumerations.typesAngle},
                                    { label:"Округления", type:"label"},
                                    { label:"Площади", type:"select", id:"abris.rounding.square",options:this.props.enumerations.roundingSquar},
                                    { label:"Углов", type:"select", id:"abris.rounding.angle", options:this.props.enumerations.roundingAngle},
                                    { label:"Промеров", type:"select", id:"abris.rounding.lengths", options:this.props.enumerations.roundingLength},
                                    { label:"Допустимые невязки", type:"label"},
                                    { label:"Угловая, минут", type:"text", id:"abris.residual.angle",},
                                    { label:"Линейная, м./300 м.", type:"text", id:"abris.residual.linear",},
                                ],
                                on:{
                                    "onAfterEditStop":function(state, editor, ignoreUpdate){
                                        self.props.handlerEdit(this.getValues())
                                    },
                                    "onCheck":function(id,state){
                                        self.props.handlerEdit(this.getValues())
                                    },
                                }
                            }
                        ]
                    },
                    {}
                    ]
                },
            ]
        }
        this.ui.push(window.webix.ui(layout))
        $$(this.id+'_decor').setValues(this.props.settings);
    }


    componentWillReceiveProps(nextProps) {
        $$(this.id+'_decor').setValues(nextProps.settings);
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