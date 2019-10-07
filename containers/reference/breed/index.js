import React, { Component, Fragment  } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ComponentBreed from "../../../components/reference/breed";
import ComponentBreedForm from "../../../components/reference/breed/form";
import * as breed from "../../../actions/reference/breed";
import * as publications from "../../../actions/reference/publications";
import * as tables from "../../../actions/reference/tables";

class Breed extends Component {

    constructor(props) {
        super(props);
        this.state = {
            editObject:undefined
        };
        this.showAllStatus = false
    }

    componentDidMount() {
        this.props.publications_fill_data({status:0});
        this.props.tables_fill_data({status:0});
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


    handlerEdit = (obj,values) => {
        this.props.edit(obj,values);
        this.setState({editObject: undefined})
    }

    handlerEditForm = (obj = undefined) => {
        this.setState({editObject: obj})
    }


    render() {
        return (
        <Fragment>
            <ComponentBreed
                data = {this.props.data}
                sort = {this.props.sort}
                currentId = {this.props.currentId}
                handlerAdd = {this.props.add}
                handlerDel = {this.props.del}
                handlerEdit = {this.handlerEdit}
                handlerEditForm = {this.handlerEditForm}
                handlerSorting = {this.props.sorting}
                handlerShowAllStatus = {this.handlerShowAllStatus}
            />
            <ComponentBreedForm
                publications = {this.props.publications}
                tables = {this.props.tables}
                editObject = {this.state.editObject}
                handlerEdit = {this.handlerEdit}
            />
        </Fragment>)
    }    
}

function mapStateToProps (state) {
    return {
        publications: state.publications.data,
        tables: state.tables.data,
        data: state.breed.data,
        sort: state.breed.sort,
        currentId: state.breed.currentId
    }
}

function mapDispatchToProps(dispatch) {
    return {
        publications_fill_data: bindActionCreators(publications.fill_data, dispatch),
        tables_fill_data: bindActionCreators(tables.fill_data, dispatch),
        fill_data: bindActionCreators(breed.fill_data, dispatch),
        add: bindActionCreators(breed.add, dispatch),
        del: bindActionCreators(breed.del, dispatch),
        edit: bindActionCreators(breed.edit, dispatch),
        sorting: bindActionCreators(breed.sorting, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Breed)


