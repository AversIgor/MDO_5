import React, { Component} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ComponentSettings from "../../components/settings";
import {fill_data,edit,dumpDB,restoreDB} from "../../actions/settings";


class Settings extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fill_data();
    }

    handlerEdit = (fields,value) => {
        let neValue = {...this.props.settings,
            fields:value            
        }
        this.props.edit(value);            
    }


    render() {
        return(
           <ComponentSettings
                settings = {this.props.settings}
                enumerations={this.props.enumerations}
                handlerEdit = {this.handlerEdit}
                dumpDB={this.props.dumpDB}
                restoreDB={this.props.restoreDB}
           />
        )
    }    
}

function mapStateToProps (state) {
    return {
        settings: state.settings.data,
        enumerations: state.enumerations,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fill_data: bindActionCreators(fill_data, dispatch),
        edit: bindActionCreators(edit, dispatch),
        dumpDB: bindActionCreators(dumpDB, dispatch),
        restoreDB: bindActionCreators(restoreDB, dispatch),
    }    
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)


