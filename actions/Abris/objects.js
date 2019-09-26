import {
    ABRIS_CREAT_OBJECT,
    ABRIS_RESTORING_OBJECT,
    ABRIS_EDIT_OBJECT,
    ABRIS_MODE_OBJECT,
    ABRIS_CLEAR_CURENT_OBJECT,
    ABRIS_CLEAR_OBJECTS,
    ABRIS_DELETE_OBJECT,
    ABRIS_CTRL_Z_OBJECT,
    ABRIS_BACKGROUND_GPS_CALC,
} from '../../constants/abris'

import {   
	ABRIS_BACKGROUND_GPS_BINDING,
} from '../../constants/abris'

import Guid from "guid";
import FileSaver from "file-saver";

import { getRepository } from "typeorm";
import { Styles } from "../TypeORM/entity/styles";


import {
    azimut_rhumb, 
    cosx,
    sinx,
    vAdd,
    vLength,
    vSub,
    getAngleFromVector,
    calcAdditionalArea,
    angleToMinutes,
    minutesToAngles,
    roundingSquare,
    roundingLengths,
    getEndVector,
    residualLinearCorrect,
    residualAngleCorrect,
    gps_coord,
    getBackground,
    coord_from_gps,
    getPolygons
} from "./common";

//класс лесосека
class Plot {

    constructor(copy = false, parent = undefined, index = 0, styleRow = undefined, abris_settings) {
        if (!copy) {
            let name = 'Лесосека №' + (index + 1)
            this.id = Guid.create().value;
            this.parent = undefined; //владелец полигона   
            this.childrens = {};         
            if (parent != undefined) {
                name = 'Объект №' + (index + 1)                
                parent.childrens[this.id] = this
                this.parent = parent.id; //владелец полигона   
            } 
            
            this.name = name;
            this.area = 0.00;
            this.areaexploitation = 0.00;
            this.nonexploitationarea = false;
            this.xname = 0;
            this.yname = 0;
            this.typeangle = abris_settings.main.typeangle;
            this.contour = [];
            this.linearResidual = 0;
            this.angleResidual = 0;
            this.permissibleResidual = true;
            if (styleRow) {
                this.styleId = styleRow.id;
                this.style = JSON.parse(styleRow.style);
            }
            this.feature = {}
        } else {
            this.contour = [];
        }
    }

    editStyle(styleId, style) {
        this.styleId = styleId;
        this.style = style
    }

    copyObject(data) {
        //глубокое копирование
        let newObject = new Plot(true);
        for (let property in data) {
            if ((property == "contour")
                || (property == "style")
            ) {
                continue;
            }

            newObject[property] = data[property]
        }
        for (let i = 0; i < data.contour.length; i++) {
            let newrow = { ...data.contour[i] };
            newObject.contour.push(newrow)
        }

        newObject.style = JSON.parse(JSON.stringify(data.style))
        if (data == this) {
            delete this
        }
        return newObject
    }

    //расчет невязок
    contourResidual() {
        this.linearResidual = 0;
        this.angleResidual = 0;
        this.permissibleResidual = false;
        let start_polygon = undefined
        for (let i = 0; i < this.contour.length; i++) {
            //пересчет румбов в азимуты и наоборот
            let row = this.contour[i];
            if (row.start_polygon) {
                start_polygon = row
                break
            }
        }

        if ((start_polygon) && (this.contour.length > 1)) {
            let rowLast = this.contour[this.contour.length - 1];
            if ((rowLast.x == rowLast.xc) && (rowLast.y == rowLast.yc)) {
                //нет промера
                this.permissibleResidual = true;
                return
            }

            let coordinates_start = {
                x: start_polygon.x,
                y: start_polygon.y
            }
            let coordinates_last_begin = {
                x: rowLast.x,
                y: rowLast.y
            }
            let coordinates_last_end = {
                x: rowLast.xc,
                y: rowLast.yc
            }
            let dV_correct = vSub(coordinates_start, coordinates_last_begin);
            let dV_test = vSub(coordinates_last_end, coordinates_last_begin);

            this.linearResidual = Math.abs(roundingLengths((vLength(dV_correct)) - roundingLengths(vLength(dV_test))));


            let angle_correct = angleToMinutes(getAngleFromVector(dV_correct));
            let angle_test = angleToMinutes(getAngleFromVector(dV_test));

            let delta = 0;
            if (angle_correct > angle_test) {
                delta = angle_correct - angle_test;
            }
            if (angle_test > angle_correct) {
                delta = angle_test - angle_correct;
            }

            this.angleResidual = Math.abs(minutesToAngles(delta));
            if (residualAngleCorrect(this.angleResidual)) {
                this.permissibleResidual = residualLinearCorrect(roundingLengths(vLength(dV_correct)), this.linearResidual)
            }
        }
    }

    //представление точек
    contourRecount() {
        let count = 1;
        let previous = 0;
        let next = 0;
        let start_polygon = undefined
        let apostrof = true
        for (let i = 0; i < this.contour.length; i++) {
            let curentRow = this.contour[i]
            let previewRow = this.contour[i - 1]
            let nextRow = this.contour[i + 1]
            if (curentRow.start_polygon) {
                start_polygon = curentRow
                apostrof = false
            }
            let previewRow_natural_boundary = false
            if ((previewRow) && (previewRow.natural_boundary)) {
                previewRow_natural_boundary = true
            }

            //первая точка
            if (previewRow_natural_boundary) {
                previous = '*'
                curentRow.benchmark = '*'
            } else {
                previous = count
                curentRow.benchmark = count
                count += 1
            }

            if (curentRow.natural_boundary) {
                next = '*'
            } else {
                next = count
            }

            if ((nextRow) && (nextRow.start_polygon)) {
                previous = previous + " '"
            } else {
                if (apostrof) {
                    previous = previous + " '"
                    next = next + " '"
                }
            }

            //замыкаем полигон
            if (i == this.contour.length - 1) {
                if (this.permissibleResidual) {
                    next = start_polygon.benchmark
                }
            }

            this.contour[i].position = previous + " - " + next;
        }
    }

    fillgeoJSON(){
        let start_polygon = undefined
        let coordinatesLineString = []   
        let coordinatesPolygon  = []    
        if(this.contour.length !=0 ){
            for (let i = 0; i < this.contour.length; i++) {
                let curentRow = this.contour[i]
                if (curentRow.start_polygon) {
                    start_polygon = curentRow                    
                }
                let coordinates = []
                coordinates.push(curentRow.gpsY)
                coordinates.push(curentRow.gpsX)
                if(start_polygon){
                    coordinatesPolygon.push(coordinates)                    
                }else{
                    coordinatesLineString.push(coordinates)     
                }
            }
            //первая строка дублируется в конце, для замыкания

            if(start_polygon){
                let coordinates = []
                coordinates.push(start_polygon.gpsY)
                coordinates.push(start_polygon.gpsX)
                if(coordinatesPolygon.length>0){
                    coordinatesPolygon.push(coordinates)
                }
                if(coordinatesLineString.length>0){
                    coordinatesLineString.push(coordinates)
                }
            }

            this.feature = {
                type: "Feature",
                geometry: {
                    type: "GeometryCollection",
                    geometries: []            
                },
                "properties": {}
            }

            //стиль
            let stylePoliline = this.style.poliline
            this.feature.properties  = {
                "stroke":stylePoliline.stroke,
                "stroke-width":stylePoliline.strokeWidth,
                "stroke-opacity":stylePoliline.strokeOpacity,
                "fill":stylePoliline.fill,
                "fill-opacity":stylePoliline.fillOpacity,
                "stroke-dasharray":stylePoliline.strokeDasharray,
                "id":this.id,
                "parent":this.parent,
                "name":this.name,
                "area":this.area,
                "areaexploitation":this.areaexploitation,   
                "nonexploitationarea":this.nonexploitationarea,             
            }

            if(coordinatesLineString.length>0){    
                this.feature.geometry.geometries.push(
                    {
                        type: "LineString",
                        coordinates: coordinatesLineString
                    }
                )
            }
            if(coordinatesPolygon.length>0){
                this.feature.geometry.geometries.push(
                    {
                        type: "Polygon",
                        coordinates: [coordinatesPolygon]
                    }
                )                
            }            
        }
    }

    contourADD(x = 0, y = 0, start_polygon = 0, index = 0) {

        if (this.contour.length == 0) {
            start_polygon = 1
            this.xname = x + 100;
            this.yname = y - 100;
        }

        let xc = x
        let yc = y

        if (index < this.contour.length - 1) {
            let nextRow = this.contour[index]
            xc = nextRow.xc
            yc = nextRow.yc
        }

        let row = {
            id: Guid.create().value,
            position: "",
            benchmark: 0,//это позиция без учета natural_boundary - настоящие столбы
            start_polygon: start_polygon,
            natural_boundary: 0,
            direct: '',
            rhumb: 0,
            azimut: 0,
            distance: 0,
            x: x,//координата начала отрезка
            y: y,
            xc: xc,//координата конца отрезка
            yc: yc,
            xtext: 10,//координата текста
            ytext: 10,
            gpsX:0,//gps-координаты
            gpsY:0
        }

        this.contour.splice(index + 1, 0, row);

        return row

    }

    editContourFromTable(gps_binding = undefined) {     
        let magneticdeclination = getBackground().magneticdeclination;
        if((this.typeangle == "Румбы") || (this.typeangle == "Азимуты")) {
            for (let i = 0; i < this.contour.length; i++) {
                //пересчет румбов в азимуты и наоборот
                let curentRow = this.contour[i];            
                let result = azimut_rhumb(this.typeangle, curentRow.azimut, curentRow.rhumb, curentRow.direct)
                curentRow.rhumb = result.rhumb;
                curentRow.direct = result.direct;
                curentRow.azimut = result.azimut;          
                //заполнение координат по промерам
                getEndVector(curentRow,magneticdeclination)
                if (i < this.contour.length - 1) {
                    let nextRow = this.contour[i + 1];
                    nextRow.x = curentRow.xc
                    nextRow.y = curentRow.yc
                }
            }
            this.recalcGPS()
        }

        if(this.typeangle == "Координаты") {
            if(gps_binding){
                let start_polygon   = undefined;
                for (let i = 0; i < this.contour.length; i++) {
                    //пересчет в азимуты из gps
                    start_polygon = this.contour[0]; 
                    let curentRow = this.contour[i]; 
                    if((curentRow.gpsX == 0) || (curentRow.gpsY == 0)) {
                        continue
                    }
                    let x_y = coord_from_gps({
                        x:curentRow.gpsX,
                        y:curentRow.gpsY
                    },gps_binding)
                    curentRow.x = x_y.x
                    curentRow.y = x_y.y               
                }
                for (let i = 0; i < this.contour.length; i++) {
                    //пересчет в азимуты из координат                               
                    let curentRow = this.contour[i]; 
                    if (curentRow.start_polygon) {
                        start_polygon = curentRow
                    }
                    if (i != this.contour.length-1){
                        let next = this.contour[i + 1];
                        curentRow.xc = next.x
                        curentRow.yc = next.y
                    }else{                    
                        curentRow.xc = start_polygon.x
                        curentRow.yc = start_polygon.y
                    }
                    this.edit_Rhumb_Azimut(curentRow,magneticdeclination)                
                }
            }            
        }
        this.contourResidual()
        this.contourRecount()
        this.areaRecount()   
    }

    editContourFromCSV(startRow = undefined, indexRow = -1) {

        if (startRow) {
            //замыкаем последний промер на начало полигона
            let curentRow = this.contour[this.contour.length - 1];
            curentRow.xc = startRow.x
            curentRow.yc = startRow.y
        }
        if (indexRow != -1) {
            //корректируем только текущий и предыдущий промеры
            let curentRow = this.contour[indexRow];
            if (indexRow > 0) {
                let previewRow = this.contour[indexRow - 1];
                previewRow.xc = curentRow.x
                previewRow.yc = curentRow.y
            }
        }

        let magneticdeclination = getBackground().magneticdeclination;
        for (let i = 0; i < this.contour.length; i++) {
            //пересчет румбов в азимуты и наоборот
            let curentRow = this.contour[i];
            this.edit_Rhumb_Azimut(curentRow,magneticdeclination)
        }       

        this.contourResidual()
        this.contourRecount()
        this.areaRecount()
        this.recalcGPS()
    }

    edit_Rhumb_Azimut(curentRow,magneticdeclination) {
        let coordinates_last = { x: curentRow.xc, y: curentRow.yc }
        let coordinates_curent = { x: curentRow.x, y: curentRow.y }

        if ((curentRow.x == curentRow.xc) && (curentRow.y == curentRow.yc)) return //нет промера

        let dV = vSub(coordinates_last, coordinates_curent);
        if (dV != undefined) {            
            let azimut = getAngleFromVector(dV, magneticdeclination)
            curentRow.azimut = azimut
            let result = azimut_rhumb('Азимуты', curentRow.azimut)
            curentRow.rhumb = result.rhumb;
            curentRow.direct = result.direct;
            curentRow.distance = roundingLengths(vLength(dV));
        }
    }

    newContour(contour, indexRow) {
        this.contour = []
        for (let i = 0; i < contour.length; i++) {
            this.contour.push({ ...contour[i] })
        }
        if (indexRow != -1) {
            this.editContourFromCSV(undefined, indexRow);
        }
    }

    contourDelete(index, clearPrev) {
        if (index <= this.contour.length - 1) {
            let prevRow = this.contour[index - 1];
            if ((clearPrev) && (prevRow)) {
                this.contour.splice(index, 1);
                this.editContourFromCSV(undefined, index - 1)
            } else {
                this.contour.splice(index, 1);
                this.editContourFromTable();
            }
        }
    }

    contourUnite(index) {
        if (index < this.contour.length - 1) {
            let start_polygon = this.contour[index]
            for (let i = 0; i < this.contour.length; i++) {
                let row = this.contour[i]
                if (row.id == start_polygon.id) {
                    row.start_polygon = 1;
                } else {
                    row.start_polygon = 0;
                }
            }
            this.editContourFromCSV(start_polygon);
        }
    }

    contourCorrect() {
        let start_polygon = undefined
        for (let i = 0; i < this.contour.length; i++) {
            let row = this.contour[i];
            if (row.start_polygon) {
                start_polygon = row
                break
            }
        }
        if ((start_polygon) && (this.contour.length > 1)) {
            this.permissibleResidual = true;
            this.editContourFromCSV(start_polygon);
        }
    }

    nameCorrect(name) {
        this.name = name
    }

    nonexploitationareaCorrect(nonexploitationarea) {
        this.nonexploitationarea = nonexploitationarea
        this.areaRecount()
    }


    recalcGPS() {
        let gps_binding = getBackground().gps;
        let magneticdeclination = getBackground().magneticdeclination;
        let gpsXY = { 
            x: gps_binding.px, 
            y: gps_binding.py 
        } 

        for (var point_name in this.contour) {
            let point = this.contour[point_name]
            let res = gps_coord(
                { 
                    x: point.x,
                    y: point.y
                }, 
                gpsXY, 
                { x: gps_binding.x, y: gps_binding.y },
                magneticdeclination
                )
            point.gpsX = res.x
            point.gpsY = res.y
        }
    }

    namePositionCorrect(position) {
        this.xname = position.x
        this.yname = position.y
    }

    areaRecount() {
        this.area = 0.00
        //на основании промеров сформируем массив координат в метрах
        let start_polygon = false
        let arrayPointForArea = []
        let previewPoint = { x: 0, y: 0 }
        for (let i = 0; i < this.contour.length; i++) {
            let curentRow = this.contour[i]
            if (curentRow.start_polygon) {
                start_polygon = true
                arrayPointForArea.push(previewPoint)
            }
            if (!start_polygon) continue

            let curentPoint = {
                x: sinx(curentRow.azimut) * curentRow.distance,
                y: -cosx(curentRow.azimut) * curentRow.distance
            }
            let result = vAdd(previewPoint, curentPoint)
            arrayPointForArea.push({ x: result.x, y: result.y })
            previewPoint = result
        }

        if (arrayPointForArea.length < 3) {
            return;
        }

        let prevPoint = 0;
        let firstVector = { x: arrayPointForArea[prevPoint].x, y: arrayPointForArea[prevPoint].y }
        for (let i = 0; i < arrayPointForArea.length; i++) {
            let prevVector = { x: arrayPointForArea[prevPoint].x, y: arrayPointForArea[prevPoint].y }
            let curentVector = { x: arrayPointForArea[i].x, y: arrayPointForArea[i].y }
            this.area += calcAdditionalArea(curentVector, prevVector, firstVector);
            prevPoint = i;
        }
        this.area = Math.abs(this.area) / 2;
        //округлим до 1 м.кв
        this.area = roundingSquare(this.area)
        this.areaexploitation = this.area

        //пересчет эксплуатационной площади у родителя
        if(this.parent != undefined){
            let objects= getPolygons().objects
            if(!objects.hasOwnProperty(this.parent)){
                return
            }            
            let parentPoligon = objects[this.parent]
            let areaexploitation = parentPoligon.area
            for(let keyChildrens in parentPoligon.childrens) {
                let objectChildren = parentPoligon.childrens[keyChildrens];
                if(objectChildren.id == this.id){
                    objectChildren = this
                }
                if(objectChildren.nonexploitationarea){
                    areaexploitation = areaexploitation-objectChildren.area
                }
            }
            parentPoligon.areaexploitation = roundingSquare(areaexploitation*10000)
        }
    }

   

}

export function getTypeangle() {
    return ["Румбы", "Азимуты", "Координаты"]
}

export function getDirect() {
    return ["СВ", "ЮВ", "ЮЗ", "СЗ"]
}

export function restoring(data) {
    return (dispatch, getState) => {

        dispatch({
            type: ABRIS_CLEAR_OBJECTS,
        })

        let objects = {}
        for (let key in data) {
            let oblect = data[key];
            let curentObject = new Plot(true);
            let new_curentObject = curentObject.copyObject(oblect)
            objects[new_curentObject.id] = new_curentObject;
        }

        dispatch({
            type: ABRIS_RESTORING_OBJECT,
            objects: objects,
        })

    }
}

export function calcGpsCoords(gps_binding, polygons) {
    return (dispatch, getState) => {
        let new_polygons = { ...polygons }

        let magneticdeclination = getBackground().magneticdeclination;
        for (var item_name in new_polygons.objects) {
            let gpsXY = { 
                x: gps_binding.px, 
                y: gps_binding.py 
            } //перерасчет координат точки gps с учетом сдвига объекта
            for (var point_name in new_polygons.objects[item_name].contour) {
                let point = new_polygons.objects[item_name].contour[point_name]
                let res = gps_coord({ x: point.x, y: point.y }, gpsXY, { x: gps_binding.x, y: gps_binding.y },magneticdeclination)
                point.gpsX = res.x
                point.gpsY = res.y
            }
        }

        dispatch({
            type: ABRIS_BACKGROUND_GPS_CALC,
            polygons: new_polygons,
        })
    }
}

export function reset() {
    return (dispatch, getState) => {
        dispatch({
            type: ABRIS_CLEAR_OBJECTS,
        })
    }
}

export function creatObject(parentID = undefined) {

    return (dispatch, getState) => {
        let objects = getState().polygons.objects
        let abris_settings = JSON.parse(getState().abris_settings.data[0].settings)
        const asyncProcess = async () => {
            let repository = getRepository(Styles);
            let styles = await repository.find({ main: 1 });
            if (styles.length > 0) {
                let curentObject = new Plot(false, objects[parentID], Object.keys(objects).length, styles[0], abris_settings);
                dispatch({
                    type: ABRIS_CREAT_OBJECT,
                    curentObject: curentObject,
                    mode: 0,
                })
            } else {
                webix.message({ type: "error", text: 'В справочнике "Стили абриса" не указан основной стиль!' });
                dispatch({
                    type: ABRIS_CLEAR_CURENT_OBJECT,
                    curentObject: undefined,
                    mode: 1,
                })
            }
        }
        asyncProcess();
    }
}

export function deleteObject(curentObject) {

    return (dispatch, getState) => {
        dispatch({
            type: ABRIS_DELETE_OBJECT,
            curentObject: curentObject,
        })
    }
}

export function clearCurentObject() {

    return (dispatch, getState) => {
        dispatch({
            type: ABRIS_CLEAR_CURENT_OBJECT,
            curentObject: undefined,
        })
    }
}

export function chengeTypeangle(curentObject, typeangle) {

    return (dispatch, getState) => {
        let new_curentObject = curentObject.copyObject(curentObject)
        new_curentObject.typeangle = typeangle;
        dispatch({
            type: ABRIS_EDIT_OBJECT,
            curentObject: new_curentObject,
        })
    }
}

//работа с основным полигоном

export function get_set_gps_binding(curentObject,dispatch) {

    let gps_binding  = getBackground().gps;

    if((gps_binding.x == 0) && (gps_binding.y == 0)) {
        let area = {left:0,right:0,top:0,bottom:0}
        for (let i = 0; i < curentObject.contour.length; i++) {
            let curentRow = curentObject.contour[i]; 
            if(area.left != 0){
                area.left = Math.min(area.left,curentRow.gpsX)
            }else{
                area.left = curentRow.gpsX
            }
            if(area.bottom != 0){
                area.bottom = Math.min(area.bottom,curentRow.gpsY)
            }else{
                area.bottom = curentRow.gpsY
            }
            area.right = Math.max(area.right,curentRow.gpsX)
            area.top = Math.max(area.top,curentRow.gpsY)                    
        }
        gps_binding.x =  (area.right+area.left)/2
        gps_binding.y =  (area.top+area.bottom)/2
        if((gps_binding.x != 0) && (gps_binding.y != 0)) {
            dispatch({
                type: ABRIS_BACKGROUND_GPS_BINDING,
                gps: gps_binding,
            })
        }
    }

    return gps_binding

}



export function editContourFromTable(curentObject) {

    return (dispatch, getState) => {
        let new_curentObject = curentObject.copyObject(curentObject)
        let gps_binding  = get_set_gps_binding(curentObject,dispatch);

        new_curentObject.editContourFromTable(gps_binding);
        dispatch({
            type: ABRIS_EDIT_OBJECT,
            curentObject: new_curentObject,
        })
    }
}

export function newContour(curentObject, contour, indexRow = undefined) {

    return (dispatch, getState) => {
        let new_curentObject = curentObject.copyObject(curentObject)
        new_curentObject.newContour(contour, indexRow);
        dispatch({
            type: ABRIS_EDIT_OBJECT,
            curentObject: new_curentObject,
        })
    }
}



export function contourDelete(curentObject, id, clearPrev = false) {

    return (dispatch, getState) => {
        let new_curentObject = curentObject.copyObject(curentObject)
        new_curentObject.contourDelete(id, clearPrev);
        dispatch({
            type: ABRIS_EDIT_OBJECT,
            curentObject: new_curentObject,
        })
    }
}

export function contourUnite(curentObject, index) {

    return (dispatch, getState) => {
        let new_curentObject = curentObject.copyObject(curentObject)
        new_curentObject.contourUnite(index);
        dispatch({
            type: ABRIS_EDIT_OBJECT,
            curentObject: new_curentObject,
        })
    }
}

export function contourCorrect(curentObject) {
    return (dispatch, getState) => {
        let new_curentObject = curentObject.copyObject(curentObject)
        new_curentObject.contourCorrect()
        dispatch({
            type: ABRIS_EDIT_OBJECT,
            curentObject: new_curentObject,
        })
    }
}

//добавление точки в таблице
export function contourAdd(curentObject) {

    return (dispatch, getState) => {
        let new_curentObject = curentObject.copyObject(curentObject)
        new_curentObject.contourADD(0, 0, 0, new_curentObject.contour.length);
        new_curentObject.editContourFromTable()
        dispatch({
            type: ABRIS_EDIT_OBJECT,
            curentObject: new_curentObject,
        })
    }
}

//добавление точки мышкой
export function newPoint(curentObject, x, y, index) {
    return (dispatch, getState) => {
        let new_curentObject = curentObject.copyObject(curentObject)
        new_curentObject.contourADD(x, y, 0, index)
        new_curentObject.editContourFromCSV(undefined, index + 1);
        dispatch({
            type: ABRIS_EDIT_OBJECT,
            curentObject: new_curentObject,
        })

    }
}

export function editStyle(curentObject, styleId, style) {

    return (dispatch, getState) => {
        let new_curentObject = curentObject.copyObject(curentObject)
        new_curentObject.editStyle(styleId, style);
        dispatch({
            type: ABRIS_EDIT_OBJECT,
            curentObject: new_curentObject,
        })

    }
}

//пересчет всех координат в связи с изменением магнитного склонения
// не доделано
export function editConturMagneticDeclination(magneticdeclination) {

    return (dispatch, getState) => {
        let new_polygons = { ...getState().polygons }
        for (var key in new_polygons.objects) {
            new_polygons.objects[key].editContourFromTable();
        }
        dispatch({
            type: ABRIS_BACKGROUND_GPS_CALC,
            polygons: new_polygons,
        })
    }
}

export function nameCorrect(curentObject, newName) {

    return (dispatch, getState) => {
        let new_curentObject = curentObject.copyObject(curentObject)
        new_curentObject.nameCorrect(newName)
        dispatch({
            type: ABRIS_EDIT_OBJECT,
            curentObject: new_curentObject,
        })
    }
}


export function nonexploitationareaCorrect(curentObject, value) {

    return (dispatch, getState) => {
        let new_curentObject = curentObject.copyObject(curentObject)
        new_curentObject.nonexploitationareaCorrect(value)
        dispatch({
            type: ABRIS_EDIT_OBJECT,
            curentObject: new_curentObject,
        })
    }
}

export function namePositionCorrect(curentObject, position) {

    return (dispatch, getState) => {
        let new_curentObject = curentObject.copyObject(curentObject)
        new_curentObject.namePositionCorrect(position)
        dispatch({
            type: ABRIS_EDIT_OBJECT,
            curentObject: new_curentObject,
        })
    }
}

export function changeMode(mode, curentObject = undefined) {

    return (dispatch, getState) => {
        dispatch({
            type: ABRIS_MODE_OBJECT,
            mode: mode,
            curentObject: curentObject,
        })
    }
}

export function ctrl_z() {
    return (dispatch, getState) => {
        dispatch({
            type: ABRIS_CTRL_Z_OBJECT,
        })
    }
}

export function saveGeoJson() {
    return (dispatch, getState) => {
        let polygons = getState().polygons 
        let geoJSON = {
            type: "FeatureCollection",
            features: [],
        };
        for (let key in polygons.objects) {
            let feature = polygons.objects[key].feature
            geoJSON.features.push(feature)
        }
        let objectFile = JSON.stringify(geoJSON, null, '\t');

        const asyncProcess = async () => {
            let filename = "Poligons.json";
            let blob = new Blob([objectFile], {type: "json;charset=utf-8"});
            FileSaver.saveAs(blob, filename);
        }
        asyncProcess()
    }
}

export function loadGeoJson() {
    return (dispatch, getState) => {
        var input = $("<input/>", {
            style:"display:none",
            id:"inputFile",
            type:"file",
            accept:".json"
        }).appendTo("body");
        input.unbind('change');
        input.change(function(evt) {
            var file = this.files;
            if (file.length == 1){
                var fileReader = window.FileReader ? new FileReader() : null;
                fileReader.addEventListener("loadend", function(e){
                    var data = JSON.parse(e.target.result);

                    let objects = getState().polygons.objects
                    let abris_settings = JSON.parse(getState().abris_settings.data[0].settings)
                    const asyncProcess = async () => {
                        let repository = getRepository(Styles);
                        let styles = await repository.find({ main: 1 });
                        
                        for (let i = 0; i < data.features.length; i++) {
                            let feature = data.features[i]
                            let curentObject = new Plot(false, undefined, Object.keys(objects).length, styles[0], abris_settings);
                            curentObject.feature = feature;
                            curentObject.id = feature.properties.id;
                            curentObject.name = feature.properties.name;
                            curentObject.area = feature.properties.area;
                            curentObject.areaexploitation = feature.properties.areaexploitation;
                            curentObject.nonexploitationarea = feature.properties.nonexploitationarea; 
                            curentObject.parent = feature.properties.parent;
                            curentObject.typeangle = "Координаты";

                            let stylePoliline = {
                                stroke:feature.properties.stroke,
                                strokeWidth:feature.properties['stroke-width'],
                                strokeOpacity:feature.properties['stroke-opacity'],
                                fill:feature.properties.fill,
                                fillOpacity:feature.properties['fill-opacity'],
                                strokeDasharray:feature.properties['stroke-dasharray'],
                            }
                            curentObject.style.poliline = stylePoliline;

                            for (let j = 0; j < feature.geometry.geometries.length; j++) {
                                let geometry = feature.geometry.geometries[j]
                                if(geometry.type == 'LineString'){
                                    for (let k = 0; k < geometry.coordinates.length-1; k++) {
                                        let coordinate = geometry.coordinates[k]
                                        let row = curentObject.contourADD(0, 0, 0, curentObject.contour.length)
                                        row.start_polygon = 0
                                        row.gpsX = coordinate[1]
                                        row.gpsY = coordinate[0]
                                    }
                                }
                                if(geometry.type == 'Polygon'){
                                    for (let k = 0; k < geometry.coordinates.length; k++) {
                                        let arrayCoordinate = geometry.coordinates[k]
                                        for (let l = 0; l < arrayCoordinate.length-1; l++) {
                                            let coordinate = arrayCoordinate[l]
                                            let row = curentObject.contourADD(0, 0, 0, curentObject.contour.length) 
                                            if(l == 0) {
                                                row.start_polygon = 1
                                            } else{
                                                row.start_polygon = 0
                                            }                                     
                                            row.gpsX = coordinate[1]
                                            row.gpsY = coordinate[0]
                                        }                                        
                                    }
                                }
                            }

                            let gps_binding  = get_set_gps_binding(curentObject,dispatch);

                            curentObject.editContourFromTable(gps_binding) 

                            dispatch({
                                type: ABRIS_CREAT_OBJECT,
                                curentObject: curentObject,
                                mode: 0,
                            })
                        }

                        dispatch({
                            type: ABRIS_CLEAR_CURENT_OBJECT,
                            curentObject: undefined,
                        })
                        
                    }
                    asyncProcess();

                }, false);
                fileReader.readAsText(file[0]);
            }
        });
        input.trigger('click');
        
    }
}