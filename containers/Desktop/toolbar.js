import React, { Component, PropTypes,Fragment} from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'

import {openProject,newProject,saveProject} from '../../actions/Desktop/projectMeny';
import {clickQuestionMenu} from '../../actions/Desktop/questionButton';

import ComponentToolbar from "../../components/Desktop/toolbar";
import ComponentAbout from "../../components/Desktop/about";

class Toolbar extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        let About = () => {
            if(this.props.questionId == 'about'){
                return <ComponentAbout
                    curentVersion = {this.props.curentVersion}
                    clickQuestionMenu = {this.props.clickQuestionMenu}
                />
            }else{
                return null
            }
        };

        return (
            <Fragment>
                <ComponentToolbar
                    resize = {this.props.resize}
                    openProject = {this.props.openProject}
                    newProject = {this.props.newProject}
                    saveProject = {this.props.saveProject} 
                    clickQuestionMenu = {this.props.clickQuestionMenu}      
                ComponentToolbar/>
                <About/>
            </Fragment>
        )
    }
}

function mapStateToProps (state) {
    return {
        questionId: state.toolbar.questionId, 
        curentVersion: state.typeORM.curentVersion,    

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



