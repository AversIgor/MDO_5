import React, { Component } from 'react'
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import {init} from '../../actions/TypeORM/index'

class TypeORMContainer extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.init();
    }

    render() {
        return  null
    }
}


const mapStateToProps = state => {
    return {
        typeORM: state.typeORM
    }
}

const mapDispatchToProps = dispatch => {
    return {
        init: bindActionCreators(init, dispatch),
    }
}

export default connect( mapStateToProps,mapDispatchToProps)(TypeORMContainer)

