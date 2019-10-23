import React, { Component, PropTypes } from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import PlotPropertyComponent from "../../../components/Abris/property/plotPropertry";
import {editContourFromTable,contourDelete,contourAdd,chengeTypeangle,clearCurentObject,changeMode,contourCorrect,contourUnite,editStyle,nameCorrect,nonexploitationareaCorrect,ctrl_z} from '../../../actions/Abris/objects';
import {fill_data,edit} from '../../../actions/reference/styles';
import * as settings from '../../../actions/settings';



class PlotProperty extends Component {

    constructor(props) {
        super(props);
        this.state = {
            styleId: undefined,
        };
    }

    handlerpcontourEdit = () => {
        this.props.editContourFromTable(this.props.curentObject)
    }
   
    handlerpcontourCorrect = () => {
        this.props.contourCorrect(this.props.curentObject)
    }

    handlerpcontourDelete = (index) => {
        this.props.contourDelete(this.props.curentObject,index)
    }
    handlerpcontourAdd = () => {
        this.props.contourAdd(this.props.curentObject)
    }
    
    handlerpChengeTypeangle = (typeangle) => {
        this.props.chengeTypeangle(this.props.curentObject,typeangle)
    }

    handlercontourUnite = (index) => {
        if(!this.props.curentObject) return
        this.props.contourUnite(this.props.curentObject,index)
    }

    handlerEditStyle = (styleId,style) => {
        if(!this.props.curentObject) return
        if(styleId){
            for (var i = 0; i < this.props.styles.length; i++) {
                if(this.props.styles[i].id == styleId ){
                    style =  JSON.parse(this.props.styles[i].style)
                    break
                }
            }
        }else{
            styleId = this.props.curentObject.styleId
        }
        this.props.editStyle(this.props.curentObject,styleId,style)
    }

    handlerUpdateStyle = (styleId,style) => {
        if(!this.props.curentObject) return
        let value = {
            style:JSON.stringify(this.props.curentObject.style)
        }
        this.props.edit(this.props.curentObject.styleId,value)

    }

    handlernameCorrect = (newName) => {
        if(!this.props.curentObject) return
        this.props.nameCorrect(this.props.curentObject,newName)
    }

    handlernonexploitationareaCorrect = (value) => {
        if(!this.props.curentObject) return
        this.props.nonexploitationareaCorrect(this.props.curentObject,value)
    }

    handlernChangeMode = () => {
        if(this.props.mode == 1){
            this.props.changeMode(0,this.props.curentObject)
        }else{
            this.props.changeMode(1,this.props.curentObject)
        }
    }

    componentDidMount(){
        this.props.fill_data()
        this.props.settings_fill_data()
    }


    render() {
        return (
                <PlotPropertyComponent
                    contourEdit={this.handlerpcontourEdit}
                    contourDelete={this.handlerpcontourDelete}
                    contourAdd={this.handlerpcontourAdd}
                    contourCorrect={this.handlerpcontourCorrect}
                    nameCorrect={this.handlernameCorrect}
                    nonexploitationareaCorrect={this.handlernonexploitationareaCorrect}
                    contourUnite={this.handlercontourUnite}
                    chengeTypeangle={this.handlerpChengeTypeangle}
                    editStyle={this.handlerEditStyle}
                    updateStyle={this.handlerUpdateStyle}
                    handlernChangeMode={this.handlernChangeMode}
                    clearCurentObject={this.props.clearCurentObject}
                    changeMode={this.props.changeMode}
                    curentObject={this.props.curentObject}
                    mode={this.props.mode}
                    typesAngle={this.props.typesAngle}
                    directs={this.props.directs}
                    ctrl_z={this.props.ctrl_z}
                    styles={this.props.styles}
                />
        )
    }
}


function mapStateToProps (state) {
    return {
        curentObject: state.polygons.curentObject,
        mode: state.polygons.mode,
        styles: state.styles.data,
        typesAngle: state.enumerations.typesAngle,
        directs: state.enumerations.directs,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        editContourFromTable: bindActionCreators(editContourFromTable, dispatch),
        contourDelete: bindActionCreators(contourDelete, dispatch),
        contourAdd: bindActionCreators(contourAdd, dispatch),
        contourCorrect: bindActionCreators(contourCorrect, dispatch),
        nameCorrect: bindActionCreators(nameCorrect, dispatch),
        nonexploitationareaCorrect: bindActionCreators(nonexploitationareaCorrect, dispatch),
        contourUnite: bindActionCreators(contourUnite, dispatch),
        chengeTypeangle: bindActionCreators(chengeTypeangle, dispatch),
        clearCurentObject: bindActionCreators(clearCurentObject, dispatch),
        changeMode: bindActionCreators(changeMode, dispatch),
        editStyle: bindActionCreators(editStyle, dispatch),
        ctrl_z: bindActionCreators(ctrl_z, dispatch),
        fill_data: bindActionCreators(fill_data, dispatch),
        settings_fill_data: bindActionCreators(settings.fill_data, dispatch),
        edit: bindActionCreators(edit, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlotProperty)