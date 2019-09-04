import React, { Component, PropTypes, Fragment } from "react";

let style ={
    'WebkitUserSelect':"none"
}

export default class SelectPolyline extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.points  != this.props.points){
            return true
        }else {
            return false
        }
    }
    
    render() {
        return (<polyline
                id = 'select_polyline'
                strokeWidth = "3"
                stroke = "#27ae60"
                fill = "none"
                strokeOpacity = "1"
                points = {this.props.points}
                style = {style}
            ></polyline>
        )
    }
}

