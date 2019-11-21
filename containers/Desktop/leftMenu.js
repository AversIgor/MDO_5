import React, { Component, PropTypes, Fragment } from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'

import logo from '../../img/logo-w-big.png'

import Plot from '../plot';
import Forestry from '../reference/forestry';
import Subforestry from '../reference/subforestry';
import Tract from '../reference/tract';
import Methodscleanings from '../reference/methodscleanings';
import Cuttingmethods from '../reference/cuttingmethods';
import Typesrates from '../reference/typesrates';
import Publication from '../reference/publication';
import Breed from '../reference/breed';
import Printforms from '../reference/printforms';
import Abris from '../Abris';
import Styles from '../styles';

import Settings from '../settings';



class LeftMenu extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        
        let FormContent = () => {
            switch(this.props.leftMenu.id) {
                case "abrisv2":
                    return <Abris/>;
                case "methodscleanings":
                    return <Methodscleanings/>;
                case "styles":
                    return <Styles/>
                case "printforms":
                    return <Printforms/>                    
                case "settings":
                    return <Settings/>
                case "plot":
                    return <Plot/>                   
                case "forestry":
                    return <Forestry/>
                case "subforestry":
                    return <Subforestry/>
                case "tract":
                    return <Tract/>
                case "cuttingmethods":
                    return <Cuttingmethods/>;
                case "breed":
                   return <Breed/>;
                case "publications":
                    return <Publication/>;
                case "typesrates":
                    return <Typesrates/>;
                default:
                    return <div style={{...this.props.style,
                        backgroundColor: "darkgray",
                        textAlign: "center",
                        display: "table-cell",
                        verticalAlign: "middle"                    
                    }}><img src={logo} /></div>;
            }
        };

        return (<div style={this.props.style}><FormContent/></div>)
    }
}

function mapStateToProps (state) {
    return {
        leftMenu:state.leftMenu,
    }
}

function mapDispatchToProps(dispatch) {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftMenu)



