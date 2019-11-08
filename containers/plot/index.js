import React, { Component, PropTypes,Fragment} from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'

import {changeProperty,updateObjectTaxation,updateBreed,deleteObjectTaxation,deleteBreed,changeCurentRecount,updateStep} from "../../actions/plot";


import ComponentConteiner from "../../components/plot/index";
import ComponentProperty from "../../components/plot/property";
import ComponentRecount from "../../components/plot/recount";
import ComponentSteps from "../../components/plot/steps";
import ComponentCoefficients from "../../components/plot/coefficients";

class Plot extends Component {

    constructor(props) {
        super(props);
        this.state = {
            conteinerReady:false,
            openCoefficients:false,          
        };
    }

    conteinerReady = () => {
        this.setState({conteinerReady: true})      
    }

    updateObjectTaxation = (values) => {
        this.props.updateObjectTaxation(values,this.props.recount)      
    }

    updateBreed = (values) => {
        this.props.updateBreed(values,this.props.recount,this.props.breed)      
    }

    deleteObjectTaxation = (id) => {
        this.props.deleteObjectTaxation(id,this.props.recount)      
    }

    deleteBreed = (id,parentid) => {        
        this.props.deleteBreed(id,parentid,this.props.recount)      
    }

    changeCurentRecount = (node) => { 
        if(node.$parent != 0){
            let parent         = this.props.recount.find(item => item.id == node.$parent);
            let curentRecount  = parent.objectsBreed.find(item => item.id == node.id);
            this.props.changeCurentRecount(curentRecount)
        }else{
            let parent         =  this.props.recount.find(item => item.id == node.id);
            this.props.changeCurentRecount(parent)
        }    
    }

    updateStep = (row) => { 
        if(('id' in this.props.curentRecount) && ('parent' in this.props.curentRecount)){
            this.props.updateStep(row,this.props.recount,this.props.curentRecount.id,this.props.curentRecount.parent) 
        }
    }

    formCoefficients = (open) => {
        this.setState({openCoefficients: open})      
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
                    curentRecount = {this.props.curentRecount}
                    breed = {this.props.breed}                   
                    enumerations = {this.props.enumerations} 
                    property = {this.props.property}
                    updateObjectTaxation = {this.updateObjectTaxation}
                    updateBreed = {this.updateBreed}
                    deleteObjectTaxation = {this.deleteObjectTaxation}
                    deleteBreed = {this.deleteBreed}
                    changeCurentRecount = {this.changeCurentRecount}
                />
                <ComponentSteps
                    conteinerReady = {this.state.conteinerReady}
                    recount = {this.props.recount}
                    curentRecount = {this.props.curentRecount}
                    updateStep = {this.updateStep}
                    formCoefficients = {this.formCoefficients}
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
                <ComponentCoefficients
                    conteinerReady = {this.state.conteinerReady} 
                    openCoefficients = {this.state.openCoefficients}
                    cuttingmethods = {this.props.cuttingmethods}
                    enumerations = {this.props.enumerations} 
                    property = {this.props.property} 
                    typesrates = {this.props.typesrates}               
                />
            </Fragment>            
        )
    }
}


function mapStateToProps (state) {
    return {
        property: state.plot.property,
        recount: state.plot.recount,
        curentRecount: state.plot.curentRecount,
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
        updateBreed: bindActionCreators(updateBreed, dispatch),
        deleteBreed: bindActionCreators(deleteBreed, dispatch),
        changeCurentRecount: bindActionCreators(changeCurentRecount, dispatch),
        updateStep: bindActionCreators(updateStep, dispatch),
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(Plot)



