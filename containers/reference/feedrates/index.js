import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

//import ComponentCuttingmethods from "../../../components/reference/cuttingmethods";
import {fill_data,add,del,edit,sorting} from "../../../actions/reference/feedrates";
import * as breed from "../../../actions/reference/breed";
import * as typesrates from "../../../actions/reference/typesrates";

class Feedrates extends Component {

    constructor(props) {
        super(props);
        this.showAllStatus = false
    }

    componentDidMount() {
        this.props.breed_fill_data({status:0});
        this.props.typesrates_fill_data({status:0});
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
        console.log(this.props.data,this.props.typesrates,this.props.breed)

        
        return null    
       /* return <ComponentCuttingmethods
            data = {this.props.data}
            sort = {this.props.sort}
            currentId = {this.props.currentId}
            handlerAdd = {this.props.add}
            handlerDel = {this.props.del}
            handlerEdit = {this.props.edit}
            handlerSorting = {this.props.sorting}
            handlerShowAllStatus = {this.handlerShowAllStatus}
            typesrates = {this.props.typesrates}
            breed = {this.props.breed}   
            rankTax = {this.props.rankTax}          
        />*/
    }    
}

function mapStateToProps (state) {
    return {
        data: state.feedrates.data,
        sort: state.feedrates.sort,
        currentId: state.feedrates.currentId,
        typesrates: state.typesrates.options,
        breed: state.breed.options,
        rankTax: state.enumerations.rankTax
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fill_data: bindActionCreators(fill_data, dispatch),
        breed_fill_data: bindActionCreators(breed.fill_data, dispatch),
        typesrates_fill_data: bindActionCreators(typesrates.fill_data, dispatch),
        add: bindActionCreators(add, dispatch),
        del: bindActionCreators(del, dispatch),
        edit: bindActionCreators(edit, dispatch),
        sorting: bindActionCreators(sorting, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Feedrates)


