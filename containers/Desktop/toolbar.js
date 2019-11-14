import React, { Component, PropTypes,Fragment} from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'

import {openProject,saveProject} from '../../actions/Desktop/projectMeny';
import {clickQuestionMenu} from '../../actions/Desktop/questionMenu';
import {clickMenu} from '../../actions/Desktop/leftMenu';
import {restoreProject} from '../../actions/Desktop/curentproject';
import {newPlot} from '../../actions/plot';
import * as background from '../../actions/Abris/background';
import * as objects from '../../actions/Abris/objects';


import ComponentToolbar from "../../components/Desktop/toolbar";
import ComponentAbout from "../../components/Desktop/about";

class Toolbar extends Component {

    constructor(props) {
        super(props);
    }

    newProject = () => {
        this.props.newPlot()  
        this.props.background_reset()   
        this.props.objects_reset()
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
                    restoreProject = {this.props.restoreProject}
                    openProject = {this.props.openProject}
                    newProject = {this.newProject}
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
        saveProject: bindActionCreators(saveProject, dispatch),
        clickQuestionMenu: bindActionCreators(clickQuestionMenu, dispatch),
        clickMenu: bindActionCreators(clickMenu, dispatch),  
        newPlot: bindActionCreators(newPlot, dispatch),  
        background_reset: bindActionCreators(background.reset, dispatch),
        objects_reset: bindActionCreators(objects.reset, dispatch), 
        restoreProject: bindActionCreators(restoreProject, dispatch),      
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar)



