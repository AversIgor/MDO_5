import React, { Component} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ComponentSettings from "../../components/settings";
import {fill_data,edit} from "../../actions/settings";


class Settings extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fill_data();
    }

    handlerEdit = (value) => {
        this.props.edit(value);            
    }


    render() {  
        console.log(this.props.settings)      
        return(
           <ComponentSettings
                settings = {this.props.settings}
                enumerations={this.props.enumerations}
                handlerEdit = {this.handlerEdit}
           />
        )
    }    
}

function mapStateToProps (state) {
    return {
        settings: state.settings,
        enumerations: state.enumerations,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fill_data: bindActionCreators(fill_data, dispatch),
        edit: bindActionCreators(edit, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)


