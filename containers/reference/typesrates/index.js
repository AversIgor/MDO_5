import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ComponentTypesrates from "../../../components/reference/typesrates";
import {fill_data,add,del,edit,sorting} from "../../../actions/reference/typesrates";

class Typesrates extends Component {

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
        return <ComponentTypesrates
            data = {this.props.data}
            sort = {this.props.sort}
            currentId = {this.props.currentId}
            handlerAdd = {this.props.add}
            handlerDel = {this.props.del}
            handlerEdit = {this.props.edit}
            handlerSorting = {this.props.sorting}
            handlerShowAllStatus = {this.handlerShowAllStatus}
            orderRoundingRates = {this.props.orderRoundingRates}
        />
    }    
}

function mapStateToProps (state) {
    return {
        data: state.typesrates.data,
        sort: state.typesrates.sort,
        currentId: state.typesrates.currentId,
        orderRoundingRates: state.enumerations.orderRoundingRates,
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

export default connect(mapStateToProps, mapDispatchToProps)(Typesrates)


