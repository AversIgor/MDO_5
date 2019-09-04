import React, { Component, PropTypes, Fragment  } from "react";
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
            <Fragment>                
                <Toolbar/>                
            </Fragment>
        )
    }
}

/*<ProjectMenu/>
<Toolbar/>
<MdoSubsystem

/>
<InfoButton/>
<QuestionButton/>

<LeftMenu/>*/


function mapStateToProps (state) {
    return {
        
    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Desktop)