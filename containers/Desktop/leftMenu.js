import React, { Component, PropTypes } from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'

import ComponentLeftMenu from "../../components/Desktop/leftMenu";

import {resize} from '../../actions/Desktop/leftMenu';

class LeftMenu extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(){
        
    }
    
    handlerItemClick = (id) => {
        this.props.action(id);
    }
    
    render() {
        return (
                <ComponentLeftMenu                    
                    data = {this.props.data}
                    handlerItemClick={this.handlerItemClick}
                    resize={this.props.resize}
                />
        )
    }
}

function mapStateToProps (state) {
    return {
        data: state.leftMenu.data,
        action: state.leftMenu.action,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        resize: bindActionCreators(resize, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftMenu)



