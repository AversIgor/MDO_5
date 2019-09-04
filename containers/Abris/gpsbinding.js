import React, { Component, PropTypes, Fragment } from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'

import GpsMark from "../../components/Abris/plot/gps";

import {editGPS,setGpsPoint} from '../../actions/Abris/background';
import {getPoint} from '../../actions/Abris/common';

let style = {
    fill:"#2f89c6",
    fillOpacity:"1",
}

class Gpsbinding extends Component {

    constructor(props) {
		super(props);
		this.startX         = 0;
        this.startY         = 0;
		this.GPSPoint     = undefined;
		this.newGPSPoint     = undefined;		
    }

    mouseenter = (point) => {
        point.attr({
            fill:'#f00',
            fillOpacity:"1"
        })
	}
	
	setscale = (point,size) => {
		let trans = point.attr("transform")
		trans = trans.substring(0,point.attr("transform").indexOf(")")+1)
		point.attr("transform",trans + " scale("+size+", "+size+")")
	}

    events = (props) => {
        let self	= this;
		let point	= $("#point_gps")
		if(point){
			point.off()
			if(props.mode == 3){
				point.on('mouseenter', function(event) {
					self.mouseenter(point)
					self.setscale(point,3.3)
				});
				point.on('mouseleave', function(event) {
					point.attr(style)
					self.setscale(point,3)
				});
				point.on('mousedown', function(event) {
					if(event.which == 1){
						self.startX = event.pageX;
						self.startY = event.pageY;
						self.GPSPoint = {
							x: props.gps.px,
							y: props.gps.py,
						}
					}
					event.stopPropagation()
				});
			}  			
		}

		this.paint.off('.gps')
		if(props.mode == 3){
            //установка точки gps привязки
			this.paint.on('mousedown.gps', function(event) {
				if (event.buttons == 1) {
					self.newGPSPoint = getPoint(
						{x:self.paint.width()/2,y:self.paint.height()/2},
						{x:event.offsetX,		y:event.offsetY},
						props.scale,props.zoom,props.shift
					)
				}
			});

			//сдвиг точки gps привязки
			this.paint.on('mousemove.gps', function(event) {
				if (self.GPSPoint) {
					let shiftX = (event.pageX - self.startX) / props.zoom/ (10000/props.scale);
					let shiftY = (event.pageY - self.startY) / props.zoom/ (10000/props.scale);
					let point =  {
							x: self.GPSPoint.x + shiftX,
							y: self.GPSPoint.y + shiftY
						}
					props.editGPS(point)
				}
			});

			this.paint.on('mouseup.gps', function(event) {
				if (self.GPSPoint) {
					self.GPSPoint = undefined
				}
				if (self.newGPSPoint){				
					props.setGpsPoint(self.newGPSPoint,props.gps)
					self.newGPSPoint = undefined
				}	
			});

        } 

    }

	
	componentWillReceiveProps(nextProps) {
		this.events(nextProps)
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


    componentWillUnmount(){

    }

    render() {

        if(this.props.mode != 3)return null
        if(!this.target)return null

        this.position = {
            x:this.target.x+(this.props.shift.x*this.props.zoom),
            y:this.target.y+(this.props.shift.y*this.props.zoom),
		}

		this.point = {
			x:this.props.gps.px,
			y:this.props.gps.py,
			id:"point_gps"
		}

        return (<Fragment>
					<GpsMark
						key			= {"point_gps"}
						point		= {this.point}
						position    = {this.position}
						zoom		= {this.props.zoom}
						scale		= {this.props.scale}
						style		= {style}
					/>
				</Fragment>)
    }
}

function mapStateToProps (state) {
    return{
        mode: state.polygons.mode,
        zoom: state.background.zoom,
        scale: state.background.scale,
        shift: state.background.shift,
        gps: state.background.gps,

    }
}

function mapDispatchToProps(dispatch) {
    return {
		setGpsPoint: bindActionCreators(setGpsPoint, dispatch),
		editGPS: bindActionCreators(editGPS, dispatch),		
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Gpsbinding)