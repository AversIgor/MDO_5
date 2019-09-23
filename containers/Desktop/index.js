import React, { Component, PropTypes, Fragment  } from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import ReactDOM from 'react-dom';


import Toolbar from "./toolbar";
import InfoButton from "./infoButton";
import QuestionButton from "./questionButton";
import LeftMenu from "./leftMenu";

import MdoSubsystem from "../MdoSubsystem";

class Desktop extends Component {

    constructor(props) {
        super(props);
        this.state = {
            resize: false
        };
    }


    componentDidMount() {
        let self = this;
        webix.event(window, "resize", function(){
            self.setState({resize: !self.state.resize})
        })
    }

    render() {  

        let sizeLefyMenu = {
            height:($(window).height()-50)+"px",
            width:"252px",
        }

        let positionMdoSubsystem = {
            height:($(window).height()-50)+"px",
            width:($(window).width()-252)+"px",
            position:'absolute',
            top:"52px",
            left:"252px"
        }

        let sizeMdoSubsystem = {
            height:($(window).height()-50)+"px",
            width:($(window).width()-252)+"px",
        }
 
        return (
            <Fragment>
                <div 
                    style={{
                            height:"50px",
                            width:"100%",
                        }}>
                    <Toolbar/>
                </div>
                <div 
                    style={sizeLefyMenu}>
                    <LeftMenu
                        size = {sizeLefyMenu}
                    />
                </div>
                <div 
                    style={positionMdoSubsystem}>
                    <MdoSubsystem
                        size = {sizeMdoSubsystem}
                    />
                </div>
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