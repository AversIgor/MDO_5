import React, { Component, PropTypes, Fragment } from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'

import {creatLeftMenu,clickLeftMenu} from '../../actions/MdoSubsystem';
import Forestry from '../forestry';
import Subforestry from '../subforestry';
import Tract from '../tract';
import Methodscleanings from '../methodscleanings';
import Cuttingmethods from '../cuttingmethods';
import Publication from '../publication';
import Breed from '../breed';
import Abris from '../Abris';
import Styles from '../styles';
import AbrisSettings from '../AbrisSettings';
import Abrisprintforms from '../abrisprintforms';


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

    componentDidMount(){
        this.props.creatLeftMenu(this.props.clickLeftMenu)
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
                case "constants":
                    return <Oldcontent
                        module = {CONSTANTS}
                    />;
                case "master":
                    return <Oldcontent
                        module = {MASTER}
                    />;
                default:
                    return null;
            }
        };

        return (<FormContent/>)
    }
}

function mapStateToProps (state) {
    return {
        leftMenu:state.leftMenu,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        creatLeftMenu: bindActionCreators(creatLeftMenu, dispatch),
        clickLeftMenu: bindActionCreators(clickLeftMenu, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MDOSubsystem)



