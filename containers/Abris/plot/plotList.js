import React, { Component, PropTypes } from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import PlotListComponent from "../../../components/Abris/property/plotList";

import {changeMode,deleteObject} from '../../../actions/Abris/objects';


class plotList extends Component {

    constructor(props) {
        super(props);           
    }

    selectItem = (id) => {
        this.props.changeMode(true,this.props.objects[id])
    }

    deleteObject = (id) => {
        this.props.deleteObject(this.props.objects[id])
    }

    render() {
        return (
            <PlotListComponent
                show={this.props.show}
                objectsTree={this.props.objectsTree}
                curentObject={this.props.curentObject}
                handlerCloseListForm={this.props.handlerCloseListForm}
                selectItem          = {this.selectItem}
                deleteObject        = {this.deleteObject}
            />
        )
    }
}


function mapStateToProps (state) {
    return {
        objectsTree: state.polygons.objectsTree,
        objects: state.polygons.objects,
        curentObject: state.polygons.curentObject,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        changeMode: bindActionCreators(changeMode, dispatch),
        deleteObject: bindActionCreators(deleteObject, dispatch),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(plotList)