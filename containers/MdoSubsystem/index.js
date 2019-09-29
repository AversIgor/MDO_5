import React, { Component, PropTypes, Fragment } from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'


import Forestry from '../reference/forestry';
import Subforestry from '../reference/subforestry';
import Tract from '../reference/tract';
import Methodscleanings from '../methodscleanings';
import Cuttingmethods from '../cuttingmethods';
import Publication from '../publication';
import Breed from '../breed';
import Abris from '../Abris';
import Styles from '../styles';
import AbrisSettings from '../AbrisSettings';
import Abrisprintforms from '../abrisprintforms';
import Contactinformation from '../Contactinformation';


import Oldcontent from '../Desktop/oldcontent';
import {RECOUNTLAYOUT} from "../../js/recountlayout";
import {TYPESRATES} from "../../js/typesrates";
import {COEFFICIENTSFORMCUTTING} from "../../js/coefficientsformcutting";
import {COEFFICIENTSRANGESLIQUIDATION} from "../../js/coefficientsrangesliquidation";
import {COEFFICIENTSDAMAGE} from "../../js/coefficientsdamage";
import {CONSTANTS} from "../../js/constants";
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
                    return <Oldcontent
                        module = {TYPESRATES}
                    />;
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



