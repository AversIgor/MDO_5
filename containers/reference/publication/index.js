import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ComponentPublications from "../../../components/reference/publications";
import {fill_data,add,del,edit,sorting,fill_listPublication} from "../../../actions/reference/publications";

class Publications extends Component {

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
        this.props.fill_listPublication()
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

    handlerAdd = (id) => {
        this.props.add(id);
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
        return <ComponentPublications
            data = {this.props.data}
            sort = {this.props.sort}
            currentId = {this.props.currentId}
            listPublication = {this.props.listPublication}
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
        data: state.publications.data,
        sort: state.publications.sort,
        listPublication: state.publications.listPublication,
        currentId: state.publications.currentId
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fill_data: bindActionCreators(fill_data, dispatch),
        add: bindActionCreators(add, dispatch),
        del: bindActionCreators(del, dispatch),
        edit: bindActionCreators(edit, dispatch),
        sorting: bindActionCreators(sorting, dispatch),
        fill_listPublication: bindActionCreators(fill_listPublication, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Publications)


