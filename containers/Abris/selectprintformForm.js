import React, { Component, PropTypes, Fragment} from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'

import Selectprintform from "../../components/Abris/selectprintform";
import Saveaspng from "../../components/Abris/printforms/saveaspng";
import Printform from "../../containers/Abris/printforms/printform";
import {fill_data} from "../../actions/reference/printforms";


class SelectprintformForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            saveaspng: false,
            id: undefined,
        };
    }

    //печать в изображение
    handlerOpen_saveaspng = () => {
        this.setState({saveaspng: true})
    }
    
    handlerClose_saveaspng = () => {
        this.setState({saveaspng: false})
    }


    handlerOpenPrintForm = (id) => {        
        this.setState({id: id})
    }

    handlerCloserintForm = () => {
        this.setState({id: undefined})
    }


    componentDidMount() {
        this.props.fill_data({status:0});
    }


    render() {

        let data = [
            { id:1, title:"Сохранить абрис в файл"},
        ]
        for (let i = 0; i < this.props.printforms.length; i++) {
            data.push({ id:this.props.printforms[i].id, title:this.props.printforms[i].name})
        }

        return (
            <Fragment>
                <Selectprintform
                    show={this.props.show}
                    handlerCloseSelectPrintForm={this.props.handlerCloseSelectPrintForm}
                    handlerOpen_saveaspng={this.handlerOpen_saveaspng}
                    handlerOpen_567={this.handlerOpen_567}
                    handlerOpenPrintForm={this.handlerOpenPrintForm}
                    data={data}
                />
                <Saveaspng
                    show={this.state.saveaspng}
                    handlerClose={this.handlerClose_saveaspng}
                    opacity={this.props.opacity}
                    rotate={this.props.rotate}
                />
                <Printform
                    id={this.state.id}
                    printforms={this.props.printforms}                    
                    handlerClose={this.handlerCloserintForm}
                />
            </Fragment>
        )
    }
}

function mapStateToProps (state) {
    return {
        opacity: state.background.opacity,
        rotate: state.background.rotate,
        printforms: state.printforms.data,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fill_data: bindActionCreators(fill_data, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectprintformForm)




