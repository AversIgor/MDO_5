import React, { Component, PropTypes } from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'

import ComponentSvg from "../../components/Abris/svg";
import PlotObject from "./plot/plotObject";
import PlotArray from "./plot/plotArray";
import Aim from "./aim";
import Calibrate from "./calibrate";
import Gpsbinding from "./gpsbinding";

class Svg extends Component {

    constructor(props) {
        super(props);
    }


    render() {

        let curentContour = () => {
            if(!this.props.curentObject){
                return []
            }else {
                return this.props.curentObject.contour
            }
        }
        return (
            <ComponentSvg>
                <Aim/>
                <PlotArray
                    objects={this.props.objects}
                    curentObject={this.props.curentObject}
                />
                <PlotObject
                    curentContour={curentContour()}
                />
                <Calibrate/>
				<Gpsbinding/>
            </ComponentSvg>
        )
    }
}

function mapStateToProps (state) {
    return{
        curentObject: state.polygons.curentObject,
        objects: state.polygons.objects,
    }
}

function mapDispatchToProps(dispatch) {
    return {        
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Svg)