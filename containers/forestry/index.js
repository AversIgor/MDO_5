import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ComponentForestry from "../../components/forestry";
import {fill_data,add,del,edit,sorting} from "../../actions/reference/forestry";

class Forestry extends Component {

    constructor(props) {
        super(props);
        this.showAllStatus = false
    }

    componentDidMount() {
        let self = this;
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

    handlerAdd = () => {
        this.props.add();
    }
    handlerDel = () => {
        this.props.del();
    }
    handlerEdit = (obj,values) => {
        this.props.edit(obj,values);
    }
    handlerSorting = (by,dir,as,id) => {
        this.props.sorting(by,dir,as,id);
    }


    render() {        
        return <ComponentForestry
            data = {this.props.data}
            sort = {this.props.sort}
            currentId = {this.props.currentId}
            handlerAdd = {this.handlerAdd}
            handlerDel = {this.handlerDel}
            handlerEdit = {this.handlerEdit}
            handlerSorting = {this.handlerSorting}
            handlerShowAllStatus = {this.handlerShowAllStatus}
        />
    }    
}

function mapStateToProps (state) {
    return {
        data: state.forestry.data,
        sort: state.forestry.sort,
        currentId: state.forestry.currentId
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

export default connect(mapStateToProps, mapDispatchToProps)(Forestry)


