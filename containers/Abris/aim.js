import React, { Component, PropTypes, Fragment } from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'

import ComponentAim from "../../components/Abris/aim";

class Aim extends Component {

    constructor(props) {
        super(props);

    }

  
    render() {
        return (<ComponentAim
                magneticdeclination    = {this.props.magneticdeclination}
            />
        )
    }
}

function mapStateToProps (state) {
    return{
        magneticdeclination: state.background.magneticdeclination,
    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Aim)