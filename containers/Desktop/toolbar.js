import React, { Component, PropTypes,Fragment} from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'

import {openProject,newProject,saveProject} from '../../actions/Desktop/projectMeny';
import {clickQuestionMenu} from '../../actions/Desktop/questionMenu';
import {clickMenu} from '../../actions/Desktop/leftMenu';

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
                    leftMenuData = {this.props.leftMenuData}
                    openProject = {this.props.openProject}
                    newProject = {this.props.newProject}
                    saveProject = {this.props.saveProject} 
                    clickQuestionMenu = {this.props.clickQuestionMenu}  
                    clickMenu = {this.props.clickMenu}    
                ComponentToolbar/>
                <About/>
            </Fragment>
        )
    }
}

function mapStateToProps (state) {
    return {
        questionId: state.toolbar.questionId, 
        leftMenuData: state.leftMenu.data,
        curentVersion: state.typeORM.curentVersion,    

    }
}

function mapDispatchToProps(dispatch) {
    return {
        openProject: bindActionCreators(openProject, dispatch),
        newProject: bindActionCreators(newProject, dispatch),
        saveProject: bindActionCreators(saveProject, dispatch),
        clickQuestionMenu: bindActionCreators(clickQuestionMenu, dispatch),
        clickMenu: bindActionCreators(clickMenu, dispatch)        
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar)



