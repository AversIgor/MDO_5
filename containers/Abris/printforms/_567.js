//ПРИКАЗ от 17 октября 2017 г. N 567
import React, { Component, PropTypes} from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'

import * as MDO from "../../../js/mdo";
import {BD} from "../../../js/dao";

import Component_567 from "../../../components/Abris/printforms/_567";
import {thumb_azimut_format,roundingLengths} from "../../../actions/Abris/common";

class _567 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            params: {},
        };

        this.location =  ''
        this.area =  0
        this.viewChildrens =  0
        this.sign =  'Продавец____________________                                   Покупатель___________________________'

        this.koeff_print = 1.33
        this.sizeWindow  = 600
    }

    XMLSerialize = (svg) => {
        return unescape(encodeURIComponent(new XMLSerializer().serializeToString(svg)));
    }

    base64dataURLencode = (string) => {
        var buffer = window.btoa(string);
        return "data:image/svg+xml;base64," + buffer;
    }

    addImageProcess = (src,width,height) => {
        return new Promise((resolve, reject) => {
            let img = new Image(width,height)
            img.onload = () => resolve(img)
            img.onerror = reject
            img.src = src
        })
    }

    getDataUrlImage = () => {
        //1.из SVG сделаем картнинку
        //2.Объединим подложку и картинкуSVG в один canvas необходимого размера
        //3.Сохраним каквас в base64

        let self = this
        //1
        let paint       = document.getElementById('paint')
        let SVG         = document.getElementById('SVG').cloneNode(true)
        SVG.querySelectorAll(".aim").forEach(
            e => e.parentNode.removeChild(e)
        )
        let img         = document.getElementById('background')

        const asyncProcess = async () => {
            let src             = this.base64dataURLencode(this.XMLSerialize(SVG));
            let vector_image    = await this.addImageProcess(src,paint.clientWidth,paint.clientHeight);

            let canvasSVG = document.createElement('canvas');
            let contextSVG = canvasSVG.getContext('2d');
            canvasSVG.width = paint.clientWidth;
            canvasSVG.height = paint.clientHeight;
            contextSVG.drawImage(vector_image, 0, 0,paint.clientWidth,paint.clientHeight);


            let src_png = canvasSVG.toDataURL('image/png');
            let rastr_image    = await this.addImageProcess(src_png,paint.clientWidth,paint.clientHeight);

            let canvas = document.createElement('canvas');
            let context = canvas.getContext('2d');
            canvas.width = this.sizeWindow;
            canvas.height = this.sizeWindow;

            if(img){
                let x = this.sizeWindow/2-(paint.clientWidth/2-img.offsetLeft)
                let y = this.sizeWindow/2-(paint.clientHeight/2-img.offsetTop)
                //вставляем подложку
                context.save()
                context.translate(canvas.width/2, canvas.height/2); // set canvas context to center
                context.rotate(self.props.rotate*Math.PI/180);
                context.translate (-canvas.width / 2, -canvas.height / 2);
                context.globalAlpha  = self.props.opacity;
                context.drawImage(img,x,y,img.width,img.height);
                context.restore()
            }

            //вставляем картинку svg
            context.globalAlpha = 1.0;
            var sourceX = paint.clientWidth/2-this.sizeWindow/2;
            var sourceY = paint.clientHeight/2-this.sizeWindow/2;
            var sourceWidth = this.sizeWindow;
            var sourceHeight = this.sizeWindow;
            var destWidth = this.sizeWindow;
            var destHeight = this.sizeWindow;
            var destX = 0;
            var destY = 0;

            context.drawImage(rastr_image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);

            return canvas.toDataURL('image/png')

        }

        return asyncProcess();

    }

    creatLocation = () => {        
        let location 	=  "Местоположение лесных насаждений: "
        if(MDO.objectMDO.forestry.text != undefined){
            location = location+MDO.objectMDO.forestry.text+", "
        }
        if(MDO.objectMDO.subforestry.text != undefined){
            location = location+MDO.objectMDO.subforestry.text+", "
        }
        if(MDO.objectMDO.tract.text != undefined){
            location = location+MDO.objectMDO.tract.text+", "
        }
        location = location+"квартал " + MDO.objectMDO.quarter + ", выдел " + MDO.objectMDO.isolated + ", делянка " + MDO.objectMDO.cuttingarea;

        this.location =  location
    }

    newLocation = (str) => {
        this.location = str
        this.updateStates()
    }

    calculateArea = () => {
        this.area = 0
        for(let key in this.props.objectsTree) {
            let oblect = this.props.objectsTree[key];
            this.area = this.area+oblect.area
        }
    }

    newArea = (area) => {
        this.area = area
        this.updateStates()
    }

    newViewChildrens = (value) => {
        this.viewChildrens = value
        this.updateStates()
    }

    newSign = (value) => {
        this.sign = value
        this.updateStates()
    }

    fillTable = (source,limit) => {

        let sourceLength = source.length

        let body   = [[{text: 'NN', style: 'tableheader', alignment: 'center'}, {text: 'Румбы (азимуты) линий', style: 'tableheader', alignment: 'center'}, {text: 'Промеры,м', style: 'tableheader', alignment: 'center'}]]

        for (let i = 0; i < sourceLength; i++) {
            let row     = source[0]
            if(limit <= 0) break
            if(!row) break
            if(row.type == 'parent'){
                if(row.oblect){
                    //формируем заголовок объекта
                    let textOblect = row.oblect.name+', площадь '+row.oblect.area
                    if(row.oblect.area != row.oblect.areaexploitation){
                        textOblect = textOblect+' ('+row.oblect.areaexploitation+')'
                    }
                    textOblect = textOblect+' га:'
                    body.push([{text: textOblect, colSpan: 3, alignment: 'left',style: 'tablesubheader'}, {}, {}])
                }
                if(row.row){
                    //экспликация объекта
                    let position    = row.row.position
                    let direct      = ""
                    if(!row.row.natural_boundary){
                        direct = row.row.direct+", "+thumb_azimut_format(row.row.rhumb,true)+" ("+thumb_azimut_format(row.row.azimut,true)+")"
                    }else {
                        direct = row.row.natural_boundary
                    }
                    let distance = row.row.distance
                    let newrow  = [{text: position, style: 'tablerow', alignment: 'center'},{text: direct, style: 'tablerow', alignment: 'center'},{text: distance, style: 'tablerow', alignment: 'center'}];
                    body.push(newrow)
                }
                source.splice(0, 1);
                limit = limit-1
            }else{
                //формируем заголовок вложенного объекта
                if(row.oblect){
                    let textOblect = row.oblect.name+', площадь '+row.oblect.area
                    if(row.oblect.nonexploitationarea){
                        textOblect = textOblect+' га (не эксплуатационная):'
                    }else {
                        textOblect = textOblect+' га:'
                    }
                    body.push([{text: textOblect, colSpan: 3, alignment: 'right',style: 'tablesubheader'}, {}, {}])
                }
                if(row.row){
                    let position = row.row.position
                    let direct      = ""
                    if(!row.row.natural_boundary){
                        direct = row.row.direct+", "+thumb_azimut_format(row.row.rhumb,true)+" ("+thumb_azimut_format(row.row.azimut,true)+")"
                    }else {
                        direct = row.row.natural_boundary
                    }
                    let distance = row.row.distance
                    let newrow  = [{text: position, style: 'tablerow', alignment: 'center'},{text: direct, style: 'tablerow', alignment: 'center'},{text: distance, style: 'tablerow', alignment: 'center'}];
                    body.push(newrow)
                }
                source.splice(0, 1);
                limit = limit-1
            }
        }

        return {table: {
                widths: [30, '*', 60],
                headerRows: 1,
                body:body
            }
        }
    }


    creatMeasure = () => {
        //сначала сформируем массив объектов без вложенности
        let data = []

        //обработаем естественные границы - сгруппируем
        for(let key in this.props.objectsTree) {
            let oblect = this.props.objectsTree[key];
            data.push({oblect:oblect,type:'parent'})
            let natural_boundary    = []
            let start_polygon       = undefined
            for (let j = 0; j < oblect.contour.length; j++) {
                let row = oblect.contour[j]
                if(row.start_polygon){
                    start_polygon = row
                }
                if(row.natural_boundary){
                    //начнем суммирование
                    natural_boundary.push(row)
                    continue
                }else{
                    if(natural_boundary.length > 0){
                        //закончим суммирование
                        natural_boundary.push(row)
                        let finishPosition = natural_boundary[0].benchmark+1
                        if((j == oblect.contour.length-1) && (start_polygon)){
                            finishPosition = start_polygon.benchmark
                        }
                        let position = natural_boundary[0].benchmark+" - "+finishPosition
                        let distance = 0
                        for (let k = 0; k < natural_boundary.length; k++) {
                            distance += natural_boundary[k].distance
                        }
                        row = {
                            position:position,
                            distance:roundingLengths(distance),
                            natural_boundary:'Естественная граница',
                        }
                        natural_boundary.splice(0,natural_boundary.length);
                    }
                }
                data.push({row:row,type:'parent'})
            }
            for(let keych in oblect.childrens) {
                let children = oblect.childrens[keych];
                data.push({oblect:children,type:'children',viewChildrens:false})
                if(this.viewChildrens){
                    let natural_boundary    = []
                    let start_polygon       = undefined
                    for (let j = 0; j < children.contour.length; j++) {
                        let row = children.contour[j];
                        if(row.start_polygon){
                            start_polygon = row
                        }
                        if(row.natural_boundary){
                            //начнем суммирование
                            natural_boundary.push(row)
                            continue
                        }else{
                            if(natural_boundary.length > 0){
                                //закончим суммирование
                                natural_boundary.push(row)
                                let finishPosition = natural_boundary[0].benchmark+1
                                if((j == children.contour.length-1) && (start_polygon)){
                                    finishPosition = start_polygon.benchmark
                                }
                                let position = natural_boundary[0].benchmark+" - "+finishPosition
                                let distance = 0
                                for (let k = 0; k < natural_boundary.length; k++) {
                                    distance += natural_boundary[k].distance
                                }
                                row = {
                                    position:position,
                                    distance:roundingLengths(distance),
                                    natural_boundary:'Естественная граница',
                                }
                                natural_boundary.splice(0,natural_boundary.length);
                            }
                        }
                        data.push({row:row,type:'children'})
                    }
                }
            }
        }

        //формируем таблицы
        let table1   = undefined
        let table2   = undefined
        let table3   = undefined
        let table4   = undefined

        table1 = this.fillTable(data,10)
        if(data.length>0){
            table2 = this.fillTable(data,10)
        }
        if(data.length>0){
            table3 = this.fillTable(data,Math.floor(data.length/2))
        }
        if(data.length>0){
            table4 = this.fillTable(data,data.length)
        }

        let measure = []

        let columns1 = {
            alignment: 'justify',
            columns: []
        }

        let columns2 = {
            pageBreak: 'before',
            alignment: 'justify',
            columns: []
        }

        if((table1) && (table1.table.body.length>0)){
            measure.push(columns1)
            columns1.columns.push(table1)
        }

        if((table2) && (table2.table.body.length>0)){
            columns1.columns.push(table2)
        }

        if((table3) && (table3.table.body.length>0)){
            measure.push(columns2)
            columns2.columns.push(table3)
        }

        if((table4) && (table4.table.body.length>0)){
            columns2.columns.push(table4)
        }
        return measure
    }

    getDefinition = (dataUrl) => {

        let measure = this.creatMeasure()
       
        var header = {
                text: 'СХЕМА',
                style: 'header',
                alignment: 'center'
            }

        var subheader = {
                text: 'расположения лесных насаждений',
                style: 'subheader',
                alignment: 'center'
            }
        var location = {
            text: "\n"+this.location,
            style: 'small',
        }

        var scale = {
            text: "Масштаб: 1:"+this.props.scale,
            style: 'small',
        }

        var area = {
            text: "Площадь, га: "+this.area,
            style: 'small',
        }

        var img = {            
            image: dataUrl,
            width: this.sizeWindow/this.koeff_print,
            height: this.sizeWindow/this.koeff_print,
            alignment: 'center'
        }

        var sign = {
            text: "\n"+this.sign,
            style: 'small',
        }

        let definition = {
            content: [
                header,
                subheader,
                location,
                scale,
                area,
                img,
                measure,
                sign
            ],
            footer: {
                columns: [
                    {
                        text: 'Подготовлено в системе "АВЕРС: МДО лесосек #5.1". Сайт: http://mdoles.ru. Версия релиза ' + BD.curentVersion,
                        style: 'footer',
                        alignment: 'center'
                    }
                ]
            },
            styles: {
                header: {
                    fontSize: 16,
                    bold: true,
                    alignment: 'justify'
                },
                subheader: {
                    fontSize: 12,
                    bold: true,
                    alignment: 'justify'
                },
                small: {
                    fontSize: 10,
                    margin: [40, 0, 0, 0],
                },
                footer: {
                    fontSize: 6
                },
                tableheader: {
                    fontSize: 10,
                    bold: true,
                },
                tablesubheader: {
                    fontSize: 8,
                    bold: true,
                },
                tablerow: {
                    fontSize: 8,
                },
            },
            defaultStyle: {
                columnGap: 20
            }
        }

        return definition
        
    }

    updateStates = () => {
        const asyncProcess = async () => {
            let dataUrl = await this.getDataUrlImage()
            let params = {
                location: this.location,
                area: this.area,
                definition: this.getDefinition(dataUrl),
                viewChildrens:this.viewChildrens,
                sign:this.sign
            }
            this.setState({
                params: params,
            })
        }
        asyncProcess()
    }


    componentDidMount(){

    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.show){
            this.creatLocation()
            this.calculateArea()
            this.updateStates()
        }
    }

    render() {

        let As_567 = () => {
            if(this.props.show){
                return <Component_567
                    handlerClose={this.props.handlerClose}
                    params={this.state.params}
                    newLocation={this.newLocation}
                    newArea={this.newArea}
                    newViewChildrens={this.newViewChildrens}
                    newSign={this.newSign}
                />
            }else{
                return null
            }
        };

        return (<As_567/>)
        
    }
}

function mapStateToProps (state) {
    return {
        opacity: state.background.opacity,
        rotate: state.background.rotate,
        scale: state.background.scale,
        objectsTree: state.polygons.objectsTree,
    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(_567)