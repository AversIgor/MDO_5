import React, { Component, PropTypes, Fragment} from "react";


export default class Aim extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        let paint = $("div#paint");
        let target      = {
            x:paint.width()/2,
            y:paint.height()/2
        }
        let style ={
            'WebkitUserSelect':"none"
        }
        let classname ='aim'
        let printingBoundaries  =                       (target.x-300)+","+(target.y-300)+" "
        printingBoundaries      = printingBoundaries +  (target.x-300)+","+(target.y+300)+" "
        printingBoundaries      = printingBoundaries +  (target.x+300)+","+(target.y+300)+" "
        printingBoundaries      = printingBoundaries +  (target.x+300)+","+(target.y-300)+" "
        printingBoundaries      = printingBoundaries +  (target.x-300)+","+(target.y-300)+" "
        let rotate              = "rotate("+this.props.magneticdeclination+","+target.x+","+target.y+")"
        return (
            <Fragment>
                <g
                    fill = "none"
                    stroke = "black"
                    transform = {rotate}
                >
                    <line
                        x1 = {target.x-85}
                        y1 = {target.y}
                        x2 = {target.x+85}
                        y2 = {target.y}
                        strokeWidth = "1"
                        stroke = "black"
                        fill = "none"
                        strokeDasharray = "70 30"
                        style={style}
                        className={classname}
                    />
                    <line
                        x1 = {target.x}
                        y1 = {target.y-85}
                        x2 = {target.x}
                        y2 = {target.y+85}
                        strokeWidth = "1"
                        stroke = "black"
                        fill = "none"
                        strokeDasharray = "70 14 1 14"
                        style={style}
                        className={classname}
                    />
                    <line
                        x1 = {target.x}
                        y1 = {target.y-85}
                        x2 = {target.x-5}
                        y2 = {target.y-80}
                        strokeWidth = "1"
                        stroke = "black"
                        fill = "none"
                        style={style}
                        className={classname}
                    />
                    <line
                        x1 = {target.x}
                        y1 = {target.y-85}
                        x2 = {target.x+5}
                        y2 = {target.y-80}
                        strokeWidth = "1"
                        stroke = "black"
                        fill = "none"
                        style={style}
                        className={classname}
                    />
                    <line
                        x1 = {target.x}
                        y1 = {target.y+85}
                        x2 = {target.x-5}
                        y2 = {target.y+90}
                        strokeWidth = "1"
                        stroke = "black"
                        fill = "none"
                        style={style}
                        className={classname}
                    />
                    <line
                        x1 = {target.x}
                        y1 = {target.y+85}
                        x2 = {target.x+5}
                        y2 = {target.y+90}
                        strokeWidth = "1"
                        stroke = "black"
                        fill = "none"
                        style={style}
                        className={classname}
                    />
                    <text
                        x = {target.x-4}
                        y = {target.y-95}
                        fontSize = "12px"
                        fontStyle = "normal"
                        fontFamily = "sans-serif"
                        fontWeight = "bold"
                        fill = "black"
                        style={style}
                        className={classname}
                    >
                        С
                    </text>
                    <text
                        x = {target.x-6}
                        y = {target.y+105}
                        fontSize = "12px"
                        fontStyle = "normal"
                        fontFamily = "sans-serif"
                        fontWeight = "bold"
                        fill = "black"
                        style={style}
                        className={classname}
                    >
                        Ю
                    </text>
                </g>
                <polyline
                    id = "printingBoundaries"
                    strokeWidth = "0.5"
                    stroke = "black"
                    fill = "none"
                    strokeOpacity = "1"
                    strokeDasharray = "1"
                    points = {printingBoundaries}
                    style={style}
                    className={classname}
                ></polyline>
            </Fragment>
        )
    }
}
