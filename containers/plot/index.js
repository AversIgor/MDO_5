import React, { Component, PropTypes,Fragment} from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'

import {changeProperty,updateObjectTaxation,deleteObjectTaxation} from "../../actions/plot";


import ComponentConteiner from "../../components/plot/index";
import ComponentProperty from "../../components/plot/property";
import ComponentRecount from "../../components/plot/recount";

class Plot extends Component {

    constructor(props) {
        super(props);
        this.state = {
            conteinerReady:false
        };
    }

    conteinerReady = () => {
        this.setState({conteinerReady: true})      
    }

    updateObjectTaxation = (values) => {
        this.props.updateObjectTaxation(values,this.props.recount)      
    }

    deleteObjectTaxation = (id) => {
        this.props.deleteObjectTaxation(id,this.props.recount)      
    }


    componentDidMount() {
        return true
    }

    render() {
        return (
            <Fragment>
                <ComponentConteiner
                    conteinerReady = {this.conteinerReady}
                />
                <ComponentRecount
                    conteinerReady = {this.state.conteinerReady}
                    recount = {this.props.recount} 
                    rows = {this.props.rows} 
                    breed = {this.props.breed}                   
                    enumerations = {this.props.enumerations} 
                    property = {this.props.property}
                    updateObjectTaxation = {this.updateObjectTaxation}
                    deleteObjectTaxation = {this.deleteObjectTaxation}
                />
                <ComponentProperty
                    conteinerReady = {this.state.conteinerReady} 
                    property = {this.props.property}
                    forestry = {this.props.forestry}
                    subforestry = {this.props.subforestry}
                    tract = {this.props.tract}
                    methodscleanings = {this.props.methodscleanings}
                    cuttingmethods = {this.props.cuttingmethods}
                    typesrates = {this.props.typesrates}
                    enumerations = {this.props.enumerations} 
                    changeProperty = {this.props.changeProperty}                    
                />
            </Fragment>            
        )
    }
}


function mapStateToProps (state) {
    return {
        property: state.plot.property,
        recount: state.plot.recount,
        rows: state.plot.rows,
        forestry: state.forestry.data,
        subforestry: state.subforestry.data,
        tract: state.tract.data,
        methodscleanings: state.methodscleanings.data,
        cuttingmethods: state.cuttingmethods.data,
        typesrates: state.typesrates.data,
        breed: state.breed.data,
        enumerations: state.enumerations,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        changeProperty: bindActionCreators(changeProperty, dispatch),  
        updateObjectTaxation: bindActionCreators(updateObjectTaxation, dispatch),
        deleteObjectTaxation: bindActionCreators(deleteObjectTaxation, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Plot)



