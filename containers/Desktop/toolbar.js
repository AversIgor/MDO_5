import React, { Component, PropTypes} from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'

import {openProject,newProject,saveProject} from '../../actions/Desktop/projectMeny';

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
        saveProject: bindActionCreators(saveProject, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar)



