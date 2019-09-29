import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ComponentTract from "../../../components/reference/tract";
import * as tract from "../../../actions/reference/tract";
import * as subforestry from "../../../actions/reference/subforestry";

class Tract extends Component {

    constructor(props) {
        super(props);
        this.showAllStatus = false
    }

    componentDidMount() {
        let self = this;
        this.props.fill_data({status:0});
        this.props.fill_data_subforestry({status:0})
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
        return <ComponentTract
            subforestry = {this.props.options}
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
        options: state.subforestry.options,
        data: state.tract.data,
        sort: state.tract.sort,
        currentId: state.tract.currentId
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fill_data: bindActionCreators(tract.fill_data, dispatch),
        fill_data_subforestry: bindActionCreators(subforestry.fill_data, dispatch),
        add: bindActionCreators(tract.add, dispatch),
        del: bindActionCreators(tract.del, dispatch),
        edit: bindActionCreators(tract.edit, dispatch),
        sorting: bindActionCreators(tract.sorting, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tract)