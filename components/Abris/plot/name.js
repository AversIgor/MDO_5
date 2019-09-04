import React, { Component, PropTypes, Fragment } from "react";

export default class Name extends Component {

    constructor(props) {
        super(props);
    }
    
    render() {

        let display = 'block'
        if(!this.props.curentObject.style.name.visible){
            display = 'none'
        }
        
        return (<text
                id = {this.props.curentObject.id+'_name'}
                fontSize = {this.props.curentObject.style.name.fontSize}
                fontStyle = "normal"
                fontFamily = "sans-serif"
                fontWeight = "bold"
                fill = {this.props.curentObject.style.name.fontfill}
                x = {this.props.position.x}
                y = {this.props.position.y}
                display = {display}
            >
                {this.props.curentObject.name}
            </text>
        )
        
    }
}

