import React, { Component, PropTypes, Fragment} from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import * as FileSaver from "file-saver";
let uniq = require('lodash/uniq');

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
            }else{
                value = ""
            }
        }
        html = this.stringReplace(html,field,value)
        return html
    }


   
    updateStates = (editor) => {
        let plotProperty = this.props.plotObject.property;
        let plotPublications = this.props.plotObject.publications;
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
            let publications = []
            for (let i = 0; i < this.props.recount.objectsTaxation.rows.length; i++) {
                let objectTaxation = this.props.recount.objectsTaxation.rows[i];
                publications.push(objectTaxation.publication)                    
            }
            publications = uniq(publications)
            html = this.replaceField(html,'~publications~',publications.toString())

            contents.find('body').html(html)

            let objectTaxationConteiner     = this.findConteiner(contents,'~ot.')//строка с описание объектов таксации
            let objectStepConteiner         = this.findConteiner(contents,'~st.')//строка с описанием ступеней толщины
            let objectTotalStepConteiner    = this.findConteiner(contents,'~ts.')//строка с итогами по ступеням толщины
            let objectTotalValueConteiner   = this.findConteiner(contents,'~tv.')//строка с округленными итогами по объекту
            let objectsFeedratesConteiner   = this.findConteiner(contents,'~fr.')//строка с ставкми платы
            let objectsTotalSummConteiner   = this.findConteiner(contents,'~su.')//строка с округленными итогами по стомости
            let objectsOptionsPlotConteiner = this.findConteiner(contents,'~op.')//строка с параметрами объекта таксации
            //цикл по объекта таксации
            for (let i = 0; i < this.props.recount.objectsTaxation.rows.length; i++) {
                let objectTaxation = this.props.recount.objectsTaxation.rows[i];
                this.feelConteiner(objectTaxationConteiner,objectTaxation)
                //цикл по ступеням
                let steps = this.props.recount.objectsSteps.steps.find(item => item.id == objectTaxation.id);
                if(!steps) continue
                for (let j = 0; j < steps.rows.length; j++) {
                    let objectStep = steps.rows[j];
                    this.feelConteiner(objectStepConteiner,objectStep)
                }
                //итоги по ступеням
                let totalSteps = this.props.recount.objectsSteps.totalSteps.find(item => item.id == objectTaxation.id);
                if(totalSteps){
                    this.feelConteiner(objectTotalStepConteiner,totalSteps.total)
                }
                //округленые итоги по объекту таксации
                let totalValue = this.props.recount.objectsSteps.totalValue.find(item => item.id == objectTaxation.id);
                if(totalValue){
                    this.feelConteiner(objectTotalValueConteiner,totalValue.total)
                }
                //ставки по объекту таксации
                let feedrates = this.props.recount.objectsFeedrates.feedrates.find(item => item.id == objectTaxation.id);
                if(feedrates){
                    this.feelConteiner(objectsFeedratesConteiner,feedrates.row)
                }
                //стоимость по оъекту таксации
                let totalSumm = this.props.recount.objectsFeedrates.totalSumm.find(item => item.id == objectTaxation.id);
                if(totalSumm){
                    this.feelConteiner(objectsTotalSummConteiner,totalSumm.total)
                }
            }
            
            //параметры по объекта таксации
            for (let i = 0; i < this.props.recount.optionsPlots.optionsObjectTaxation.length; i++) {
                let optionsObjectTaxation = this.props.recount.optionsPlots.optionsObjectTaxation[i];
                this.feelConteiner(objectsOptionsPlotConteiner,optionsObjectTaxation)
            }
            

            return
        }
        asyncProcess()
    }

    feelConteiner = (conteiner,data) => {
        if(!conteiner) return
        let row     = conteiner.template.clone(true)
        let html    = row.html()
        for (let key in data) {
            html = this.replaceField(html,conteiner.prefix+key+'~',data[key])
        }
        row.html(html)
        row.appendTo(conteiner.parent)
    }
    
    findConteiner = (contents,prefix) => {
        let conteiner = undefined
        let row_ot         = contents.find('tr:contains("'+prefix+'")')
        if(row_ot.length>0){
            conteiner = { 
                template:   row_ot.clone(true),
                parent:     row_ot.parent(),
                prefix:     prefix
            }
            row_ot.remove()
        }
        return conteiner
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
        recount: state.plot.recount,
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