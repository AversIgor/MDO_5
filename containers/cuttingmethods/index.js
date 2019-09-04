import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ComponentCuttingmethods from "../../components/cuttingmethods";
import {fill_data,add,del,edit,sorting,getFormCutting,getGroupCutting} from "../../actions/reference/cuttingmethods";

class Cuttingmethods extends Component {

    constructor(props) {
        super(props);
        this.state = {
            resize: false
        };
        this.showAllStatus = false
    }

    componentDidMount() {
        let self = this;
        this.props.fill_data({status:0});
        webix.event(window, "resize", function(){
            self.setState({resize: !self.state.resize})
        })
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
    handlerDel = (ids) => {
        this.props.del(ids);
    }
    handlerEdit = (obj,values) => {
        this.props.edit(obj,values);
    }
    handlerSorting = (by,dir,as,id) => {
        this.props.sorting(by,dir,as,id);
    }


    render() {        
        return <ComponentCuttingmethods
            data = {this.props.data}
            sort = {this.props.sort}
            currentId = {this.props.currentId}
            handlerAdd = {this.handlerAdd}
            handlerDel = {this.handlerDel}
            handlerEdit = {this.handlerEdit}
            handlerSorting = {this.handlerSorting}
            handlerShowAllStatus = {this.handlerShowAllStatus}
            getFormCutting = {getFormCutting}
            getGroupCutting = {getGroupCutting}            
        />
    }    
}

function mapStateToProps (state) {
    return {
        data: state.cuttingmethods.data,
        sort: state.cuttingmethods.sort,
        currentId: state.cuttingmethods.currentId
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


