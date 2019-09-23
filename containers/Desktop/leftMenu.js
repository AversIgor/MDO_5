import React, { Component, PropTypes } from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'

import {clickMenu} from '../../actions/Desktop/leftMenu';
import ComponentLeftMenu from "../../components/Desktop/leftMenu";


class LeftMenu extends Component {

    constructor(props) {
        super(props);
    }
 
    render() {
        return (
                <ComponentLeftMenu                    
                    data = {this.props.data}
                    size = {this.props.size}
                    clickMenu={this.props.clickMenu}
                />
        )
    }
}

function mapStateToProps (state) {
    return {
        data: state.leftMenu.data,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        clickMenu: bindActionCreators(clickMenu, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftMenu)