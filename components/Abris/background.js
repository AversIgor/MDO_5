import React, { Component, PropTypes } from "react";

import {shiftWithRotate} from '../../actions/Abris/common';

export default class Background extends Component {

    constructor(props) {
        super(props);
        this.new = true
    }

    setCSS = (props) => {
        //размеры картинки с зумом
        let widthImage  = props.initSize.width  * props.zoom * props.coefficientcalibrate;
        let heightImage = props.initSize.height * props.zoom * props.coefficientcalibrate;

        let shift = shiftWithRotate(props.shift.x,props.shift.y,props.rotate)

        let pointX  = (props.initSize.width/2   - shift.x)* props.zoom
        let pointY  = (props.initSize.height/2  - shift.y)* props.zoom

        let left   = props.target.x - pointX;
        let top    = props.target.y - pointY;

        this.ui.css({
            "width"             : widthImage + "px",
            "height"            : heightImage + "px",
            "top"               : top + "px",
            "left"              : left + "px",
            "transform"         : "rotate(" + props.rotate + "deg)",
            "opacity"           : props.opacity,
            "transform-origin"  : pointX  + "px " + pointY + "px " + 0 + "px"
        })

        if(this.new){
            this.ui.fadeIn(500);
            this.new = false;
        }
        
    }

    creatObject = (props) => {

        let self = this;
        this.parent = $("div#parentbackground");

        if(props.src == '') {
            if($("img").is("#background")){
                $("img#background").remove();
            }
            return
        }

        if(props.initSize.height == 0) {
            this.new = true;
            if($("img").is("#background")){
                $("img#background").remove();
            }
            this.ui = $("<img/>", {
                id:"background",
                css:{
                    "position"  : "relative",
                    "display"  : "none",
                    "z-index"  : "5",
                }
            });
            this.parent.append(this.ui)
            this.ui.on('load',function() {
                let initSize    = {
                    width:this.width,
                    height:this.height
                }
                props.handlerload(initSize)
            })
            this.ui.on('mousemove', function(e) {
                event.preventDefault();
            });
            this.ui.on('contextmenu', function(e) {
                event.preventDefault();
            });
            this.ui.attr("src",'data:image/png;base64,'+props.src);
        }else {
            this.ui = $('img#background')
            this.ui.off('load',"**");
            self.setCSS(props)
        }
    }

    componentDidMount(){
        this.creatObject(this.props)
    }

    componentWillReceiveProps(nextProps) {
        this.creatObject(nextProps)
    }

    shouldComponentUpdate(){
        return false;
    }

    render() {     
        return (
            <div
                ref="root"
                id = "parentbackground"
                style={
                {
                    zIndex: -1,
                    height: '100%',
                    width: '100%',
                    position: 'absolute',
                }}
            />
        )
    }

}