import React, { Component, PropTypes, Fragment } from "react";

let style ={
    'WebkitUserSelect':"none"
}

export default class TextCircle extends Component {

    constructor(props) {
        super(props);
    }   

    render() {        
        let point = this.props.point        
        if(point.benchmark == '*') return null

        let x = this.props.position.x+((point.x+point.xtext)*this.props.zoom*(10000/this.props.scale));
        let y = this.props.position.y+((point.y+point.ytext)*this.props.zoom*(10000/this.props.scale));


        let display = 'block'
        if(!this.props.style.visible){
            display = 'none'
        }

        return (<text
                id = {point.id+'_text'}
                fontSize = {this.props.style.fontSize}
                fontStyle = "normal"
                fontFamily = "sans-serif"
                fontWeight = "bold"
                fill = {this.props.style.fontfill}
                display = {display}
                x = {x}
                y = {y}
                style={style}
            >
                {point.benchmark}
            </text>
        )
    }
}

