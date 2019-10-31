import React, { Component, PropTypes,Fragment} from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'

import ComponentConteiner from "../../components/plot/index";
import ComponentProperty from "../../components/plot/property";
import ComponentObjectsTaxation from "../../components/plot/objectsTaxation";

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

    componentDidMount() {
        return true
    }

    render() {

        let Property = () => {
            if(this.state.conteinerReady){
                return <ComponentProperty
                    property = {this.props.property}
                    forestry = {this.props.forestry}
                    subforestry = {this.props.subforestry}
                    tract = {this.props.tract}
                    methodscleanings = {this.props.methodscleanings}
                    cuttingmethods = {this.props.cuttingmethods}
                    typesrates = {this.props.typesrates}
                    enumerations = {this.props.enumerations}                
                />
            }else{
                return null
            }
        };
        
        let ObjectsTaxation = () => {
            if(this.state.conteinerReady){
                return <ComponentObjectsTaxation
                    rows = {this.props.rows} 
                    breed = {this.props.breed}                   
                    enumerations = {this.props.enumerations}                
                />
            }else{
                return null
            }
        };


        return (
            <Fragment>
                <ComponentConteiner
                    conteinerReady = {this.conteinerReady}
                />
                <ObjectsTaxation/>
                <Property/>
            </Fragment>            
        )
    }
}

function mapStateToProps (state) {
    return {
        property: state.plot.property,
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
        //forestry_fill_data: bindActionCreators(forestry.fill_data, dispatch),  
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Plot)



