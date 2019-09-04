import React, { Component, PropTypes, Fragment} from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import ComponentCircle from "../../../components/Abris/plot/circle";
import {contourDelete,contourUnite,newContour,changeMode} from '../../../actions/Abris/objects';

class Circle extends Component {

    constructor(props) {
        super(props);
        this.eventmousedown = true;
        this.startX         = 0;
        this.startY         = 0;
        this.startPoint     = undefined;
    }

    pointMousedown = (event,row,index) => {
        if(this.props.mode != 0) return
        this.startX = event.pageX;
        this.startY = event.pageY;
        this.startPoint = {
			index: index,
			x: row.x,
			y: row.y,
        }
        this.eventmousedown = true;
    }

    pointDblclick = (event,row,index) => {
        if(this.props.mode != 0) return
        this.props.contourUnite(this.props.curentObject,index)
        this.props.changeMode(1,this.props.curentObject)
    }

    pointMouseup = (event) => {        
        if (!this.startPoint) return
        window.getSelection().removeAllRanges()
        this.props.newContour(this.props.curentObject,this.props.curentContour,this.startPoint.index)
        this.startPoint = undefined
    }

    mouseenter = (point) => {
        if(this.props.mode != 0) return
        point.css({
            "cursor": "alias",
        })
        point.attr({
            r:'6',
            fill:'#27ae60'
        })
    }


    creatMenuPoint = (index,pointID) => {

        let self = this
        let data = []
        data.push({value:"Замкнуть"})
        data.push({value:"Удалить"})
        let contextmenu = window.webix.ui({
            view:"contextmenu",
            master:pointID,
            data:data,
            on:{
                onItemClick:function(id){
                    if(this.getItem(id).value == "Удалить"){
                        self.props.contourDelete(self.props.curentObject,index,true)
                    }
                    if(this.getItem(id).value == "Замкнуть"){
                        self.props.contourUnite(self.props.curentObject,index)
                        self.props.changeMode(1,self.props.curentObject)
                    }
                },
                onHide:function(){
                    let menu = this
                    setTimeout(function() {menu.destructor();}, 100);
                }
            }
        })
    }

    events = (off = false) => {

        let self = this;
        for (let i = 0; i < self.props.curentContour.length; i++) {
            let row     = self.props.curentContour[i];
            let pointID = row.id;
            let point = $("#"+pointID)
            let index = i
            if(point){
                point.off()
                if(off) continue
                point.on('mouseenter', function(event) {
                    self.mouseenter(point)
                    self.props.update_select_polyline(index)
                });
                point.on('mouseleave', function(event) {
                    point.attr(self.props.curentObject.style.points)
                    self.props.update_select_polyline(-1)
                });
                point.on('mousedown', function(event) {
                    if(event.which == 1){
                        self.pointMousedown(event,row,index)
                    }else{
                        self.creatMenuPoint(index,pointID)
                    }
                    event.stopPropagation()
                });
                point.on('dblclick', function(event) {
                    if(event.which == 1){
                        self.pointDblclick(event,row,index)
                    }
                    event.stopPropagation()
                });
                point.on('mouseup', function(event) {
                    self.pointMouseup(event)
                    event.stopPropagation()
                });
            }          
        }

        this.ui.off('.circle')
        if(off) return
        this.ui.on('mousemove.circle', function(e) {
            if(self.props.mode != 0) return
            if (!self.eventmousedown) return
            if (!self.startPoint) return
            let shiftX = (event.pageX - self.startX) / self.props.zoom / (10000 / self.props.scale);
            let shiftY = (event.pageY - self.startY) / self.props.zoom / (10000 / self.props.scale);

            let newContour = self.props.curentContour.slice();
            let row = newContour[self.startPoint.index]
            if (row) {
                if ((row.x == row.xc) && (row.y == row.yc)) {
                    row.xc = self.startPoint.x + shiftX
                    row.yc = self.startPoint.y + shiftY
                }
                row.x = self.startPoint.x + shiftX
                row.y = self.startPoint.y + shiftY
            }
            self.props.update_contour(newContour)
            this.eventmousedown = false;
        });
    }


    componentDidUpdate(prevProps, prevState) {
        this.events(!this.props.events)
    }

    componentDidMount(){
        this.ui = $("#SVG");
        this.events(!this.props.events)
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

        return (<Fragment>
            {
                this.props.curentContour.map(point=>{
                    if((this.props.mode != 0) && (point.benchmark == '*')) return null
                    if((point.x == 0) && (point.y == 0) && (point.azimut == 0) && (point.distance ==0)) return null
                    return (
                        <ComponentCircle
                            key = {point.id}
                            point = {point}
                            position    = {this.props.position}
                            zoom = {this.props.zoom}
                            scale           = {this.props.scale}
                            style = {this.props.curentObject.style.points}
                        />
                    )
                })
            }
        </Fragment>)
        
    }
}

function mapStateToProps (state) {
    return {
        zoom: state.background.zoom,
        scale: state.background.scale,
		mode: state.polygons.mode,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        contourDelete: bindActionCreators(contourDelete, dispatch),
        contourUnite: bindActionCreators(contourUnite, dispatch),
        newContour: bindActionCreators(newContour, dispatch),
        changeMode: bindActionCreators(changeMode, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Circle)