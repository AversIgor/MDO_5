import React, { Component, PropTypes} from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'

import {changeMode,deleteObject,creatObject} from '../../../actions/Abris/objects';
import ComponentPolyline from "../../../components/Abris/plot/polyline";

class Polyline extends Component {

    constructor(props) {
        super(props);
    }

    creatMenuObject = () => {

        let self = this
        let data = []
        if (this.props.mode == 1){
            data.push({value:"Редактировать"})
            if(self.props.curentObject.parent == undefined){
                data.push({value:"Создать вложенный объект"})
            }
            data.push({ $template:"Separator" },)
            data.push({value:"Удалить"})
        }else if(this.props.mode == 0){
            data.push({value:"Завершить редактирование"})
        }
        let contextmenu = window.webix.ui({
            view:"contextmenu",
            master:this.props.curentObject.id,
            data:data,
            width:250,
            on:{
                onItemClick:function(id){
                    let menu = this
                    if(this.getItem(id).value == "Редактировать"){
                        self.props.changeMode(0,self.props.curentObject)
                    }
                    if(this.getItem(id).value == "Завершить редактирование"){
                        self.props.changeMode(1,self.props.curentObject)
                    }
                    if(this.getItem(id).value == "Удалить"){

                        window.webix.confirm({
                            text:"Удалить объект?", ok:"Да", cancel:"Нет",
                            callback:(res) => {
                                if(res){
                                    self.props.deleteObject(self.props.curentObject)
                                    self.props.changeMode(1,undefined)
                                }
                            }
                        });
                    }
                    if(this.getItem(id).value == "Создать вложенный объект"){
                        self.props.creatObject(self.props.curentObject.id)
                    }
                    menu.destructor()
                },
                onHide:function(){
                    let menu = this
                    setTimeout(function() {menu.destructor();}, 100);
                }
            }
        })
    }

    events = () => {        
        let self = this;
        if(this.polygon){
            this.polygon.off()
            this.polygon.on('mousedown', function(event) {
                if(event.which != 1){
                    self.creatMenuObject()
                }
            });
            this.polygon.on('dblclick', function(event) {
                self.props.changeMode(1,self.props.curentObject)
            });
        }

        if(this.polyline){
            this.polyline.on('mousedown', function(event) {
                if(event.which != 1){
                    if(self.props.mode != 2){
                        self.creatMenuObject()
                    }
                }
            });
            this.polyline.on('dblclick', function(event) {
                self.props.changeMode(1,self.props.curentObject)
            });
       }
    }

    componentDidMount(){
        this.polygon            = $("#"+this.props.curentObject.id)
        this.polyline           = $("#"+this.props.curentObject.id+"_")
        this.events()
    }

    shouldComponentUpdate(nextProps, nextState) {

        let update = false
        for(let key in nextProps){
            let newValue = nextProps[key];
            let oldValue = this.props[key];
            if(newValue != oldValue){
                update = true
                break
            }
        }
        return update
    }
   
    render() {
        return (<ComponentPolyline
            curentContour   = {this.props.curentContour}
            id              = {this.props.curentObject.id}
            position        = {this.props.position}
            zoom            = {this.props.zoom}
            scale           = {this.props.scale}
            id              = {this.props.curentObject.id}
            style           = {this.props.curentObject.style.poliline}
        />)
        
    }
}

function mapStateToProps (state) {
    return {
        zoom: state.background.zoom,
        scale: state.background.scale,
        mode: state.polygons.mode,
        shift: state.background.shift,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        changeMode: bindActionCreators(changeMode, dispatch),
        deleteObject: bindActionCreators(deleteObject, dispatch),
        creatObject: bindActionCreators(creatObject, dispatch),        
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Polyline)