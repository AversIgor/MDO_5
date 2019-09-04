import React, { Component, PropTypes, Fragment } from "react";

let style ={
    'WebkitUserSelect':"none"
}

export default class Polyline extends Component {

    constructor(props) {
        super(props);
    }   

    render() {
       
        let points_polygon  = ''
        let points_polyline = ''
        let start_polygon = undefined
        for (var i = 0; i < this.props.curentContour.length; i++) {
            let point = this.props.curentContour[i];
            if((point.x != 0) || (point.y != 0) || (point.azimut != 0) || (point.distance != 0)) {
                let x = this.props.position.x+(point.x*this.props.zoom*(10000/this.props.scale));
                let y = this.props.position.y+(point.y*this.props.zoom*(10000/this.props.scale));
                if(point.start_polygon == 1) {
                    points_polyline = points_polyline+x+","+y+" "; //последний промер
                    start_polygon = point
                }
                if(start_polygon) {
                    points_polygon = points_polygon+x+","+y+" "
                }else {
                    points_polyline = points_polyline+x+","+y+" "
                }
            }
            //от последней точки отрисуем последний промер
            if((i == this.props.curentContour.length-1) && (point.distance !=0)){
                let xc = this.props.position.x+(point.xc*this.props.zoom*(10000/this.props.scale));
                let yc = this.props.position.y+(point.yc*this.props.zoom*(10000/this.props.scale));
                if(start_polygon) {
                    points_polygon = points_polygon+xc+","+yc
                }else {
                    points_polyline = points_polyline+xc+","+yc
                }
            }
        }


        return (<Fragment>
            <polyline
                id = {this.props.id}
                strokeWidth = {this.props.style.strokeWidth}
                stroke = {this.props.style.stroke}
                fill = {this.props.style.fill}
                fillOpacity = {this.props.style.fillOpacity}
                strokeDasharray = {this.props.style.strokeDasharray}
                points = {points_polygon}
                style={style}
            ></polyline>
            <polyline
                id = {this.props.id+"_"}
                strokeWidth = {this.props.style.strokeWidth}
                stroke = {this.props.style.stroke}
                fill = "none"
                strokeOpacity = {this.props.style.strokeOpacity}
                strokeDasharray = {this.props.style.strokeDasharray}
                points = {points_polyline}
                style={style}
            ></polyline>
        </Fragment>)
        
    }
}

