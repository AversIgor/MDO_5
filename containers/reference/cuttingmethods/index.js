import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ComponentCuttingmethods from "../../../components/reference/cuttingmethods";
import {fill_data,add,del,edit,sorting} from "../../../actions/reference/cuttingmethods";

class Cuttingmethods extends Component {

    constructor(props) {
        super(props);
        this.showAllStatus = false
    }

    componentDidMount() {
        this.props.fill_data({status:0});
    }

    handlerShowAllStatus = () => {
        this.showAllStatus = !this.showAllStatus
        if(this.showAllStatus){
            this.props.fill_data();
        }else {
            this.props.fill_data({status:0});
        }
    }

    render() {        
        return <ComponentCuttingmethods
            data = {this.props.data}
            sort = {this.props.sort}
            currentId = {this.props.currentId}
            handlerAdd = {this.props.add}
            handlerDel = {this.props.del}
            handlerEdit = {this.props.edit}
            handlerSorting = {this.props.sorting}
            handlerShowAllStatus = {this.handlerShowAllStatus}
            formCutting = {this.props.formCutting}
            groupCutting = {this.props.groupCutting}            
        />
    }    
}

function mapStateToProps (state) {
    return {
        data: state.cuttingmethods.data,
        sort: state.cuttingmethods.sort,
        currentId: state.cuttingmethods.currentId,
        formCutting: state.enumerations.formCutting,
        groupCutting: state.enumerations.groupCutting
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fill_data: bindActionCreators(fill_data, dispatch),
        add: bindActionCreators(add, dispatch),
        del: bindActionCreators(del, dispatch),
        edit: bindActionCreators(edit, dispatch),
        sorting: bindActionCreators(sorting, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cuttingmethods)


