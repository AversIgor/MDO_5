import React, { Component, PropTypes } from "react";

export default class SVG extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <svg
                id = "SVG"
                style={{
                    height:"100%",
                    width:"100%",
                }}
            >
                {this.props.children}
            </svg>
        )
    }
}



