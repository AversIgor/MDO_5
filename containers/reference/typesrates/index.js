import React, { Component,Fragment } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ComponentTypesrates from "../../../components/reference/typesrates";
import ComponentFeedratesForm from "../../../components/reference/typesrates/feedrates";
import ComponentCoefficientsrangesliquidationForm from "../../../components/reference/typesrates/coefficientsrangesliquidation";
import ComponentCoefficientsformcuttingForm from "../../../components/reference/typesrates/coefficientsformcutting";
import ComponentCoefficientsdamageForm from "../../../components/reference/typesrates/coefficientsdamage";

import {fill_data,add,del,edit,sorting,fill_regions,fillFeedrates} from "../../../actions/reference/typesrates";
import * as breed from "../../../actions/reference/breed";

class Typesrates extends Component {

    constructor(props) {
        super(props);
        this.showAllStatus = false;
        this.state = {
            openNameTable:"",
            table:[],
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
        if(nextProps.feedrates != this.state.table){
            this.setState({table: nextProps.feedrates}) 
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


    openTable = (curentrow,nameTable) => {
        this.setState({
            openNameTable:nameTable,
            id:curentrow.id,
            region:curentrow.region,
            table:curentrow[nameTable]            
        })  
    }     

    saveTable = (value) => {
        this.props.edit({id:this.state.id},value)
        this.setState({openNameTable: ''})       
    }

    closeTable = () => {
        this.setState({openNameTable: ''})       
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
                    openTable = {this.openTable}
                /> 
                <ComponentFeedratesForm
                    openNameTable = {this.state.openNameTable}
                    table = {this.state.table}
                    breed = {this.props.breed}
                    region = {this.state.region}
                    rankTax = {this.props.rankTax}
                    saveTable = {this.saveTable}
                    closeTable = {this.closeTable}
                    fillFeedrates = {this.props.fillFeedrates}
                />
               <ComponentCoefficientsrangesliquidationForm
                    openNameTable = {this.state.openNameTable}
                    table = {this.state.table}
                    rangesLiquidation = {this.props.rangesLiquidation}                    
                    saveTable = {this.saveTable}
                    closeTable = {this.closeTable}
                />
                <ComponentCoefficientsformcuttingForm
                    openNameTable = {this.state.openNameTable}
                    table = {this.state.table}
                    formCutting = {this.props.formCutting}                    
                    saveTable = {this.saveTable}
                    closeTable = {this.closeTable}
                />
                <ComponentCoefficientsdamageForm
                    openNameTable = {this.state.openNameTable}
                    table = {this.state.table}
                    damage = {this.props.damage}                    
                    saveTable = {this.saveTable}
                    closeTable = {this.closeTable}
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
        formCutting: state.enumerations.formCutting,
        damage: state.enumerations.damage,
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


