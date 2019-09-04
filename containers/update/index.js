import React, { Component } from 'react'
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import {check} from '../../actions/update/index'
import ComponentUpdate from "../../components/update";

class Update extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.check();
    }

    render() {
        return (
            <ComponentUpdate
                textUpdate = {this.props.textUpdate}
            />
        )
    }
}


const mapStateToProps = state => {
    return {
        update: state.update,
        textUpdate: state.update.textUpdate
    }
}

const mapDispatchToProps = dispatch => {
    return {
        check: bindActionCreators(check, dispatch),
    }
}

export default connect( mapStateToProps,mapDispatchToProps)(Update)

