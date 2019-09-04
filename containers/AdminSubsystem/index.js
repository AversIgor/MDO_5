import React, { Component, PropTypes } from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'

import ComponentClearContent from "../../components/Desktop/clearContent";
import ComponentToolbarButton from "../../components/AdminSubsystem/toolbarButton";
import ComponentProgramsetup from "../../js/programsetup";
import {creatLeftMenu} from '../../actions/AdminSubsystem';

class AdminSubsystem extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(){

    }

    render() {

        let FormContent = () => {
            switch(this.props.leftMenu.id) {
                case "database":
                    return <ComponentProgramsetup/>;
                default:
                    return null;
            }
        };

        return (
            <div>
                <ComponentToolbarButton
                    container = {this.props.container}
                    index = {this.props.index}
                    handlerToolbarButton={this.props.creatLeftMenu}
                />
                <ComponentClearContent  children={this.props.children}>
                    <FormContent/>
                </ComponentClearContent>
            </div>
        )
    }
}

function mapStateToProps (state) {
    return {
        leftMenu: state.leftMenu,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        creatLeftMenu: bindActionCreators(creatLeftMenu, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminSubsystem)



