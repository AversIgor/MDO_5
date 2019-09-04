import React, { Component, PropTypes } from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'

import css from '../../components/Desktop/index.css'

import ProjectMenu from "./projectMenu";
import Toolbar from "./toolbar";
import InfoButton from "./infoButton";
import QuestionButton from "./questionButton";
import LeftMenu from "./leftMenu";


import MdoSubsystem from "../MdoSubsystem";

class Desktop extends Component {

    constructor(props) {
        super(props);
    }


    render() {        
        return (
            <div>
                <ProjectMenu/>
                <Toolbar/>
                <MdoSubsystem

                />
                <InfoButton/>
                <QuestionButton/>

                <LeftMenu/>
            </div>
        )
    }
}


function mapStateToProps (state) {
    return {
        
    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Desktop)