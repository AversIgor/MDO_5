import React, { Component,Fragment } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ComponentTypesrates from "../../../components/reference/typesrates";
import ComponentFeedratesForm from "../../../components/reference/typesrates/feedrates";
import ComponentCoefficientsrangesliquidationForm from "../../../components/reference/typesrates/coefficientsrangesliquidation";
import {fill_data,add,del,edit,sorting,fill_regions,fillFeedrates} from "../../../actions/reference/typesrates";
import * as breed from "../../../actions/reference/breed";

class Typesrates extends Component {

    constructor(props) {
        super(props);
        this.showAllStatus = false;
        this.state = {
            openfeedrates:false,
            feedrates:[],
            opencoefficientsrangesliquidation:false,
            coefficientsrangesliquidation:[],
            id:undefined,
            region:undefined,
        };
   }

    componentDidMount() {
        this.props.fill_data({status:0});
        this.props.breed_fill_data({status:0});
        this.props.fill_regions();
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.feedrates != this.state.feedrates){
            this.setState({feedrates: nextProps.feedrates}) 
        }
        
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
            openfeedrates:true,
            id:curentrow.id,
            region:curentrow.region,
            feedrates:curentrow.feedrates            
        })       
    }
    saveFeedrates = (value) => {
        this.props.edit({id:this.state.id},value)
        this.setState({openfeedrates: false})       
    }

    closeFeedrates = () => {
        this.setState({ openfeedrates: false})       
    }

    openCoefficientsrangesliquidation = (curentrow) => {
        this.setState({
            opencoefficientsrangesliquidation:true,
            id:curentrow.id,
            region:curentrow.region,
            coefficientsrangesliquidation:curentrow.coefficientsrangesliquidation            
        })       
    }

    render() {      
        return (
            <Fragment>
                <ComponentTypesrates
                    data = {this.props.data}
                    currentId = {this.props.currentId}
                    regions = {this.props.regions}
                    sort = {this.props.sort}
                    handlerAdd = {this.props.add}
                    handlerDel = {this.props.del}
                    handlerEdit = {this.props.edit}
                    handlerSorting = {this.props.sorting}
                    handlerShowAllStatus = {this.handlerShowAllStatus}
                    orderRoundingRates = {this.props.orderRoundingRates}
                    openFeedrates = {this.openFeedrates}
                    openCoefficientsrangesliquidation = {this.openCoefficientsrangesliquidation}
                /> 
                <ComponentFeedratesForm
                    openfeedrates = {this.state.openfeedrates}
                    id = {this.state.id}
                    feedrates = {this.state.feedrates}
                    breed = {this.props.breed}
                    region = {this.state.region}
                    rankTax = {this.props.rankTax}
                    saveFeedrates = {this.saveFeedrates}
                    closeFeedrates = {this.closeFeedrates}
                    fillFeedrates = {this.props.fillFeedrates}
                />
                <ComponentCoefficientsrangesliquidationForm
                    opencoefficientsrangesliquidation = {this.state.opencoefficientsrangesliquidation}
                    openfeedrates = {this.state.openfeedrates}
                    coefficientsrangesliquidation = {this.state.coefficientsrangesliquidation}
                    rangesLiquidation = {this.props.rangesLiquidation}
                    //saveFeedrates = {this.saveFeedrates}
                    //closeFeedrates = {this.closeFeedrates}
                />
            </Fragment>
        )
    }

}


function mapStateToProps (state) {
    return {
        data: state.typesrates.data,
        regions: state.typesrates.regions,
        feedrates: state.typesrates.feedrates,
        currentId: state.typesrates.currentId,
        sort: state.typesrates.sort,
        breed: state.breed.data,
        rankTax: state.enumerations.rankTax,        
        orderRoundingRates: state.enumerations.orderRoundingRates,
        rangesLiquidation: state.enumerations.rangesLiquidation,
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


