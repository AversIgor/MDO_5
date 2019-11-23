import React, { Component, PropTypes, Fragment} from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'

import ComponentOverlay from "../../components/Abris/overlay";
import Backgroundloadform from "../../components/Abris/backgroundloadform";
import Zoom from "../../components/Abris/zoom";
import Rotate from "../../components/Abris/rotate";
import Scale from "../../components/Abris/scale";
import Opacity from "../../components/Abris/opacity";
import Calibrate from "../../components/Abris/calibrate";
import Gpsbinding from "../../components/Abris/gpsbinding";
import MagneticDeclination from "../../components/Abris/magneticdeclination";
import Printforms from "./printform";
import PlotProperty from "./plot/plotProperty";
import PlotList from "./plot/plotList";
import {load,clear,setZoom,setRotate,setScale,getScaleArray,setOpacity,setCoefficientCalibrate,clearCoefficientCalibrate,setGpsCoordinate,setMagneticDeclination} from '../../actions/Abris/background';
import {creatObject,changeMode,calcGpsCoords,editConturMagneticDeclination,saveGeoJson,loadGeoJson} from '../../actions/Abris/objects';
import {saveAsImage} from '../../actions/Abris/print';


class Overlay extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loadform: false,
            zoomForm: false,
            rotateForm: false,
            scaleForm: false,
            listForm:false,
            opacityForm:false,
            openSelectPrintForm:false,
        };
    }

    //кнопка загрузки подложки
    handlerBackground = (param = true) => {
       if(param){
            this.setState({loadform: true})
       }else{           
            this.props.clear();
       }
    }
    handlerCloseLoadForm = () => {
        this.setState({loadform: false})
    }

    //кнопка зума
    handlerOpenZoomForm = () => {
        this.setState({zoomForm: !this.state.zoomForm})
    }
    handlerCloseZoomForm = () => {
        this.setState({zoomForm: false})
    }

    //кнопка поворота
    handlerOpenRotateForm = () => {
        this.setState({rotateForm: !this.state.rotateForm})
    }
    handlerCloseRotateForm = () => {
        this.setState({rotateForm: false})
    }

    //кнопка масштаба
    handlerOpenScaleForm = () => {
        this.setState({scaleForm: true})
    }
    
    handlerCloseScaleForm = () => {
        this.setState({scaleForm: false})
    }

    //кнопка прозрачности
    handlerOpenOpacityForm = () => {
        this.setState({opacityForm: true})
    }
    handlerCloseOpacityForm = () => {
        this.setState({opacityForm: false})
    }

    handlerСreatObject = () => {
        this.props.creatObject()
    }

    handlerOpenListForm = () => {
        this.setState({listForm: true})
    }
    
    handlerCloseListForm = () => {
        this.setState({listForm: false})
	}
	
	//режим GPS
	handlerGpsBinding = () => {
        this.props.changeMode(3)
	}
	handlerGpsComplete = (x,y) => {
		this.props.setGpsCoordinate(x,y);
        this.props.changeMode(1);
	}
	handlerGpsHide = () => {
		this.props.calcGpsCoords(this.props.gps, this.props.polygons)
	}

    //режим калиброки
    handlerCalibrate = () => {
        this.props.changeMode(2)
	}

    handlerChangeMode = () => {
        if(this.props.mode == 0){
            this.props.changeMode(1,this.props.curentObject)
        }else {
            this.props.changeMode(0,this.props.curentObject)
        }
    }

    handlerClearCalibrate = () => {
        this.props.clearCoefficientCalibrate(this.props.calibrate)
    }


    //режим магнитного склонения
    handlerMagneticDeclination = () => {
        this.props.changeMode(4)
    }
    handlerMagneticDeclinationComplete = (magneticdeclination) => {
        this.props.setMagneticDeclination(magneticdeclination);
        this.props.editConturMagneticDeclination(magneticdeclination);        
        this.props.changeMode(1);
    }

    handlerSaveGeoJson = () => {
        this.props.saveGeoJson();
    }

    handlerLoadGeoJson = () => {
        this.props.loadGeoJson();
    }

    handlerOpenCloseSelectPrintForm = (param) => {
        this.setState({openSelectPrintForm: param})
    }

    handlersetCoefficientCalibrate = (distance) => {
        if(distance){
            this.props.setCoefficientCalibrate(distance,this.props.calibrate,this.props.coefficientcalibrate);
        }
        this.props.changeMode(1);
    }   

    render() {
       
         return (
            <Fragment>
                <ComponentOverlay
                    container                   = {this.props.container}
                    src                         = {this.props.src}
                    zoom                        = {this.props.zoom}
                    rotate                      = {this.props.rotate}
                    scale                       = {this.props.scale}
                    opacity                     = {this.props.opacity}
                    mode                        = {this.props.mode}
                    curentObject                = {this.props.curentObject}
                    handlerBackground           = {this.handlerBackground}
                    handlerChangeMode           = {this.handlerChangeMode}
                    handlerOpenZoomForm         = {this.handlerOpenZoomForm}
                    handlerOpenRotateForm       = {this.handlerOpenRotateForm}
                    handlerOpenScaleForm        = {this.handlerOpenScaleForm}
                    handlerOpenOpacityForm      = {this.handlerOpenOpacityForm}
                    handlerСreatObject          = {this.handlerСreatObject}
                    handlerOpenListForm         = {this.handlerOpenListForm}
					handlerCalibrate            = {this.handlerCalibrate}
					handlerGpsBinding			= {this.handlerGpsBinding}
                    handlerMagneticDeclination	= {this.handlerMagneticDeclination}
                    handlerClearCalibrate       = {this.handlerClearCalibrate}                    
                    handlerOpenCloseSelectPrintForm      = {this.handlerOpenCloseSelectPrintForm}
                    handlerSaveGeoJson          = {this.handlerSaveGeoJson}   
                    handlerLoadGeoJson          = {this.handlerLoadGeoJson} 
                >
                    {this.props.children}
                </ComponentOverlay>
                <Scale
                    show={this.state.scaleForm}
                    scale={this.props.scale}
                    scaleArray={getScaleArray()}
                    setScale={this.props.setScale}
                    handlerCloseScaleForm={this.handlerCloseScaleForm}
                />
                <Backgroundloadform
                    show                    = {this.state.loadform}
                    handlerLoadFile         = {this.props.load}
                    handlerScale            = {this.props.setScale}
                    handlerCloseLoadForm    = {this.handlerCloseLoadForm}                    
                    scale                   = {this.props.scale}
                    scaleArray              = {getScaleArray()}
                />
                <Zoom
                    show={this.state.zoomForm}
                    zoom={this.props.zoom}
                    setZoom={this.props.setZoom}
                    handlerCloseZoomForm={this.handlerCloseZoomForm}
                />
                <Rotate
                    show={this.state.rotateForm}
                    rotate={this.props.rotate}
                    setRotate={this.props.setRotate}
                    handlerCloseRotateForm={this.handlerCloseRotateForm}                    
                />
                <Opacity
                    show={this.state.opacityForm}
                    opacity={this.props.opacity}
                    setOpacity={this.props.setOpacity}
                    handlerCloseOpacityForm={this.handlerCloseOpacityForm}
                />
                <Calibrate
                    mode                        = {this.props.mode}
                    calibrate                   = {this.props.calibrate}
                    handlersetCoefficientCalibrate    = {this.handlersetCoefficientCalibrate}
                />
				<Gpsbinding
					mode                        = {this.props.mode}
					gps				            = {this.props.gps}
					handlerGpsComplete			= {this.handlerGpsComplete}
					changeMode                  = {this.props.changeMode}
					handlerGpsHide				= {this.handlerGpsHide}
                />
                <MagneticDeclination
                    mode                                = {this.props.mode}
                    magneticdeclination					= {this.props.magneticdeclination}
                    handlerMagneticDeclinationComplete	= {this.handlerMagneticDeclinationComplete}
                />                
                <PlotList
                    show={this.state.listForm}
                    handlerCloseListForm={this.handlerCloseListForm}
                />
                <Printforms
                    open                = {this.state.openSelectPrintForm}
                    handlerOpenClose    = {this.handlerOpenCloseSelectPrintForm}
                    type={1}
                />
                <PlotProperty/>				
            </Fragment>
        )
    }
}

function mapStateToProps (state) {
    return {
        src: state.background.src,
        zoom: state.background.zoom,
        rotate: state.background.rotate,
        shift: state.background.shift,
        scale: state.background.scale,
        opacity: state.background.opacity,
        mode: state.polygons.mode,
        calibrate: state.background.calibrate,
        coefficientcalibrate: state.background.coefficientcalibrate,
		gps: state.background.gps,
        magneticdeclination: state.background.magneticdeclination,
		curentObject: state.polygons.curentObject,
		polygons: state.polygons,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        load: bindActionCreators(load, dispatch),
        clear: bindActionCreators(clear, dispatch),
        setZoom: bindActionCreators(setZoom, dispatch),
        setRotate: bindActionCreators(setRotate, dispatch),
        setScale: bindActionCreators(setScale, dispatch),
        creatObject: bindActionCreators(creatObject, dispatch),
        saveAsImage: bindActionCreators(saveAsImage, dispatch),
        changeMode: bindActionCreators(changeMode, dispatch),
        setOpacity: bindActionCreators(setOpacity, dispatch),
        setCoefficientCalibrate: bindActionCreators(setCoefficientCalibrate, dispatch),
        clearCoefficientCalibrate: bindActionCreators(clearCoefficientCalibrate, dispatch),
		setGpsCoordinate: bindActionCreators(setGpsCoordinate, dispatch),
        calcGpsCoords: bindActionCreators(calcGpsCoords, dispatch),
        setMagneticDeclination: bindActionCreators(setMagneticDeclination, dispatch),
        editConturMagneticDeclination: bindActionCreators(editConturMagneticDeclination, dispatch),
        saveGeoJson: bindActionCreators(saveGeoJson, dispatch), 
        loadGeoJson: bindActionCreators(loadGeoJson, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Overlay)