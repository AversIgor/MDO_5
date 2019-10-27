import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ComponentSubforestry from "../../../components/reference/subforestry";
import * as subforestry from "../../../actions/reference/subforestry";
import * as forestry from "../../../actions/reference/forestry";

class Subforestry extends Component {

    constructor(props) {
        super(props);
        this.showAllStatus = false
    }

    componentDidMount() {
        let self = this;
        this.props.fill_data({status:0});
        this.props.fill_data_forestry({status:0})
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
        return <ComponentSubforestry
            forestry = {this.props.forestry}
            data = {this.props.data}
            sort = {this.props.sort}
            currentId = {this.props.currentId}
            handlerAdd = {this.props.add}
            handlerDel = {this.props.del}
            handlerEdit = {this.props.edit}
            handlerSorting = {this.props.sorting}
            handlerShowAllStatus = {this.handlerShowAllStatus}
        />
    }    
}

function mapStateToProps (state) {
    return {
        forestry: state.forestry.data,
        data: state.subforestry.data,
        sort: state.subforestry.sort,
        currentId: state.subforestry.currentId
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fill_data: bindActionCreators(subforestry.fill_data, dispatch),
        fill_data_forestry: bindActionCreators(forestry.fill_data, dispatch),
        add: bindActionCreators(subforestry.add, dispatch),
        del: bindActionCreators(subforestry.del, dispatch),
        edit: bindActionCreators(subforestry.edit, dispatch),
        sorting: bindActionCreators(subforestry.sorting, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Subforestry)