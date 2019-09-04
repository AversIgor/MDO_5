import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ComponentSubforestry from "../../components/subforestry";
import * as forestry from "../../actions/reference/forestry";
import * as subforestry from "../../actions/reference/subforestry";

class Subforestry extends Component {

    constructor(props) {
        super(props);
        this.state = {
            resize: false
        };
        this.showAllStatus = false
    }

    componentDidMount() {
        let self = this;
        this.props.forestry_fill_data({status:0});
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
        return <ComponentSubforestry
            forestry = {this.props.forestry}
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
        forestry: state.forestry.data,
        data: state.subforestry.data,
        sort: state.subforestry.sort,
        currentId: state.subforestry.currentId
    }
}

function mapDispatchToProps(dispatch) {
    return {
        forestry_fill_data: bindActionCreators(forestry.fill_data, dispatch),
        fill_data: bindActionCreators(subforestry.fill_data, dispatch),
        add: bindActionCreators(subforestry.add, dispatch),
        del: bindActionCreators(subforestry.del, dispatch),
        edit: bindActionCreators(subforestry.edit, dispatch),
        sorting: bindActionCreators(subforestry.sorting, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Subforestry)


