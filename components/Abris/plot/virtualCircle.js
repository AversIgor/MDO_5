import React, { Component, PropTypes, Fragment } from "react";

let style ={
    'WebkitUserSelect':"none"
}

export default class VirtualCircle extends Component {

    constructor(props) {
        super(props);
    }   

    render() {


        let point   = this.props.point
        if((point.x == point.xc) && (point.y == point.yc)) return null

        let middleX = 0
        let middleY = 0
        if(this.props.index == this.props.curentContour.length - 1) {            
            middleX = point.x+((point.xc-point.x)/2)
            middleY = point.y+((point.yc-point.y)/2)
        }else {
            let nextPoint = this.props.curentContour[this.props.index+1]
            middleX = point.x+((nextPoint.x-point.x)/2)
            middleY = point.y+((nextPoint.y-point.y)/2)
        }
        let x = this.props.position.x+(middleX*this.props.zoom*(10000/this.props.scale));
        let y = this.props.position.y+(middleY*this.props.zoom*(10000/this.props.scale));

        return (<circle
            id = {this.props.index+"_virtual"}
            strokeWidth = "0.5"
            stroke = "black"
            strokeDasharray="1"
            fill = "white"
            fillOpacity = "0.5"
            cx = {x}
            cy = {y}
            r = "4"
            style={style}
        ></circle>)
    }
}

