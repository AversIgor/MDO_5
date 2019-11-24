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

    getValueFromId(state,id) {
        let result = ""
        let item = state.find(item => item.id == id);
        if(item){
            result = item.value
        }
        return result
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
            //замена всех возможных переменных
            let forestry = this.getValueFromId(this.props.forestry,plotProperty.location.forestry)
            html = this.stringReplace(html,'~forestry~',forestry)
          
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
    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Printform)