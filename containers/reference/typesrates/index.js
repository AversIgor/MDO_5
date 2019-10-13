import React, { Component,Fragment } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ComponentTypesrates from "../../../components/reference/typesrates";
import ComponentFeedratesForm from "../../../components/reference/typesrates/feedrates";
import {fill_data,add,del,edit,sorting,fill_regions,fillFeedrates} from "../../../actions/reference/typesrates";
import * as breed from "../../../actions/reference/breed";

class Typesrates extends Component {

    constructor(props) {
        super(props);
        this.showAllStatus = false;
        this.state = {
            feedrates:undefined
        };
   }

    componentDidMount() {
        this.props.fill_data({status:0});
        this.props.breed_fill_data({status:0});
        this.props.fill_regions();
    }



    handlerShowAllStatus = () => {
        this.showAllStatus = !this.showAllStatus
        if(this.showAllStatus){
            this.props.fill_data();
        }else {
            this.props.fill_data({status:0});
        }
    }

    openFeedrates = (curentrow) => {
        this.setState({
            feedrates: {
            id:curentrow.id,
            region:curentrow.region,
            feedrates:curentrow.feedrates
            }
        })       
    }

    saveFeedrates = (row,value) => {
        this.props.edit(row,value)
        this.setState({
            feedrates: undefined})       
    }

    closeFeedrates = () => {
        this.setState({ feedrates: undefined})       
    }


    render() {      
        return (
            <Fragment>
                <ComponentTypesrates
                    data = {this.props.data}
                    regions = {this.props.regions}
                    sort = {this.props.sort}
                    handlerAdd = {this.props.add}
                    handlerDel = {this.props.del}
                    handlerEdit = {this.props.edit}
                    handlerSorting = {this.props.sorting}
                    handlerShowAllStatus = {this.handlerShowAllStatus}
                    orderRoundingRates = {this.props.orderRoundingRates}
                    openFeedrates = {this.openFeedrates}
                /> 
                <ComponentFeedratesForm
                    feedrates = {this.state.feedrates}
                    breed = {this.props.breed}
                    regions = {this.props.regions}
                    rankTax = {this.props.rankTax}
                    saveFeedrates = {this.saveFeedrates}
                    closeFeedrates = {this.closeFeedrates}
                    fillFeedrates = {this.props.fillFeedrates}
                    />
            </Fragment>
        )
    }

}


function mapStateToProps (state) {
    return {
        data: state.typesrates.data,
        regions: state.typesrates.regions,
        sort: state.typesrates.sort,
        breed: state.breed.data,
        rankTax: state.enumerations.rankTax,        
        orderRoundingRates: state.enumerations.orderRoundingRates,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fill_data: bindActionCreators(fill_data, dispatch),
        fill_regions:bindActionCreators(fill_regions, dispatch),
        fillFeedrates:bindActionCreators(fillFeedrates, dispatch),
        breed_fill_data: bindActionCreators(breed.fill_data, dispatch),
        add: bindActionCreators(add, dispatch),
        del: bindActionCreators(del, dispatch),
        edit: bindActionCreators(edit, dispatch),
        sorting: bindActionCreators(sorting, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Typesrates)


