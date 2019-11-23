import React, { Component, PropTypes, Fragment} from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import * as FileSaver from "file-saver";

import Saveaspng from "../../components/Abris/saveaspng";
import ComponentPrintform from "../../components/reference/printforms/printform";
import ComponentSelectprintform from "../../components/reference/printforms/selectprintform";
import {thumb_azimut_format,roundingLengths} from "../../actions/Abris/common";

class Printform extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectPrintId: undefined,
        };
        this.area =  0
    }
    calculateArea = () => {
        this.area = 0
        for(let key in this.props.objects) {
            let object = this.props.objects[key];
            this.area = this.area+object.area
        }
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

    getDataUrlImage = (width,height) => {
        //1.из SVG сделаем картнинку
        //2.Объединим подложку и картинкуSVG в один canvas необходимого размера
        //3.Сохраним канвас в base64

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
            canvas.width = width;
            canvas.height = height;

            if(img){
                let x = width/2-(paint.clientWidth/2-img.offsetLeft)
                let y = height/2-(paint.clientHeight/2-img.offsetTop)
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
            var sourceX = paint.clientWidth/2-width/2;
            var sourceY = paint.clientHeight/2-height/2;
            var sourceWidth = width;
            var sourceHeight = height;
            var destWidth = width;
            var destHeight = height;
            var destX = 0;
            var destY = 0;

            context.drawImage(rastr_image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);

            return canvas.toDataURL('image/png')

        }

        return asyncProcess();

    }

    creatMeasure = (object) => {
        //сначала сформируем массив объектов без вложенности
        let data = []

        let natural_boundary    = []
        let start_polygon       = undefined
        for (let j = 0; j < object.contour.length; j++) {
            let row = object.contour[j]
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
                    if((j == object.contour.length-1) && (start_polygon)){
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
                        natural_boundary:true,
                    }
                    natural_boundary.splice(0,natural_boundary.length);
                }
            }
            data.push(row)
        }

        return data
    }

    stringReplace(str,substr,value){
        return str.replace(new RegExp(substr,"g"), ((value) ? value : "" ))
    }

    fiLlRowObject = (template,data) => {
        let newRow  = template.clone(true)
        let html    = newRow.html()
        html = this.stringReplace(html,'~О.НаименованиеОбъекта~',data.name)
        let area    = data.area
        if(data.area != data.areaexploitation){
            area = area+' ('+data.areaexploitation+')'
        }
        html = this.stringReplace(html,'~О.ПлощадьОбъекта~',area)
        newRow.html(html)
        return newRow
    }

    feelRowExplication = (newRow,data,index) => {

        let html    = newRow.html()
        if(data){
            html = this.stringReplace(html,"~Э"+index+".Позиция~",data.position)
            html = this.stringReplace(html,"~Э"+index+".Промер~",data.distance)
            html = this.stringReplace(html,"~Э"+index+".Широта~",data.gpsX)
            html = this.stringReplace(html,"~Э"+index+".Долгота~",data.gpsY)
            if(!data.natural_boundary){
                html = this.stringReplace(html,"~Э"+index+".Румб~", data.direct+", "+thumb_azimut_format(data.rhumb,true))
                html = this.stringReplace(html,"~Э"+index+".Азимут~", thumb_azimut_format(data.azimut,true))
            }
		}		

        newRow.html(html)
        if(data){
            if(data.natural_boundary){
                let cell = newRow.find('td:contains("'+index+'.Румб")')
                if(!cell){
                    cell = newRow.find('td:contains("'+index+'.Азимут")')
                }
                if(cell){
                    cell.html('Естественная граница')
                }
            }
        }else{
            let cell = newRow.find('td:contains("~Э'+index+'.Румб~")')
            if(!cell){
                cell = newRow.find('td:contains("~Э'+index+'.Азимут~")')
			}
            if(cell){
                cell.html('')
            }
        }
        return newRow
    }

    getValueFromId(state,id) {
        let result = ""
        let item = state.find(item => item.id == id);
        if(item){
            result = item.value
        }
        return result
    }

    updateStates = (editor) => {
        this.calculateArea()
        let plotProperty = this.props.plotObject.property;
        const asyncProcess = async () => {

            let contents = jQuery(editor.contentDocument).contents()
            
            let html = contents.find('body').html()

            //замена всех возможных переменных
            let forestry = this.getValueFromId(this.props.forestry,plotProperty.location.forestry)
            html = this.stringReplace(html,'~Лесничество~',forestry)

            let subforestry = this.getValueFromId(this.props.subforestry,plotProperty.location.subforestry)
            html = this.stringReplace(html,'~УчастковоеЛесничество~',subforestry)

            let magneticdeclination = this.props.magneticdeclination.toString()+"&deg;"
            html = this.stringReplace(html,'~МагнитноеСклонение~',magneticdeclination)

            let tract = this.getValueFromId(this.props.tract,plotProperty.location.tract)
            html = this.stringReplace(html,'~Урочище~',tract)

            html = this.stringReplace(html,'~Квартал~',plotProperty.location.quarter)
            html = this.stringReplace(html,'~Выдел~',plotProperty.location.isolated)
            html = this.stringReplace(html,'~Делянка~',plotProperty.location.cuttingarea)

            html = this.stringReplace(html,'~Масштаб~',"1:"+this.props.scale)
            html = this.stringReplace(html,'~ПлощадьВсехОбъектов~',this.area)
            contents.find('body').html(html)
            

            //работа с абрисом
            let abris = contents.find('img[src="~Абрис~"]')
            if(abris.length>0){
                let dataUrl = await this.getDataUrlImage(abris.attr('width'),abris.attr('height'))
                abris.attr('src', dataUrl);
            }

            //работа с экспликацией
            let grouping_row_object         = contents.find('tr:contains("~О.")')
            if(grouping_row_object.length == 0){
                grouping_row_object         = contents.find('li:contains("~О.")')
            }

            //группировка по объектам
            if(grouping_row_object.length>0){
                let template_row_object     = grouping_row_object.clone(true)
                let parent                  = grouping_row_object.parent()
                grouping_row_object.remove()
                for(let key in this.props.objects) {
                    let object = this.props.objects[key];
                    let newRow = this.fiLlRowObject(template_row_object,object)
                    newRow.appendTo(parent)
                    //группировка по экспликации
                    let grouping_row_explication1    = newRow.find('tr:contains("~Э1.")')
                    let grouping_row_explication2    = newRow.find('tr:contains("~Э2.")')
                    let index_explication = 0;
                    if(grouping_row_explication1.length>0){
                        index_explication = 1;
                        if(grouping_row_explication2.length > 0){
                            index_explication = 2;
                        }
                        let template_row_explication        = grouping_row_explication1.clone(true)
                        let parent_explication              = grouping_row_explication1.parent()
                        grouping_row_explication1.remove()

                        let measure     = this.creatMeasure(object)
                        let rowcount1   = measure.length
                        let rowcount2   = 0

                        if(index_explication == 2){
                            rowcount2 = Math.floor(measure.length/2)
                            rowcount1 = measure.length-rowcount2
                        }

                        for (let i = 0; i < rowcount1; i++) {
                            let row1    = measure[i]
                            let row2    = measure[i+rowcount1]
                            let newRow  = template_row_explication.clone(true)
                            newRow = this.feelRowExplication(newRow,row1,1)
                            newRow = this.feelRowExplication(newRow,row2,2)
                            newRow.appendTo(parent_explication)
                        }



                    }
                }
            }            
            return
        }
        asyncProcess()
    }

    convertImagesToBase64 = (contentDocument) => {
        var regularImages = contentDocument.querySelectorAll("img");
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        [].forEach.call(regularImages, function (imgElement) {
            // preparing canvas for drawing
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.width = imgElement.width;
            canvas.height = imgElement.height;

            ctx.drawImage(imgElement, 0, 0);
            // by default toDataURL() produces png image, but you can also export to jpeg
            // checkout function's documentation for more details
            var dataURL = canvas.toDataURL();
            imgElement.setAttribute('src', dataURL);
        })
        canvas.remove();
    }

    saveContent = (contentDocument,name) => {
        //let contents = jQuery(editor.contentDocument).contents()
        //let html = contents.find('body').html()
        this.convertImagesToBase64(contentDocument)
        var content = '<!DOCTYPE html>' + contentDocument.documentElement.outerHTML;
        var converted = htmlDocx.asBlob(content, {orientation: 'portrait'});
        FileSaver.saveAs(converted, name+'.docx');
    }

    selectPrintForm = (id) => {  
        this.setState({selectPrintId:id})
    }

    render() {

        let meny = []
        if(this.props.type == 1){
            meny.push({ id:1, title:"Сохранить абрис в файл"})
        }
        for (let i = 0; i < this.props.printforms.length; i++) {
            if(this.props.printforms[i].type == this.props.type){
                meny.push({ id:this.props.printforms[i].id, title:this.props.printforms[i].name})
            }
        }

        let Printform = () => {
            if(this.state.selectPrintId == 1){
                return <Saveaspng
                            selectPrintForm={this.selectPrintForm}
                            opacity={this.props.opacity}
                            rotate={this.props.rotate}
                        />;
            }
            if ((this.state.selectPrintId != 1) && (this.state.selectPrintId != undefined)){
                return <ComponentPrintform
                            selectPrintForm={this.selectPrintForm}
                            updateStates={this.updateStates}
                            saveContent={this.saveContent}
                            data={this.props.printforms.find(item => item.id == this.state.selectPrintId)}                            
                        />;
            }
            if(this.state.selectPrintId == undefined){
                return null
            }            
        }

        return (
            <Fragment>
                <Printform/>;
                <ComponentSelectprintform
                    open={this.props.open}
                    handlerOpenClose={this.props.handlerOpenClose}
                    selectPrintForm={this.selectPrintForm}
                    data={meny}
                />
            </Fragment>
        )
    }
}

function mapStateToProps (state) {
    return {
        opacity: state.background.opacity,
        rotate: state.background.rotate,
        scale: state.background.scale,
        objects: state.polygons.objects,
        plotObject:state.plot.plotObject,
        magneticdeclination: state.background.magneticdeclination,
        forestry:state.forestry.data,
        subforestry:state.subforestry.data,
        tract:state.subforestry.data,
        printforms: state.printforms.data,
        
    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Printform)