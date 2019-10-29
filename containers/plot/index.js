import React, { Component, PropTypes,Fragment} from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'

import ComponentPlot from "../../components/plot";

class Plot extends Component {

    constructor(props) {
        super(props);

    }

    componentDidMount() {
        return true
    }

    render() {
        return (
            <ComponentPlot
                property = {this.props.property}
                forestry = {this.props.forestry}
                subforestry = {this.props.subforestry}
                tract = {this.props.tract}
                methodscleanings = {this.props.methodscleanings}
                cuttingmethods = {this.props.cuttingmethods}
                typesrates = {this.props.typesrates}
                enumerations = {this.props.enumerations}
            />
        )
    }
}

function mapStateToProps (state) {
    return {
        property: state.plot.property,
        forestry: state.forestry.data,
        subforestry: state.subforestry.data,
        tract: state.tract.data,
        methodscleanings: state.methodscleanings.data,
        cuttingmethods: state.cuttingmethods.data,
        typesrates: state.typesrates.data,
        enumerations: state.enumerations,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        //forestry_fill_data: bindActionCreators(forestry.fill_data, dispatch),  
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Plot)



