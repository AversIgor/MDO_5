import React, { Component} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ComponentContactinformation from "../../components/Contactinformation";
import {fill_data,edit} from "../../actions/reference/contactinformation";


class Contactinformation extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(){
        this.props.fill_data()
    }

    render() {   
        return(
           <ComponentContactinformation
                data = {this.props.data}
                handlerEdit = {this.props.edit}
           />
        )
    }    
}

function mapStateToProps (state) {    
    return {
        data: state.contactinformation.data,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fill_data: bindActionCreators(fill_data, dispatch),
        edit: bindActionCreators(edit, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Contactinformation)


