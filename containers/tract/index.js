import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ComponentTract from "../../components/tract";
import * as subforestry from "../../actions/reference/subforestry";
import * as tract from "../../actions/reference/tract";

class Tract extends Component {

    constructor(props) {
        super(props);
        this.state = {
            resize: false
        };
        this.showAllStatus = false
    }

    componentDidMount() {
        let self = this;
        this.props.subforestry_fill_data({status:0});
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
        return <ComponentTract
            subforestry = {this.props.subforestry}
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
        subforestry: state.subforestry.data,
        data: state.tract.data,
        sort: state.tract.sort,
        currentId: state.tract.currentId
    }
}

function mapDispatchToProps(dispatch) {
    return {
        subforestry_fill_data: bindActionCreators(subforestry.fill_data, dispatch),
        fill_data: bindActionCreators(tract.fill_data, dispatch),
        add: bindActionCreators(tract.add, dispatch),
        del: bindActionCreators(tract.del, dispatch),
        edit: bindActionCreators(tract.edit, dispatch),
        sorting: bindActionCreators(tract.sorting, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tract)