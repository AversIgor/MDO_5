import React, { Component, PropTypes,Fragment} from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'

import ComponentPlot from "../../components/plot";

import * as forestry from "../../actions/reference/forestry";
import * as subforestry from "../../actions/reference/subforestry";

class Plot extends Component {

    constructor(props) {
        super(props);
        this.update = {
            forestry:true,
            subforestry:true,
        };
    }

    componentDidMount() {
        this.update = {
            forestry:false,
            subforestry:false,
        };
        this.props.forestry_fill_data({status:0});
        this.props.subforestry_fill_data({status:0});
    }

    shouldComponentUpdate(nextProps, nextState){
        let update = false
        
        if(nextProps.forestry != this.props.forestry){
            this.update.forestry = true
        }
        if(nextProps.subforestry != this.props.subforestry){
            this.update.subforestry = true
        }
       
        if(     (this.update.forestry       == true) 
            &&  (this.update.subforestry    == true)
            ){
            update = true
        }
        return update
    }

    render() {
        return (
            <ComponentPlot
                property = {this.props.property}
                forestry = {this.props.forestry}
                subforestry = {this.props.subforestry}
            />
        )
    }
}

function mapStateToProps (state) {
    return {
        property: state.plot.property,
        forestry: state.forestry.data,
        subforestry: state.subforestry.data,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        forestry_fill_data: bindActionCreators(forestry.fill_data, dispatch),  
        subforestry_fill_data: bindActionCreators(subforestry.fill_data, dispatch),    
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Plot)



