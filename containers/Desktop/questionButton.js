import React, { Component, PropTypes } from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'

import ComponentQiestionButton from "../../components/Desktop/questionButton";
import {creatRightMenu,clickMenu} from '../../actions/Desktop/questionButton';

class QiestionButton extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(){
        this.props.creatRightMenu();
    }
    
    handlerItemClick = (id) => {
        this.props.clickMenu(id);
    }
    
    render() {
        return (
            <div>
                <ComponentQiestionButton
                    data = {this.props.data}
                    handlerItemClick={this.handlerItemClick}
                />
            </div>)
    }
}

function mapStateToProps (state) {
    return {
        data: state.questionButton.data,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        clickMenu: bindActionCreators(clickMenu, dispatch),
        creatRightMenu: bindActionCreators(creatRightMenu, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QiestionButton)



