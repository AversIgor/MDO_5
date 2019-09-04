import React, { Component, PropTypes } from "react";

export default class ComponentClearContent extends Component {

    constructor(props) {
        super(props);
    }
    //это необходимо пока существует w2ui
    render() {
        $("#content").empty();
        return null
    }
}