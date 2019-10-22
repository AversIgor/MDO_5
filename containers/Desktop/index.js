import React, { Component, PropTypes, Fragment  } from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import ReactDOM from 'react-dom';


import Toolbar from "./toolbar";
import LeftMenu from "./leftMenu";

import MdoSubsystem from "../MdoSubsystem";

class Desktop extends Component {

    constructor(props) {
        super(props);
        this.state = {
            resize: false,
            widthLeftMenu:0
        };
    }

    resizeFromWindow = () => {
        this.setState({resize: !this.state.resize})
    }

    resizeLeftMenu = (width) => {
        this.setState({widthLeftMenu: width+2})//двойка из за границы компонента        
    }

    componentDidMount() {
        let self = this;
        webix.event(window, "resize", function(){
            self.resizeFromWindow()
        })
    }

    render() {  

        /*let sizeLeftMenu = {
            height:($(window).height()-50)+"px",
            width:this.state.widthLeftMenu+"px",
        }*/


        let styleMdoSubsystem = {
            height:($(window).height()-50)+"px",
            width:($(window).width())+"px",
        }

        let positionMdoSubsystem = {
            height:styleMdoSubsystem.height,
            width:styleMdoSubsystem.width,
            position:'absolute',
            top:"50px",
            left:this.state.widthLeftMenu+"px",            
        }
 
        return (
            <Fragment>
                <div 
                    style={{
                            height:"50px",
                            width:"100%",
                            position: 'relative',
                            zIndex: '20',
                        }}>
                    <Toolbar
                        resize={this.state.resize}
                    />
                </div>
                <div 
                    style={positionMdoSubsystem}>
                    <MdoSubsystem
                        style = {styleMdoSubsystem}
                    />
                </div>
            </Fragment>                  
        )
    }
}

/*<div 
style={sizeLeftMenu}>
<LeftMenu
    size = {sizeLeftMenu}
    resizeLeftMenu = {this.resizeLeftMenu}
/>
</div>*/



function mapStateToProps (state) {
    return {
        
    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Desktop)