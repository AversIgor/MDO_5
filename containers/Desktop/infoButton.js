import React, { Component, PropTypes } from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'

import ComponentInfoButton from "../../components/Desktop/infoButton";
import Confirm from "../../components/Desktop/confirm";
import {init} from '../../actions/update';

class InfoButton extends Component {

    constructor(props) {
        super(props);
        this.state = {
            confirmIsOpen: false
        };
    }


    handlerInfoButton = (textBadge) => {
        if(this.props.isUpdate){
            this.setState({confirmIsOpen: true})
        }
    }

    handlerConfirmResult = () => {
        this.props.init(this.props.newversion);
        this.setState({confirmIsOpen:false})
    }

    render() {

        let FormConfirm = () => {
            if(this.state.confirmIsOpen == false){
                return null;
            }else {
                return <Confirm 
                    handlerConfirmResult={this.handlerConfirmResult}
                    title={"<b>Внимание!</b>"}
                    text={"Получить последнюю версию программы?"}
                    type={"confirm-warning"}
                />
            }
        };
        
        return (
            <div>
                <ComponentInfoButton
                    isUpdate = {this.props.isUpdate}
                    handlerInfoButton={this.handlerInfoButton}
                />
                <FormConfirm/>
            </div>)
    }
}

function mapStateToProps (state) {
    return {
        isUpdate: state.update.isUpdate,
        newversion: state.update.newversion,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        init: bindActionCreators(init, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoButton)



