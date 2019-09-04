import React, { Component, Fragment } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ComponentAbrisprintforms from "../../components/abrisprintforms";
import ComponentAbrisprintformsForm from "../../components/abrisprintforms/form";
import {fill_data,add,del,edit,load,save,getVariables,getImages} from "../../actions/reference/abrisprintforms";

class Abrisprintforms extends Component {

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

    handlerAdd = (data) => {
        this.props.add(data);
    }
    handlerDel = (ids) => {
        this.props.del(ids);
	}
	handlerLoad = () => {
		this.props.load();
	}
	handlerSave = (printObject) => {
		this.props.save(printObject);
	}
    handlerEdit = (obj,values) => {
        this.props.edit(obj,values);
        this.setState({editObject: undefined})
    }
    handlerClose = () => {
        this.setState({editObject: undefined})
    }
    handlerEditForm = (obj = undefined) => {
        this.setState({editObject: obj})
    }

    render() {        
        return(
            <Fragment>
                <ComponentAbrisprintforms
                    data = {this.props.data}
                    sort = {this.props.sort}
                    currentId = {this.props.currentId}
                    handlerAdd = {this.handlerAdd}
                    handlerDel = {this.handlerDel}
					handlerEdit = {this.handlerEdit}
					handlerSave={this.handlerSave}
					handlerLoad={this.handlerLoad}
					handlerEdit={this.handlerEdit}
                    handlerEditForm = {this.handlerEditForm}
                    handlerShowAllStatus = {this.handlerShowAllStatus}
                />
                <ComponentAbrisprintformsForm
                    editObject = {this.state.editObject}
                    getVariables = {getVariables}
                    getImages = {getImages}
                    handlerEdit = {this.handlerEdit}
                    handlerClose = {this.handlerClose}
                />

            </Fragment>
        )
    }    
}



function mapStateToProps (state) {
    return {
        data: state.abrisprintforms.data,
        currentId: state.abrisprintforms.currentId
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fill_data: bindActionCreators(fill_data, dispatch),
        add: bindActionCreators(add, dispatch),
        del: bindActionCreators(del, dispatch),
		edit: bindActionCreators(edit, dispatch),
		save: bindActionCreators(save, dispatch),
		load: bindActionCreators(load, dispatch),

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Abrisprintforms)


