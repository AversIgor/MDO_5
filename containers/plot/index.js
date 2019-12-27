import React, { Component, PropTypes,Fragment} from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'

import {
    newPlot,
    changeProperty,
    updateObjectTaxation,
    updateBreed,
    deleteObjectTaxation,
    deleteBreed,
    changeCurentRecount,
    updateStep,
    changeCoeficients,
    mdoRecount
} from "../../actions/plot";

import {saveCurentPlot,clearProject} from "../../actions/Desktop/curentproject";

import ComponentConteiner from "../../components/plot/index";
import ComponentProperty from "../../components/plot/property";
import ComponentRecount from "../../components/plot/recount";
import ComponentSteps from "../../components/plot/steps";
import ComponentCoefficients from "../../components/plot/coefficients";
import ComponentMdoRecount from "../../components/plot/mdoRecount";

import Printform from "./printform";

class Plot extends Component {

    constructor(props) {
        super(props);
        this.state = {
            conteinerReady:false,
            openCoefficients:false,   
            openMdoRecount:false, 
            openSelectPrintForm:false,      
        };
    }

    conteinerReady = () => {
        this.setState({conteinerReady: true})      
    }
    
    changeProperty = (values) => {
        this.props.changeProperty(this.props.plotObject,values)      
    }


    updateObjectTaxation = (values) => {
        this.props.updateObjectTaxation(this.props.plotObject,values)      
    }

    updateBreed = (values) => {
        this.props.updateBreed(this.props.plotObject,values,this.props.breed)      
    }

    deleteObjectTaxation = (id) => {
        this.props.deleteObjectTaxation(this.props.plotObject,id)      
    }

    deleteBreed = (id,parentid) => {        
        this.props.deleteBreed(this.props.plotObject,id,parentid)      
    }

    changeCoeficients = (changeCoeficients) => { 
        this.props.changeCoeficients(this.props.plotObject,changeCoeficients) 
    }

    changeCurentRecount = (node) => {
        let curentRecount = {} 
        if(node.$parent != 0){
            curentRecount.objectTaxation = node.$parent
            curentRecount.breed = node.id
        }else{
            curentRecount.objectTaxation = node.id
            curentRecount.breed = undefined
        }    
        this.props.changeCurentRecount(this.props.plotObject,curentRecount)
    }

    updateStep = (row) => { 
        this.props.updateStep(this.props.plotObject,row) 
        this.props.saveCurentPlot(this.props.plotObject)
    }

    formCoefficients = (open) => {
        this.setState({openCoefficients: open})      
    }

    mdoRecount = () => {
        this.props.mdoRecount(
            this.props.plotObject,
        )   
    }

    formMdoRecount = (open) => {
        this.setState({openMdoRecount: open})      
    }

    handlerOpenCloseSelectPrintForm = (param) => {
        this.setState({openSelectPrintForm: param})
    }

    componentDidMount() {

        let props =  this.props
        if(!this.props.plotObject){
            if(this.props.curentproject.plot){
                webix.modalbox.hide("saveProject");
                webix.modalbox({
                id:"saveProject", 
                title: "Внимание!",
                buttons:["Продолжить расчет", "Начать новый"],
                text: "Зафиксирован не сохраненный расчет МДО",
                type:"confirm-warning",
                width:400,
                }).then(function(result){
                    switch(result){
                        case "0": 
                            props.newPlot(this.props.curentproject.plot);
                            break;
                        case "1":
                            props.newPlot();
                            break;
                    }   
                });
                props.clearProject(0)
            }else{
                props.newPlot();
            }
        }      
    }

    shouldComponentUpdate(nextProps, nextState){
        if(nextProps.plotObject != this.props.plotObject){
            this.props.saveCurentPlot(nextProps.plotObject)
        }
        if(nextProps.recount != this.props.recount){
            this.setState({openSelectPrintForm:true})
        }
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
                    plotObject = {this.props.plotObject} 
                    curentRecount = {this.props.curentRecount}
                    breed = {this.props.breed}                   
                    enumerations = {this.props.enumerations} 
                    updateObjectTaxation = {this.updateObjectTaxation}
                    updateBreed = {this.updateBreed}
                    deleteObjectTaxation = {this.deleteObjectTaxation}
                    deleteBreed = {this.deleteBreed}
                    changeCurentRecount = {this.changeCurentRecount}
                />
                <ComponentSteps
                    conteinerReady = {this.state.conteinerReady}
                    plotObject = {this.props.plotObject}
                    updateStep = {this.updateStep}
                    formCoefficients = {this.formCoefficients}
                    mdoRecount = {this.mdoRecount}
                />
                <ComponentProperty
                    conteinerReady = {this.state.conteinerReady} 
                    plotObject = {this.props.plotObject}
                    forestry = {this.props.forestry}
                    subforestry = {this.props.subforestry}
                    tract = {this.props.tract}
                    methodscleanings = {this.props.methodscleanings}
                    cuttingmethods = {this.props.cuttingmethods}
                    typesrates = {this.props.typesrates}
                    enumerations = {this.props.enumerations} 
                    changeProperty = {this.changeProperty}                    
                />
                <ComponentCoefficients
                    plotObject = {this.props.plotObject}
                    conteinerReady = {this.state.conteinerReady} 
                    openCoefficients = {this.state.openCoefficients}
                    changeCoeficients = {this.changeCoeficients}
                    formCoefficients = {this.formCoefficients}
                    cuttingmethods = {this.props.cuttingmethods}
                    enumerations = {this.props.enumerations} 
                    property = {this.props.property} 
                    typesrates = {this.props.typesrates}               
                />
                <ComponentMdoRecount
                    conteinerReady = {this.state.conteinerReady} 
                    openMdoRecount = {this.state.openMdoRecount} 
                    formMdoRecount = {this.formMdoRecount}            
                />
                <Printform
                    open = {this.state.openSelectPrintForm}
                    handlerOpenClose    = {this.handlerOpenCloseSelectPrintForm}          
                />
            </Fragment>            
        )
    }
}


function mapStateToProps (state) {
    return {
        curentproject: state.curentproject,
        plotObject: state.plot.plotObject,
        curentRecount: state.plot.curentRecount,
        recount: state.plot.recount,
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
        newPlot: bindActionCreators(newPlot, dispatch),
        changeProperty: bindActionCreators(changeProperty, dispatch),  
        updateObjectTaxation: bindActionCreators(updateObjectTaxation, dispatch),
        deleteObjectTaxation: bindActionCreators(deleteObjectTaxation, dispatch),
        updateBreed: bindActionCreators(updateBreed, dispatch),
        deleteBreed: bindActionCreators(deleteBreed, dispatch),
        changeCurentRecount: bindActionCreators(changeCurentRecount, dispatch),
        updateStep: bindActionCreators(updateStep, dispatch),
        changeCoeficients: bindActionCreators(changeCoeficients, dispatch),
        mdoRecount: bindActionCreators(mdoRecount, dispatch),
        saveCurentPlot: bindActionCreators(saveCurentPlot, dispatch),
        clearProject: bindActionCreators(clearProject, dispatch),

        
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(Plot)



