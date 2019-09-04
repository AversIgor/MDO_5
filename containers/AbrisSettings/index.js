import React, { Component} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ComponentAbrisSettings from "../../components/AbrisSettings";
import {fill_data,edit} from "../../actions/Abris/settings";
import {getTypeangle} from "../../actions/Abris/objects";
import {getRoundingSquare,getRoundingAngle,getRoundingLengths} from "../../actions/Abris/settings";


class AbrisSettings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            resize: false,
        };
    }

    componentDidMount() {
        let self = this;
        this.props.fill_data();
        webix.event(window, "resize", function(){
            self.setState({resize: !self.state.resize})
        })
    }

    handlerEdit = (struct) => {
        if(this.props.data.length>0){
            let value = {
                settings:JSON.stringify(struct)
            }            
            this.props.edit(this.props.data[0].id,value);            
        }
    }


    render() {        
        return(
           <ComponentAbrisSettings
                data = {this.props.data}
                getTypeangle = {getTypeangle}
                getRoundingSquare = {getRoundingSquare}
                getRoundingAngle = {getRoundingAngle}
                getRoundingLengths = {getRoundingLengths}
                handlerEdit = {this.handlerEdit}
           />
        )
    }    
}

function mapStateToProps (state) {
    return {
        data: state.abris_settings.data,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fill_data: bindActionCreators(fill_data, dispatch),
        edit: bindActionCreators(edit, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AbrisSettings)


