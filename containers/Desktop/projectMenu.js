import React, { Component, PropTypes } from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'

import ComponentProjectMenu from "../../components/Desktop/projectMenu";
import {openProject,newProject,saveProject} from '../../actions/Desktop/projectMeny';

class ProjectMenu extends Component {

    constructor(props) {
        super(props);
    }

    render() {        
        return (
            <ComponentProjectMenu
                openProject = {this.props.openProject}
                newProject = {this.props.newProject}
                saveProject = {this.props.saveProject}
            />
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

export default connect(mapStateToProps, mapDispatchToProps)(ProjectMenu)



