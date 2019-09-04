import React, { Component, PropTypes } from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'

import ComponentToolbar from "../../components/Desktop/toolbar";

class Toolbar extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ComponentToolbar/>
        )
    }
}

function mapStateToProps (state) {
    return {

    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar)



