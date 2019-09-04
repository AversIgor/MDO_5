import {
    ABRIS_RESET,
    ABRIS_RESTORING,
    ABRIS_BACKGROUND_LOAD,
    ABRIS_BACKGROUND_TARGET,
    ABRIS_BACKGROUND_CLEAR,
    ABRIS_BACKGROUND_SLEEP,
    ABRIS_BACKGROUND_LOADIMAGE,
    ABRIS_BACKGROUND_SCALE,
    ABRIS_BACKGROUND_ZOOM,
    ABRIS_BACKGROUND_SHIFT,
    ABRIS_BACKGROUND_ROTATE,
    ABRIS_BACKGROUND_OPACITY,
    ABRIS_BACKGROUND_CALIBRATE,
    ABRIS_BACKGROUND_COEFFICIENTCALIBRATE,
	ABRIS_BACKGROUND_GPS_BINDING,
    ABRIS_BACKGROUND_MAGNETIC_DECLINATION,
} from '../../constants/abris'

import { findEXIFinJPEG } from "./exif";
import base64_arraybuffer from "base64-arraybuffer";
import * as Guid from "guid";

import * as GeoTIFF from 'geotiff';
import * as Plotty from 'plotty';
import * as epsg from 'epsg-to-proj';
import proj4 from 'proj4';

import * as common from "./common";

export function getScaleArray() {

    return   [
        { id:5000, value:"1:5 000" },
        { id:10000,value:"1:10 000" },
        { id:15000,value:"1:15 000" },
        { id:25000,value:"1:25 000" },
        { id:50000,value:"1:50 000" },
    ]
}

export function restoring(backup) {
    return (dispatch,getState) => {
        dispatch({
            type: ABRIS_RESTORING,
            backup: backup,
        })
    }
}



export function reset() {
    return (dispatch,getState) => {
        dispatch({
            type: ABRIS_RESET,
        })
    }
}

//по данным геотифа выислим калибровку и магнитное склонение
function getCalibrateAndMagneticDeclination(image,background) {

    function getCoordinat(opts) {
        var proj = opts.proj
        var mt = opts.tiePoint, mp = opts.pixelScale
        var ih = opts.height, iw = opts.width
        var cw = mt[3] - mt[0] * mp[0]
        var cs = mt[4] - (ih - mt[1]) * mp[1]
        var ce = mt[3] + (iw - mt[0]) * mp[0]
        var cn = mt[4] + mt[1] * mp[1]
        return {
          upperLeft: proj(opts.from, opts.to, [cw,cn]),
          lowerLeft: proj(opts.from, opts.to, [cw,cs]),
          upperRight: proj(opts.from, opts.to, [ce,cn]),
          lowerRight: proj(opts.from, opts.to, [ce,cs]),
          center: proj(opts.from, opts.to, [(cw+ce)/2,(cn+cs)/2])
        }
     }

    var fd = image.getFileDirectory()
    var gk = image.getGeoKeys()                 



    if(!gk) {//это не geotiff, а просто tiff...
        return background.gpsSize
    }

    let property =    getCoordinat({
            tiePoint: fd.ModelTiepoint,
            pixelScale: fd.ModelPixelScale,
            width: fd.ImageWidth,
            height: fd.ImageLength,
            proj: proj4,
            from: epsg[gk.ProjectedCSTypeGeoKey || gk.GeographicTypeGeoKey],
            to: epsg[4326]
            });

    //вычисление дистанции и азимута верхнего края подложки
    let upperLeft = {
        x:property.upperLeft[1],
        y:property.upperLeft[0]
    }
    let upperRight = {
        x:property.upperRight[1],
        y:property.upperRight[0]
    }
        
    let lowerLeft = {
        x:property.lowerLeft[1],
        y:property.lowerLeft[0]
    }

    let gps_binding = {
        x:property.center[1],
        y:property.center[0]
    }
    //вычисление дистанции и азимута верхнего края подложки
    let dist_azimutupper = common.azimut_from_gps(upperRight,upperLeft)
    //вычисление дистанции и азимута левого края подложки
    let dist_azimutLeft = common.azimut_from_gps(upperLeft,lowerLeft)  

    return {
        width:dist_azimutupper.distance,
        height:dist_azimutLeft.distance,
        gps_binding:gps_binding,
        magneticdeclination:dist_azimutupper.azimuth-90,
    }   
}

export function load(event) {

    return (dispatch,getState) => {
        let fileReader  = window.FileReader ? new FileReader() : null;
        let name        = event.file.name;
        
        fileReader.addEventListener("loadend", function(e){
            let src         = e.target.result.split(',')[1];
            let filetype    = e.target.result.split(',')[0];
            let buffer = base64_arraybuffer.decode(src);
            if(filetype == 'data:image/tiff;base64'){
                const gettiff = async () => {
                    const tiff  = await GeoTIFF.fromArrayBuffer(buffer)
                    const image = await tiff.getImage();
                    let background = getState().background

                    let gpsSize = getCalibrateAndMagneticDeclination(image,background)
                    const data  = await image.readRasters();

                    var canvas = document.createElement('canvas');
                    const plot = new Plotty.plot({
                        canvas,
                        data: data[0],
                        width: image.getWidth(),                        
                        height: image.getHeight(),
                        domain: [0, 256],
                        colorScale: "viridis"
                        });
                    plot.render();
                    var dataURL = canvas.toDataURL();
                    canvas.remove();
                    let src = dataURL.split(',')[1]
                    dispatch({
                        type: ABRIS_BACKGROUND_LOAD,
                        name: name,
                        src: src,
                        gpsSize: gpsSize,
                        dpi: 96,
                    })
                    dispatch({
                        type: ABRIS_BACKGROUND_MAGNETIC_DECLINATION,
                        magneticdeclination: parseFloat(gpsSize.magneticdeclination),
                    })                                   
                 }              
                 gettiff();
            }else{
                let dataView = new DataView(buffer);
                let dpi = 96;
                if(dataView.getUint8(13) === 1) {
                    dpi = dataView.getUint16(14);
                }
                var res = findEXIFinJPEG(dataView, buffer.byteLength);
                if(res) {
                    if((res.XResolution != undefined) && (res.YResolution != undefined)) {
                        dpi = res.XResolution.numerator / (res.XResolution.denominator == 0 ? 1 : res.XResolution.denominator);
                    }
                }
                dispatch({
                    type: ABRIS_BACKGROUND_LOAD,
                    src: src,
                    name: name,
                    gpsSize: {width:0,height:0,gps_binding:{x:0,y:0},magneticdeclination:0,},
                    dpi: dpi,
                })
            }   
            
        }, false);
        
        fileReader.readAsDataURL(event.file);
    }      
}

export function loadImage(initSize) {

    return (dispatch,getState) => {
        let background      = getState().background;
        let dpi             = background.dpi;
        let gpsSize         = background.gpsSize;
        let gps_binding     = {...background.gps};
        let initSize_dpi = {
            width:96/dpi*initSize.width,
            height:96/dpi*initSize.height,
        }

        if(gpsSize.width != 0){            
            
            let target = {
                x:initSize_dpi.width/2,
                y:initSize_dpi.height/2
            }
            let eventleft = {
                x:0,
                y:0
            }
            let evendown = {
                x:0,
                y:initSize_dpi.height 
            }
            let eventright = {
                x:initSize_dpi.width,
                y:0
            }
        
            //корректировка по ширине
            let scale = common.getBackground().scale
            let points = []
            points.push(common.getPoint(target,eventleft,scale,1,{x:0,y:0}))
            points.push(common.getPoint(target,eventright,scale,1,{x:0,y:0})) 
            let distanswidth = common.distanceBetweenPoints(points)

             //корректировка по высоте 
            points = []                  
            points.push(common.getPoint(target,eventleft,scale,1,{x:0,y:0}))
            points.push(common.getPoint(target,evendown,scale,1,{x:0,y:0}))
            let distansheight = common.distanceBetweenPoints(points)

         
            initSize_dpi = {
                width:  initSize_dpi.width/distanswidth*gpsSize.width,
                height: initSize_dpi.height/distansheight*gpsSize.height,
            } 

            gps_binding.x   = gpsSize.gps_binding.x;
            gps_binding.y   = gpsSize.gps_binding.y;
            gps_binding.px  = 0
            gps_binding.py  = 0       
            dispatch({
                type: ABRIS_BACKGROUND_GPS_BINDING,
                gps: gps_binding,
            })

        }

        dispatch({
            type: ABRIS_BACKGROUND_LOADIMAGE,
            initSize: initSize_dpi,
        })
        

    }
}

export function clear() {

    let initSize = {
        width:0,
        height:0,
    }

    return (dispatch,getState) => {
        dispatch({
            type: ABRIS_BACKGROUND_CLEAR,
            src: "",
            initSize: initSize,
        })
    }
}

export function setSleep() {

    let initSize = {
        width:0,
        height:0,
    }

    return (dispatch,getState) => {
        dispatch({
            type: ABRIS_BACKGROUND_SLEEP,
            initSize: initSize,
        })
    }
}

export function setTarget(target) {
    return (dispatch,getState) => {
        dispatch({
            type: ABRIS_BACKGROUND_TARGET,
            target: target,
        })
    }
}

export function setScale(scale) {
    return (dispatch,getState) => {
        dispatch({
            type: ABRIS_BACKGROUND_SCALE,
            scale: scale
        })
    }
}

export function setZoom(zoom) {

    return (dispatch,getState) => {
        dispatch({
            type: ABRIS_BACKGROUND_ZOOM,
            zoom: zoom
        })
    }
}

export function setShift(shift) {
    return (dispatch,getState) => {
        dispatch({
            type: ABRIS_BACKGROUND_SHIFT,
            shift:shift,
        })  
    }
}

export function setRotate(rotate) {

    return (dispatch,getState) => {
        dispatch({
            type: ABRIS_BACKGROUND_ROTATE,
            rotate:rotate,
        })
    }
}

export function setOpacity(opacity) {

    return (dispatch,getState) => {
        dispatch({
            type: ABRIS_BACKGROUND_OPACITY,
            opacity:opacity,
        })
    }
}

//GPS >>

export function setGpsCoordinate(x,y) {
    return (dispatch,getState) => {
		let gps_binding = {...getState().background.gps}
		gps_binding.x = x;
		gps_binding.y = y;
        dispatch({
            type: ABRIS_BACKGROUND_GPS_BINDING,
			gps: gps_binding,
        })
    }
}

export function setGpsPoint(data,gps_binding) {
    return (dispatch,getState) => {
		let new_gps_binding = {...gps_binding}
        new_gps_binding.px = data.x
		new_gps_binding.py = data.y
        dispatch({
            type: ABRIS_BACKGROUND_GPS_BINDING,
            gps: new_gps_binding,
        })
    }
}

export function editGPS(data) {
    return (dispatch,getState) => {
        let gps_binding = {...getState().background.gps}
        gps_binding.px = data.x
        gps_binding.py = data.y
        dispatch({
            type: ABRIS_BACKGROUND_GPS_BINDING,
            gps: gps_binding,
        })
    }
}

//GPS <<

//Calibration >>

//рисование полигона калибровки
export function editCalibrate(points,distance) {
    return (dispatch,getState) => {
        let newcalibrate = {...getState().background.calibrate}
        newcalibrate.points = points
        newcalibrate.distance = distance
        dispatch({
            type: ABRIS_BACKGROUND_CALIBRATE,
            calibrate: newcalibrate
        })
    }
}

//расчет коэфициента калибровки по расстоянию
export function setCoefficientCalibrate(distance,calibrate,coefficientcalibrate) {
    return (dispatch,getState) => {
        if(calibrate.distance > 0){
            let newcoefficientcalibrate = Math.round(distance/calibrate.distance*coefficientcalibrate*10000)/10000
            let newcalibrate = {...calibrate}
            newcalibrate.points.splice(0, newcalibrate.points.length)
            newcalibrate.distance = 0
            dispatch({
                type: ABRIS_BACKGROUND_COEFFICIENTCALIBRATE,
                coefficientcalibrate: newcoefficientcalibrate,
                calibrate: newcalibrate
            })
        }
    }
}

export function clearCoefficientCalibrate(calibrate) {
    return (dispatch,getState) => {
        let newcalibrate = {...calibrate}
        newcalibrate.points.splice(0, newcalibrate.points.length)
        newcalibrate.distance = 0
        dispatch({
            type: ABRIS_BACKGROUND_COEFFICIENTCALIBRATE,
            coefficientcalibrate: 1,
            calibrate: newcalibrate
        })
    }
}

//magneticdeclination <<

export function setMagneticDeclination(magneticdeclination) {    
    return (dispatch,getState) => {
        dispatch({
            type: ABRIS_BACKGROUND_MAGNETIC_DECLINATION,
            magneticdeclination: parseFloat(magneticdeclination),
        })
    }
}
