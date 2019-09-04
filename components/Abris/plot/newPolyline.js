import React, { Component, PropTypes, Fragment } from "react";

let style ={
    'WebkitUserSelect':"none"
}

export default class NewPolyline extends Component {

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
        
        let id        = this.props.id || 'new_polyline'
        return (<polyline
                id = {id}
                strokeWidth = "1"
                stroke = "#27ae60"
                fill = "none"
                strokeOpacity = "1"
                points = {this.props.points}
                strokeDasharray = "5 5"
                style = {style}
            ></polyline>
        )
    }
}

