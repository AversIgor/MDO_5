import React, { Component, PropTypes } from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'

import ComponentBackground from "../../components/Abris/background";
import {loadImage,setSleep} from '../../actions/Abris/background';

class Background extends Component {

    constructor(props) {
        super(props);
    }

    componentWillUnmount(){
        this.props.setSleep()
    }

    render() {

        return (
            <ComponentBackground
                handlerload={this.props.loadImage}
                src={this.props.src}
                target={this.props.target}
                initSize={this.props.initSize}
                shift={this.props.shift}
                zoom={this.props.zoom}
                rotate={this.props.rotate}
                opacity={this.props.opacity}
                coefficientcalibrate={this.props.coefficientcalibrate}
            />
        )

    }
}


function mapStateToProps (state) {
    return {
        src: state.background.src,
        zoom: state.background.zoom,
        target: state.background.target,
        initSize: state.background.initSize,
        shift: state.background.shift,
        rotate: state.background.rotate,
        opacity: state.background.opacity,
        coefficientcalibrate: state.background.coefficientcalibrate,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        loadImage: bindActionCreators(loadImage, dispatch),
        setSleep: bindActionCreators(setSleep, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Background)