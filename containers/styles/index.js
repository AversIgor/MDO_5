import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ComponentStyles from "../../components/styles";
import ComponentStylesForm from "../../components/styles/form";
import {fill_data,add,del,edit,sorting} from "../../actions/reference/styles";

class Styles extends Component {

    constructor(props) {
        super(props);
        this.state = {
            resize: false,
            editObject:undefined
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
        this.setState({editObject: undefined})
    }
    handlerSorting = (by,dir,as,id) => {
        this.props.sorting(by,dir,as,id);
    }
    handlerEditForm = (obj = undefined) => {
        this.setState({editObject: obj})
    }

    render() {        
        return(
            <Fragment>
                <ComponentStyles
                    data = {this.props.data}
                    sort = {this.props.sort}
                    currentId = {this.props.currentId}
                    handlerAdd = {this.handlerAdd}
                    handlerDel = {this.handlerDel}
                    handlerEdit = {this.handlerEdit}
                    handlerSorting = {this.handlerSorting}
                    handlerEditForm = {this.handlerEditForm}
                    handlerShowAllStatus = {this.handlerShowAllStatus}
                />
                <ComponentStylesForm
                    editObject = {this.state.editObject}
                    handlerEdit = {this.handlerEdit}
                />
            </Fragment>
        )
    }    
}

function mapStateToProps (state) {
    return {
        data: state.styles.data,
        sort: state.styles.sort,
        currentId: state.styles.currentId
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

export default connect(mapStateToProps, mapDispatchToProps)(Styles)


