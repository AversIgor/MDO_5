import React, { Component, PropTypes } from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'

import ComponentOldcontent from "../../components/Desktop/oldcontent";

class OldContent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            resize: false
        };
    }

    componentDidMount() {
        let self = this;
        webix.event(window, "resize", function(){
            self.setState({resize: !self.state.resize})
        })
    }

    render() {
        return (
            <ComponentOldcontent
                module = {this.props.module}
            />
        )
    }
}

function mapStateToProps (state) {
    return {
        resize: state.leftMenu.resize,
    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OldContent)



