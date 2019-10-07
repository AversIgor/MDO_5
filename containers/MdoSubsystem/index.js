import React, { Component, PropTypes, Fragment } from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'


import Forestry from '../reference/forestry';
import Subforestry from '../reference/subforestry';
import Tract from '../reference/tract';
import Methodscleanings from '../reference/methodscleanings';
import Cuttingmethods from '../reference/cuttingmethods';
import Typesrates from '../reference/typesrates';
import Publication from '../reference/publication';
import Breed from '../reference/breed';
import Feedrates from '../reference/feedrates';
import Abris from '../Abris';
import Styles from '../styles';

import AbrisSettings from '../AbrisSettings';
import Abrisprintforms from '../abrisprintforms';
import Contactinformation from '../Contactinformation';


import Oldcontent from '../Desktop/oldcontent';
import {RECOUNTLAYOUT} from "../../js/recountlayout";
import {COEFFICIENTSFORMCUTTING} from "../../js/coefficientsformcutting";
import {COEFFICIENTSRANGESLIQUIDATION} from "../../js/coefficientsrangesliquidation";
import {COEFFICIENTSDAMAGE} from "../../js/coefficientsdamage";
import {MASTER} from "../../js/master";

class MDOSubsystem extends Component {

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
                case "abrisprintforms":
                    return <Abrisprintforms/>                    
                case "abrissettings":
                    return <AbrisSettings/>
                case "mdo":
                    return <Fragment>
                        <Oldcontent
                            module = {RECOUNTLAYOUT}
                        />
                    </Fragment>;
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
                 case "feedrates":
                        return <Feedrates/>;
                case "coefficientsformcutting":
                    return <Oldcontent
                        module = {COEFFICIENTSFORMCUTTING}
                    />;
                case "coefficientsrangesliquidation":
                    return <Oldcontent
                        module = {COEFFICIENTSRANGESLIQUIDATION}
                    />;
                case "coefficientsdamage":
                    return <Oldcontent
                        module = {COEFFICIENTSDAMAGE}
                    />;
                case "contactinformation":
                    return <Contactinformation/>;
                case "master":
                    return <Oldcontent
                        module = {MASTER}
                    />;
                default:
                    return null;
            }
        };

        return (<div style={this.props.size}><FormContent/></div>)
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

export default connect(mapStateToProps, mapDispatchToProps)(MDOSubsystem)



