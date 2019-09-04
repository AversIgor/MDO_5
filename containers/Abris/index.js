import React, { Component, PropTypes } from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'

import css from '../../components/Abris/index.css'

import ComponentSVG from "./svg";
import ComponentOverlay from "./overlay";
import Paint from "./paint";
import ComponentBackground from "./background";

class Abris extends Component {

    constructor(props) {
        super(props);
        this.state = {
            resize: false,
            paintComplite: false
        };
    }

    componentDidMount() {
        let self = this;
        webix.event(window, "resize", function(){
            //self.setState({resize: !self.state.resize})
        })
    }

    handlerComplite = () => {
        if(!this.state.paintComplite){
            this.setState({paintComplite: true})
        }
    }

    render() {
        let Background = () => {
            if(this.state.paintComplite){
                return <ComponentBackground/>
            }else{
                return null
            }
        };
        let SVG = () => {
            if(this.state.paintComplite){
                return <ComponentSVG/>
            }else{
                return null
            }
        };

        return (
            <ComponentOverlay>
                <Paint
                    handlerComplite = {this.handlerComplite}
                >
                    <Background/>
                    <SVG/>
                </Paint>
            </ComponentOverlay>
        )
    }
}


function mapStateToProps (state) {
    return {
        //resize: state.leftMenu.resize,
    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Abris)