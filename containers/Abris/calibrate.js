import React, { Component, PropTypes, Fragment } from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import * as Guid from "guid";

import ComponentCircle from "../../components/Abris/plot/circle";
import ComponentNewPolyline from "../../components/Abris/plot/newPolyline";

import {editCalibrate} from '../../actions/Abris/background';
import {getPoint,distanceBetweenPoints} from '../../actions/Abris/common';

let style = {
    fill:"#27ae60",
    r:"4",
    fillOpacity:"1",
}

class Calibrate extends Component {

    constructor(props) {
        super(props);
        this.startX         = 0;
        this.startY         = 0;
        this.newcalibratePoint  = undefined;
        this.calibratePoint     = undefined;
        this.state = {
            points: [],
            distance:0,
        };
        
    }

    mouseenter = (point) => {
        point.attr({
            r:'6',
            fill:'#27ae60',
            fillOpacity:"1"
        })
    }

    creatMenuPoint = (index,pointID) => {
        let self = this
        let data = []
        data.push({value:"Удалить"})
        let contextmenu = window.webix.ui({
            view:"contextmenu",
            master:pointID,
            data:data,
            on:{
                onItemClick:function(id){
                    if(this.getItem(id).value == "Удалить"){
                        let newPoints = self.state.points.slice()
                        newPoints.splice(index, 1)
                        let distance = distanceBetweenPoints(newPoints)
                        self.setState({
                            points:newPoints,
                            distance:distance
                        })
                        self.props.editCalibrate(newPoints,distance)
                    }
                },
                onHide:function(){
                    let menu = this
                    setTimeout(function() {menu.destructor();}, 100);
                }
            }
        })
    }

    events = (props) => {
        let self = this;
        for (let i = 0; i < this.state.points.length; i++) {
            let row     = this.state.points[i];
            let point   = $("#"+row.id)
            if(point){
                point.off()
                if(props.mode != 2){                    
                    continue
                }                
                point.on('mouseenter', function(event) {
                    self.mouseenter(point)
                });
                point.on('mouseleave', function(event) {
                    point.attr(style)
                });
                point.on('mousedown', function(event) {
                    if(event.which == 1){
                        self.startX = event.pageX;
                        self.startY = event.pageY;
                        self.calibratePoint = {
                            index: i,
                            x: row.x,
                            y: row.y,
                        }
                    }else{
                        self.creatMenuPoint(i,row.id)
                    }
                    event.stopPropagation()
                });
            }
        }    

        this.paint.off('.calibrate') 
        if(props.mode != 2){
            return
        }        
                     
        //установка точки калибровки
        this.paint.on('mousedown.calibrate', function(event) {
            if (event.buttons == 1) {
                self.newcalibratePoint = getPoint(
                    {x:self.paint.width()/2,y:self.paint.height()/2},
                    {x:event.offsetX,		y:event.offsetY},
                    props.scale,props.zoom,props.shift
                )
            }

        });
        //сдвиг точки калибровки
        this.paint.on('mousemove.calibrate', function(event) {
            if (self.calibratePoint) {
                let shiftX = (event.pageX - self.startX) / props.zoom / (10000 / props.scale);
                let shiftY = (event.pageY - self.startY) / props.zoom / (10000 / props.scale);
                let point = {
                    index: self.calibratePoint.index,
                    x: self.calibratePoint.x + shiftX,
                    y: self.calibratePoint.y + shiftY
                }

                let newPoints = self.state.points.slice()
                newPoints[point.index].x = point.x
                newPoints[point.index].y = point.y                
                self.setState({
                    points:newPoints,
                })                
            }
        });
        this.paint.on('mouseup.calibrate', function(event) {
            if (self.calibratePoint) {
                let distance = distanceBetweenPoints(self.state.points)
                self.props.editCalibrate(self.state.points,distance)
                self.calibratePoint = undefined
            }
            if (self.newcalibratePoint){
                let newPoints = self.state.points.slice()
                newPoints.push({
                    x:self.newcalibratePoint.x,
                    y:self.newcalibratePoint.y,
                    id:Guid.create().value
                })
                let distance = distanceBetweenPoints(newPoints)
                self.setState({
                    points:newPoints,
                    distance:distance
                })
                self.props.editCalibrate(newPoints,distance)
                self.newcalibratePoint = undefined
            }	
        });
    }



    componentDidUpdate() {
		this.events(this.props)
    }

    componentDidMount(){
        this.ui                 = $("#SVG");
        this.paint              = $("div#paint")
        this.target             = {
            x: this.paint.width()/2,
            y: this.paint.height()/2
        }
        this.events(this.props)
    }


    render() {
        
        if(this.props.mode != 2)return null
        if(!this.target)return null
        if(this.state.points.length == 0)return null

        this.position = {
            x:this.target.x+(this.props.shift.x*this.props.zoom),
            y:this.target.y+(this.props.shift.y*this.props.zoom),
        }

        let points = ''
        for (var i = 0; i < this.state.points.length; i++) {
            let point = this.state.points[i];
            let x = this.position.x+(point.x*this.props.zoom*(10000/this.props.scale))
            let y = this.position.y+(point.y*this.props.zoom*(10000/this.props.scale))
            points = points+x+","+y+" "
        }

        return (<Fragment>                
                <ComponentNewPolyline
                    id          = "line_calibrate"
                    points      = {points}
                />
                {
                    this.state.points.map((point,index)=>{
                        return (
                            <ComponentCircle
                                key = {"point_calibrate"+index}
                                point = {point}
                                position    = {this.position}
                                zoom = {this.props.zoom}
                                scale           = {this.props.scale}
                                style = {style}
                            />
                        )
                    })
                }
            </Fragment>
        )
    }
}

function mapStateToProps (state) {
    return{
        mode: state.polygons.mode,
        zoom: state.background.zoom,
        scale: state.background.scale,
        shift: state.background.shift,
    }
}

function mapDispatchToProps(dispatch) {
    return {
		editCalibrate: bindActionCreators(editCalibrate, dispatch),      
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Calibrate)