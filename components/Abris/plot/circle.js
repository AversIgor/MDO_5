import React, { Component, PropTypes, Fragment } from "react";

let style ={
    'WebkitUserSelect':"none"
}

export default class Circle extends Component {

    constructor(props) {
        super(props);
    }   

    render() {

        let point = this.props.point

        let x = this.props.position.x+(point.x*this.props.zoom*(10000/this.props.scale));
        let y = this.props.position.y+(point.y*this.props.zoom*(10000/this.props.scale));
        
        let fill        = this.props.style.fill || 'white'
        let r           = this.props.style.r || '3'
        let fillOpacity = this.props.style.fillOpacity || '1'

        return (<circle
                id = {point.id}
                strokeWidth = "1"
                stroke = "black"
                fill =  {fill}
                fillOpacity = {fillOpacity}
                cx = {x}
                cy = {y}
                r = {r}
                style={style}
            ></circle>
        )
    }
}

