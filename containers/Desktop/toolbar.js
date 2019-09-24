import React, { Component, PropTypes} from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'

import {openProject,newProject,saveProject} from '../../actions/Desktop/projectMeny';
import {clickQuestionMenu} from '../../actions/Desktop/questionButton';

import ComponentToolbar from "../../components/Desktop/toolbar";

class Toolbar extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <ComponentToolbar
                openProject = {this.props.openProject}
                newProject = {this.props.newProject}
                saveProject = {this.props.saveProject} 
                clickQuestionMenu = {this.props.clickQuestionMenu}      
            ComponentToolbar/>
        )
    }
}

function mapStateToProps (state) {
    return {
        

    }
}

function mapDispatchToProps(dispatch) {
    return {
        openProject: bindActionCreators(openProject, dispatch),
        newProject: bindActionCreators(newProject, dispatch),
        saveProject: bindActionCreators(saveProject, dispatch),
        clickQuestionMenu: bindActionCreators(clickQuestionMenu, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar)



