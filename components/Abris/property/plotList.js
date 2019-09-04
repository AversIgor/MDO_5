import React, { Component, PropTypes } from "react";

import * as head from "./head";



export default class Plot extends Component {

    constructor(props) {
        super(props);

    }


    updateUI = (props) => {
        if((props.show) && (!props.curentObject)){
            this.ui.show();
        }else{
            this.ui.hide();
        }
    }



    update = (props) => {
        let tree   = $$('tree_plot');
        tree.clearAll();
        let data = [];
        for(let key in props.objectsTree) {
            let oblect = props.objectsTree[key];
            let childrens = []
            let isAreanonexploitationarea = false
            for(let keych in oblect.childrens) {
                let children = oblect.childrens[keych];

                let cellCss = {
                    area:{
                        "background-color":"#FFFFFF;"
                    }
                }
                if(children.nonexploitationarea){
                    cellCss = {
                        area:{
                            "background-color":"#FFAAAA;"
                        }
                    }
                    isAreanonexploitationarea = true
                }
                let row = {
                    id:children.id,
                    name:children.name,
                    area:children.area,
                    delete:"<i class='material-icons' style='font-size: 18;padding-top: 6;margin-left: -5;}'>delete</i>",
                    $cellCss:cellCss
                }
                childrens.push(row)
            }
            let area = oblect.area
            if(isAreanonexploitationarea){
                area = area+" ("+oblect.areaexploitation+")"
            }
            let row = {
                id:oblect.id,
                name:oblect.name,
                area:area,
                delete:"<i class='material-icons' style='font-size: 18;padding-top: 6;margin-left: -5;}'>delete</i>",
                data:childrens,
            }
            data.push(row)
        }

        tree.define("data",data);
        tree.refresh();
    }


    componentDidMount(){

        let self = this

        let tree = {
            view:"treetable",
            id:"tree_plot",
            columns:[
                { id:"id",	    header:"id", hidden:true},
                { id:"name",	header:"Название",	width:200,
                    template:"{common.treetable()} #name#" },
                { id:"area",	 header:"Площадь, га", width:120},
                { id:"delete", header:"", width:30},
            ],
            autoheight:true,
            autowidth:true,
            select:"row",
            data: [],
            on:{
                "onItemDblClick":function(id, e, node){
                    self.props.selectItem(id.row)
                },
                "onItemClick":function(id, e, node){
                    if(id.column == 'delete'){
                        window.webix.confirm({
                            text:"Удалить объект?", ok:"Да", cancel:"Нет",
                            callback:(res) => {
                                if(res){
                                    self.props.deleteObject(id.row)
                                }
                            }
                        });                        
                    }
                },
            }
        };

        var conteiner = {
            view:"window",
            id:"plot_list",
            zIndex:100,
            width: 350,
            move:true,
            top:105,
            left:document.documentElement.clientWidth-355,
            head:head.ui("plot_list"),
            headHeight:25,
            body: tree,
            on:{
                'onHide': function(id){
                    self.props.handlerCloseListForm()
                }
            }
        };
        this.ui = window.webix.ui(conteiner);
    }


    componentWillReceiveProps(nextProps) {
        this.updateUI(nextProps)
        this.update(nextProps)
    }


    componentWillUnmount(){
        this.ui.destructor();
        this.ui = null;
    }

    render() {
        return null
    }
}