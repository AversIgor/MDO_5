import React, { Component, PropTypes } from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'

import ComponentPaint from "../../components/Abris/paint";
import {setZoom,setShift,setRotate,setTarget} from '../../actions/Abris/background';

import {degToRad} from '../../actions/Abris/common';


class Paint extends Component {

    constructor(props) {
        super(props);
        this.startX         = 0;
        this.startY         = 0;
        this.startRotate    = {};
        this.startShift     = {};
        this.eventmousedown = false;        
    }

    handlerMusewheel = (event) => {
        if(this.props.mode != 0) {
            let delta = event.originalEvent.deltaY || event.originalEvent.detail || event.originalEvent.wheelDelta;
            let multiplier = 1;
            if (delta < 0)
                multiplier = 1.05;
            else
                multiplier = 0.95;
            let zoom = this.props.zoom * multiplier;
            this.props.setZoom(zoom)
        }
    }

    handlerMousedown = (event,ui) => {
        if(this.props.curentObject) return 
        
        this.eventmousedown = true;
        //начало сдвига/поворота картинки       
        if(this.props.mode == 1) {            
            this.startX = event.pageX;
	        this.startY = event.pageY;
            this.startRotate = this.props.rotate;
            this.startShift = this.props.shift;
        }
    }

    handlerMousemove = (event,ui) => {
        if (!this.eventmousedown) return
        if(this.props.curentObject) return
        //сдвиг или поворот подложки
        if(this.props.mode == 1) {
            if (event.buttons === 1) {
                let shiftX = (event.pageX - this.startX) / this.props.zoom
                let shiftY = (event.pageY - this.startY) / this.props.zoom
                if ((shiftX == 0) && (shiftY == 0)) {
                    return
                }                
                let shift = {
                    x: this.startShift.x + shiftX,
                    y: this.startShift.y + shiftY,
                }
                this.props.setShift(shift)
            }
            if (event.buttons === 2) { 
                let targetX = ui.offset().left + (ui.width() / 2);
                let targetY = ui.offset().top + (ui.height() / 2);

                let xD0 = this.startX - targetX;
                let yD0 = this.startY - targetY;
                let xD1 = event.pageX - targetX;
                let yD1 = event.pageY - targetY;
                let atrCos = (xD0 * xD1 + yD0 * yD1) / (Math.sqrt(xD0 * xD0 + yD0 * yD0) * Math.sqrt(xD1 * xD1 + yD1 * yD1));
                if (atrCos < -1) {
                    atrCos = -1;
                } else if (atrCos > 1) {
                    atrCos = 1;
                }
                let radAngle = Math.acos(atrCos);
                if ((xD0 * yD1 - yD0 * xD1) < 0) {
                    radAngle = - radAngle;
                }
                let degreeAngle = radAngle * (180 / Math.PI);
                if (degreeAngle == 0) return 

                let rotate = this.startRotate + degreeAngle;
                if (rotate < -360 || rotate > 360) {
                    rotate = rotate % 360
                };
                this.props.setRotate(rotate)
            }
		}    
		
    }

    keydownShift = (direction) => {
        if (direction) {
            let shiftX = 0
            let shiftY = 0
            if (direction == 'left') {
                shiftX = -1 / this.props.zoom
            }
            if (direction == 'right') {
                shiftX = 1 / this.props.zoom
            }
            if (direction == 'top') {
                shiftY = -1 / this.props.zoom
            }
            if (direction == 'bottom') {
                shiftY = 1 / this.props.zoom
            }
            let shift = {
                x: this.props.shift.x + shiftX,
                y: this.props.shift.y + shiftY,
            }
            return shift
        }

    }

    handlerKeydown = (e) => {
        if(this.props.curentObject) return
        if(this.props.mode == 1) {
            if (e.which === 37) {
                let shift = this.keydownShift('left')
                this.props.setShift(shift)
            }
            if (e.which === 39) {
                let shift = this.keydownShift('right')
                this.props.setShift(shift)
            }
            if (e.which === 38) {
                let shift = this.keydownShift('top')
                this.props.setShift(shift)
            }
            if (e.which === 40) {
                let shift = this.keydownShift('bottom')
                this.props.setShift(shift)
            }
        }
    }

    render() {
        return (
            <ComponentPaint
                mousewheel={this.handlerMusewheel}
                mousedown={this.handlerMousedown}
                mousemove={this.handlerMousemove}
                keydown={this.handlerKeydown}
                setTarget={this.props.setTarget}
                handlerComplite = {this.props.handlerComplite}
            >
                {this.props.children}
            </ComponentPaint>
        )
    }
}

function mapStateToProps (state) {
    return{
        zoom: state.background.zoom,
        shift: state.background.shift,
        rotate: state.background.rotate,
        mode: state.polygons.mode,
        curentObject: state.polygons.curentObject,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setZoom: bindActionCreators(setZoom, dispatch),
        setShift: bindActionCreators(setShift, dispatch),
        setRotate: bindActionCreators(setRotate, dispatch),
        setTarget: bindActionCreators(setTarget, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Paint)