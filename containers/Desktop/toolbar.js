import React, { Component, PropTypes,Fragment} from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'

import {clickQuestionMenu} from '../../actions/Desktop/questionMenu';
import {clickMenu} from '../../actions/Desktop/leftMenu';
import {clearProject} from '../../actions/Desktop/curentproject';
import {newPlot} from '../../actions/plot';
import * as background from '../../actions/Abris/background';
import * as objects from '../../actions/Abris/objects';


//новая логика. все управляется их projectMeny
import * as projectMeny from '../../actions/Desktop/projectMeny';

import ComponentToolbar from "../../components/Desktop/toolbar";
import ComponentAbout from "../../components/Desktop/about";

class Toolbar extends Component {

    constructor(props) {
        super(props);
    }

    newProject = (restore) => {
        if(restore){
            this.props.newPlot(this.props.curentproject.plot)
        }else{
            this.props.newPlot()             
        }  
        this.props.clearProject()        
    }

    render() {
        let About = () => {
            if(this.props.questionId == 'about'){
                return <ComponentAbout
                    curentVersion = {this.props.curentVersion}
                    license = {this.props.license}
                    clickQuestionMenu = {this.props.clickQuestionMenu}
                />
            }else{
                return null
            }
        };

        return (
            <Fragment>
                <ComponentToolbar                    
                    leftMenuData = {this.props.leftMenuData}
                    plotObject = {this.props.plotObject}
                    curentproject = {this.props.curentproject}
                    newProject = {this.newProject}
                    clickQuestionMenu = {this.props.clickQuestionMenu}  
                    clickMenu = {this.props.clickMenu}
                    saveProject = {this.props.saveProject}    
                />
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
        license: state.license,
        curentproject: state.curentproject,
        plotObject: state.plot.plotObject, 
    }
}

function mapDispatchToProps(dispatch) {
    return {
        saveProject: bindActionCreators(projectMeny.saveProject, dispatch),
        clickQuestionMenu: bindActionCreators(clickQuestionMenu, dispatch),
        clickMenu: bindActionCreators(clickMenu, dispatch),  
        background_reset: bindActionCreators(background.reset, dispatch),
        objects_reset: bindActionCreators(objects.reset, dispatch), 
        clearProject: bindActionCreators(clearProject, dispatch), 
        newPlot: bindActionCreators(newPlot, dispatch),     
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar)



