import React, { Component, PropTypes, Fragment} from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import * as FileSaver from "file-saver";

import ComponentSelectprintform from "../../components/reference/printforms/selectprintform";
import ComponentPrintform from "../../components/reference/printforms/printform";

class Printform extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectPrintId: undefined,
        };
    }

    stringReplace(str,substr,value){
        return str.replace(new RegExp(substr,"g"), ((value) ? value : "" ))
    }


    replaceField(html,field,value,collection = undefined,collectionValue = 'value') {
        if(collection){
            let item = collection.find(item => item.id == value);
            if(item){
                value = item[collectionValue]
            }
        }
        html = this.stringReplace(html,field,value)
        return html
    }


   
    updateStates = (editor) => {
        let plotProperty = this.props.plotObject.property;
        const asyncProcess = async () => {
            let contents = jQuery(editor.contentDocument).contents()            
            let html = contents.find('body').html()
            if(html.indexOf('data-mce-bogus') != -1){
                //'шаблон не готов'
                return
            }

            html = this.replaceField(html,'~forestry~',plotProperty.location.forestry,this.props.forestry)
            html = this.replaceField(html,'~subforestry~',plotProperty.location.subforestry,this.props.subforestry)
            html = this.replaceField(html,'~tract~',plotProperty.location.tract,this.props.tract)
            html = this.replaceField(html,'~quarter~',plotProperty.location.quarter)
            html = this.replaceField(html,'~isolated~',plotProperty.location.isolated)
            html = this.replaceField(html,'~cuttingarea~',plotProperty.location.cuttingarea)

            html = this.replaceField(html,'~cuttingmethods~',plotProperty.felling.cuttingmethods,this.props.cuttingmethods)
            html = this.replaceField(html,'~purposeForests~',plotProperty.parameters.purposeForests,this.props.enumerations.purposeForests)
            html = this.replaceField(html,'~property~',plotProperty.parameters.property,this.props.enumerations.property)
            html = this.replaceField(html,'~undergrowth~',plotProperty.parameters.undergrowth)
            html = this.replaceField(html,'~areacutting~',plotProperty.felling.areacutting)
            html = this.replaceField(html,'~methodTaxation~',plotProperty.taxation.methodTaxation,this.props.enumerations.methodTaxation)
            html = this.replaceField(html,'~coefficient~',plotProperty.taxation.coefficient)
            html = this.replaceField(html,'~rankTax~',plotProperty.taxation.rankTax,this.props.enumerations.rankTax)
            html = this.replaceField(html,'~seedtrees~',plotProperty.parameters.seedtrees)
            html = this.replaceField(html,'~methodscleaning~',plotProperty.parameters.methodscleaning,this.props.methodscleanings)
            html = this.replaceField(html,'~region~',plotProperty.taxation.typesrates,this.props.typesrates,'region')

            //сортиментные таблицы будем брать из пород
            console.log(this.props.publications)
                
            contents.find('body').html(html)

            return
        }
        asyncProcess()
    }

    saveContent = (contentDocument,name) => {
        var content = '<!DOCTYPE html>' + contentDocument.documentElement.outerHTML;
        var converted = htmlDocx.asBlob(content, {orientation: 'portrait'});
        FileSaver.saveAs(converted, name+'.docx');
    }

    selectPrintForm = (id) => {  
        this.setState({selectPrintId:id})
    }

    shouldComponentUpdate(nextProps, nextState){
        if((!nextProps.open) && (this.props.open)){
            return false;
        }else{
            return true;
        }       
    }

    render() {

        let meny = []
        for (let i = 0; i < this.props.printforms.length; i++) {
            if(this.props.printforms[i].type == 2){
                meny.push({ id:this.props.printforms[i].id, title:this.props.printforms[i].name})
            }
        }

        let Printform = () => {
            if (this.state.selectPrintId != undefined){
                return <ComponentPrintform
                            selectPrintForm={this.selectPrintForm}
                            updateStates={this.updateStates}
                            saveContent={this.saveContent}
                            data={this.props.printforms.find(item => item.id == this.state.selectPrintId)}                            
                        />;
            }
            if(this.state.selectPrintId == undefined){
                return null
            }
        }  
    

        return (
            <Fragment>
                <Printform/>
                <ComponentSelectprintform
                    open={this.props.open}
                    handlerOpenClose={this.props.handlerOpenClose}
                    selectPrintForm={this.selectPrintForm}
                    data={meny}
                />            
            </Fragment>
        )
    }
}

         

function mapStateToProps (state) {
    return {
        plotObject: state.plot.plotObject,
        recountResult: state.plot.recountResult,
        printforms: state.printforms.data,
        forestry:state.forestry.data,
        subforestry:state.subforestry.data,
        tract:state.subforestry.data,  
        cuttingmethods:state.cuttingmethods.data, 
        methodscleanings:state.methodscleanings.data,
        typesrates:state.typesrates.data,
        publications:state.publications.data,
        enumerations:state.enumerations,      
    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Printform)