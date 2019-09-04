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
	ABRIS_BACKGROUND_GPS_CALC,
    ABRIS_BACKGROUND_MAGNETIC_DECLINATION,
} from '../../constants/abris'

const initialState = {
    src:"",
    name:"",
    dpi:96,
    scale:10000,
    target:{x:0,y:0},//центр рабочей области
    initSize:{width:0,height:0},//исходные размеры картинки при загрузке
    gpsSize:{width:0,height:0,gps_binding:{x:0,y:0},magneticdeclination:0},//исходные размеры картинки при загрузке вычисленные по gps-координатам
    shift:{x:0,y:0},//смещение изображения относительно центра
    rotate: 0,
    zoom: 1,
    opacity:1,
    calibrate:{
        points:[],
        distance:0,
    },
    coefficientcalibrate:1,
	gps:{
		//Координаты GPS
		x:0,
		y:0,
		//Координаты на абрисе (виртуальные)
		px:0,
		py:0,
	},
    magneticdeclination:0,
}


export default function Background (state = initialState, action) {
    
    switch(action.type) {
        case ABRIS_RESET:
            return initialState
        case ABRIS_RESTORING:
            let  newstate = {...initialState}
            for(let key in action.backup) {
                if (newstate.hasOwnProperty(key)) {
                    newstate[key] = action.backup[key]
                }
            }
            newstate.initSize = {//временный костыль для поддержки старых проектов
                width:0,
                height:0,
            }
            return newstate
        case ABRIS_BACKGROUND_LOAD:
            return {...state,
                src:action.src,
                name:action.name,
                dpi:action.dpi,
                gpsSize:action.gpsSize,
            }
        case ABRIS_BACKGROUND_TARGET:
            return {...state,
                target:action.target,
            }
        case ABRIS_BACKGROUND_CLEAR:
            return {...state,
                src:action.src,
                initSize:action.initSize,
            }
        case ABRIS_BACKGROUND_SLEEP:
            return {...state,
                initSize:action.initSize,
            }
        case ABRIS_BACKGROUND_LOADIMAGE:
            return {...state,
                initSize:action.initSize,
            }
        case ABRIS_BACKGROUND_SCALE:
            return {...state,
                scale:action.scale
            }
        case ABRIS_BACKGROUND_ZOOM:
            return {...state,
                zoom:action.zoom
            }
        case ABRIS_BACKGROUND_SHIFT:
            return {...state,
                shift:action.shift
            }
        case ABRIS_BACKGROUND_ROTATE:
            return {...state,
                rotate:action.rotate,
            }
        case ABRIS_BACKGROUND_OPACITY:
            return {...state,
                opacity:action.opacity,
            }
        case ABRIS_BACKGROUND_CALIBRATE:
            return {...state,
                calibrate:action.calibrate,
            }
        case ABRIS_BACKGROUND_COEFFICIENTCALIBRATE:
            return {...state,
                coefficientcalibrate:action.coefficientcalibrate,
                calibrate:action.calibrate,
            }  
		case ABRIS_BACKGROUND_GPS_BINDING:
		    return {...state,
                gps:action.gps,
			}
		case ABRIS_BACKGROUND_GPS_CALC:
		    return {...state,
                polygons:action.polygons,
			}
        case ABRIS_BACKGROUND_MAGNETIC_DECLINATION:
            return {...state,
                magneticdeclination:action.magneticdeclination,
            }
        default:
            return state
    }
}