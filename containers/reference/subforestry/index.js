import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ComponentSubforestry from "../../../components/reference/subforestry";
import * as subforestry from "../../../actions/reference/subforestry";

class Subforestry extends Component {

    constructor(props) {
        super(props);
        this.showAllStatus = false
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
            forestry = {this.props.options}
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
        options: state.forestry.options,
        data: state.subforestry.data,
        sort: state.subforestry.sort,
        currentId: state.subforestry.currentId
    }
}

function mapDispatchToProps(dispatch) {
    return {
        add: bindActionCreators(subforestry.add, dispatch),
        del: bindActionCreators(subforestry.del, dispatch),
        edit: bindActionCreators(subforestry.edit, dispatch),
        sorting: bindActionCreators(subforestry.sorting, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Subforestry)