import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';
import * as common from '../reference/common';

export default class ComponentAbrisSettings extends Component {

    constructor(props) {
        super(props);
        this.id     = 'abrissettings';
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
									{ label:"Формат данных", type:"select", id:"main.typeangle",options:this.props.getTypeangle()},
                                    { label:"Округления", type:"label"},
                                    { label:"Площади", type:"select", id:"rounding.square",options:this.props.getRoundingSquare()},
                                    { label:"Углов", type:"select", id:"rounding.angle", options:this.props.getRoundingAngle()},
                                    { label:"Промеров", type:"select", id:"rounding.lengths", options:this.props.getRoundingLengths()},
                                    { label:"Допустимые невязки", type:"label"},
                                    { label:"Угловая, минут", type:"text", id:"residual.angle",},
                                    { label:"Линейная, м./300 м.", type:"text", id:"residual.linear",},
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
    }


    componentWillReceiveProps(nextProps) {
        if(nextProps.data.length>0){
            $$(this.id+'_decor').setValues(JSON.parse(nextProps.data[0].settings));
        }
        common.formResize(this)
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