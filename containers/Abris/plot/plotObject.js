import React, { Component, PropTypes, Fragment} from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import Name from "./name";
import Polyline from "./polyline";
import Circle from "./circle";
import VirtualCircle from "./virtualCircle";
import TextCircle from "./textcircle";

import ComponentNewPolyline from "../../../components/Abris/plot/newPolyline";
import ComponentSelectPolyline from "../../../components/Abris/plot/selectPolyline";
import {newPoint,newContour} from '../../../actions/Abris/objects';



class PlotObject extends Component {

    constructor(props) {
        super(props);
        this.state = {
            curentContour: props.curentContour,
            position:{x:0,y:0},
            positionName: {x:0,y:0},
            newPolylinePoints: "",
            selectPolylinePoints:"",
        };
        this.startX         = 0;
        this.startY         = 0;
        this.startShift     = false
    }

    events = () => {
        let self = this;

        this.ui.on('mousedown.plotObject', function(e) {
            if(e.which == 1){
                self.polygonMousedown(e,self.state.curentContour.length-1)
            }
        });
        this.ui.on('mousemove.plotObject', function(e) {
            self.polygonMousemove(e)
            self.update_new_polyline(e)
        });
        this.ui.on('mouseup.plotObject', function(e) {
            self.polygonMouseup(e)
        });
    }

    polygonMousedown = (event,index) => {
        if(!this.props.curentObject) return
        if(this.props.mode == 0) {//новая точка            
            //центр рабочей зоны
            let targetX = this.ui.width() / 2;
            let targetY = this.ui.height() / 2;
            //координаты клика относительно центра без учета зума и масштаба
            let pointX = (event.offsetX - targetX) / this.props.zoom / (10000 / this.props.scale)
            let pointY = (event.offsetY - targetY) / this.props.zoom / (10000 / this.props.scale)
            let point =  { x: pointX, y: pointY }
            //вычтем сдвиг подложки
            let x = point.x-(this.props.shift.x/(10000/this.props.scale))
            let y = point.y-(this.props.shift.y/(10000/this.props.scale))
            this.props.newPoint(this.props.curentObject,x,y,index)
        }else if(this.props.mode == 1){//Начало сдвига полигона
            this.startX = event.pageX;
	        this.startY = event.pageY;
            this.startShift = true
        }
    }

    polygonMousemove = (event) => {
        if(!this.props.curentObject) return
        if(this.props.mode == 1){
            if(event.which == 1){
                if (this.startShift) {
					let shiftX = (event.pageX - this.startX) / this.props.zoom;
					let shiftY = (event.pageY - this.startY) / this.props.zoom;
					if ((shiftX == 0) && (shiftY == 0)) {
						return
					}
                    let object_shift = {
						x: shiftX,
						y: shiftY,
                    }                    
                    this.setState({
                        curentContour:this.newContur(object_shift,this.props.zoom)
                    })
				}

            }            
        }
    }

    polygonMouseup = (event) => {
        if(!this.props.curentObject) return
        if (this.startShift) {
            this.props.newContour(this.props.curentObject,this.state.curentContour)
            this.startShift = false
        }
    }


    update_new_polyline = (event) => {

        let points = ''
        if ((this.props.mode == 0) &&  (event.which != 1) &&  (this.props.curentContour.length > 0)){
            let lastRow     = this.props.curentContour[this.props.curentContour.length-1]
            lastRow.index   = this.props.curentContour.length-1
            let x = this.state.position.x+(lastRow.x*this.props.zoom*(10000/this.props.scale))
            let y = this.state.position.y+(lastRow.y*this.props.zoom*(10000/this.props.scale))
            points = x+","+y+" "+ event.offsetX+","+ event.offsetY

            if(lastRow.index  != this.props.curentContour.length-1){
                let xc = this.state.position.x+(lastRow.xc*this.props.zoom*(10000/this.props.scale))
                let yc = this.state.position.y+(lastRow.yc*this.props.zoom*(10000/this.props.scale))
                points = points+" "+xc+","+yc;
            }

        }
        if(this.new_polyline){
            this.setState({newPolylinePoints: points})
        }
    }
    
    update_select_polyline = (index) => {
        let points = ''
        if ((index != -1) && (event.which != 1)){
            let pointCounter = this.props.curentContour[index];
            let x = this.state.position.x+(pointCounter.x*this.props.zoom*(10000/this.props.scale));
            let y = this.state.position.y+(pointCounter.y*this.props.zoom*(10000/this.props.scale));
            let xc = this.state.position.x+(pointCounter.xc*this.props.zoom*(10000/this.props.scale));
            let yc = this.state.position.y+(pointCounter.yc*this.props.zoom*(10000/this.props.scale));
            points = x+","+y+" "+xc+","+yc;
        }
        if(this.select_polyline){
            this.setState({selectPolylinePoints: points})
        }
    }

    update_contour = (contour) => {
        this.setState({curentContour: contour})
    }   
    
    update_positionName = (position) => {
        this.setState({positionName: position})
    } 
    

    setPosition = (shift,zoom) => {
        this.paint              = $("div#paint")
        let target         = {
            x: this.paint.width()/2,
            y: this.paint.height()/2
        }
        let position = {
            x:target.x+(shift.x*zoom),
            y:target.y+(shift.y*zoom)
        }
        
        return position

    }

    newContur = (object_shift,zoom) => {    

        let newContour = [];
        for (var i = 0; i < this.props.curentContour.length; i++) {
            let newrow = {...this.props.curentContour[i] };
            newrow.x = newrow.x+(object_shift.x*zoom)
            newrow.y = newrow.y+(object_shift.y*zoom)
            newrow.xc = newrow.xc+(object_shift.x*zoom)
            newrow.yc = newrow.yc+(object_shift.y*zoom)
            newContour.push(newrow)
        }                
        return newContour
    }

    componentDidMount(){
        this.ui                 = $("#SVG");
        this.new_polyline       = $("#new_polyline")
        this.select_polyline    = $("#select_polyline")
        this.events()
        if(this.props.curentObject) {
            this.setState({
                positionName: {
                    x:this.props.curentObject.xname,
                    y:this.props.curentObject.yname
                },
                position: this.setPosition(this.props.shift,this.props.zoom),
                curentContour: this.props.curentContour.slice(),
            })
        }
    }

    componentWillReceiveProps(nextProps) { 

        if(nextProps.curentObject) {
            this.setState({
                positionName: {
                    x:nextProps.curentObject.xname,
                    y:nextProps.curentObject.yname
                    },
                position: this.setPosition(nextProps.shift,nextProps.zoom),
                curentContour: nextProps.curentContour,
            })
        }else {
            this.setState({
                positionName: {x:0,y:0},
                position: this.setPosition(nextProps.shift,nextProps.zoom),
                curentContour: nextProps.curentContour,
            })
        }
    }

    componentDidUpdate(prevProps, prevState) {

    }


    render() {

        if(!this.props.curentObject) return null

          return (        
            <Fragment>

                    <ComponentSelectPolyline
                        points   ={this.state.selectPolylinePoints}
                    />
                    <ComponentNewPolyline
                        points   ={this.state.newPolylinePoints}
                    />
                    <Polyline
                        curentContour   = {this.state.curentContour}
                        curentObject    = {this.props.curentObject}
                        events          = {true}
                        position        = {this.state.position}
                    />
                    <Circle
                        curentContour           = {this.state.curentContour}
                        curentObject            = {this.props.curentObject}
                        position                = {this.state.position}
                        events                  = {true}
                        update_select_polyline  = {this.update_select_polyline}
                        update_contour          = {this.update_contour}                        
                    />
                    <VirtualCircle
                        curentContour           = {this.state.curentContour}
                        curentObject            = {this.props.curentObject}
                        position                = {this.state.position}
                        events                  = {true}
                        polygonMousedown        = {this.polygonMousedown}
                    />                    
                    <TextCircle
                        curentContour           = {this.state.curentContour}
                        curentObject            = {this.props.curentObject}
                        position                = {this.state.position}
                        events                  = {true}
                        update_contour          = {this.update_contour} 
                    />
                    <Name
                        curentObject    = {this.props.curentObject}
                        positionName    = {this.state.positionName}
                        events          = {true}
                        position        = {this.state.position}
                        update_positionName  = {this.update_positionName}                        
                    />
            </Fragment>
        )
    }
}

function mapStateToProps (state) {

    return {
        curentObject: state.polygons.curentObject,
        zoom: state.background.zoom,
        scale: state.background.scale,
        shift: state.background.shift,
		mode: state.polygons.mode,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        newPoint: bindActionCreators(newPoint, dispatch),
        newContour: bindActionCreators(newContour, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlotObject)