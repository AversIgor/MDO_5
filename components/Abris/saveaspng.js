import React, { Component, PropTypes } from "react";

import htmlToImage from 'html-to-image';
import * as FileSaver from "file-saver";



export default class saveasfile extends Component {

    constructor(props) {
        super(props);
    }


    trimImage = (img,x,y,width,height,rotate,globalAlpha) => {
        let canvas = document.createElement('canvas');
        canvas.width = img.parentNode.clientWidth;
        canvas.height = img.parentNode.clientHeight;
        let context = canvas.getContext('2d');
        context.translate(canvas.width/2, canvas.height/2); // set canvas context to center
        context.rotate(rotate*Math.PI/180);
        context.translate (-canvas.width / 2, -canvas.height / 2);
        context.globalAlpha  = globalAlpha;
        context.drawImage(img,x,y,width,height);
        context.restore()
        return canvas
    }

    save = () => {
        let self = this;
        let oldTop = $('#saveasfile_background').css('top')
        this.background.style.top = '0px';

        htmlToImage.toBlob(this.parentDiv)
            .then(function (blob)  {
                FileSaver.saveAs(blob, 'image.png');
                self.background.style.top = oldTop;
            });
    }


    componentDidMount(){
        let self = this;
        let node     = document.getElementById('paint')
        let modalbox = {
            view:"window",
            id:"saveasfile",
            height:node.clientHeight,
            width:node.clientWidth,
            position:"center",
            resize: true,
            move:true,
            modal:true,
            head:{
                view:"toolbar",
                cols:[
                    {
                        view:"button",
                        value:"Сохранить",
                        width:100,
                        align:"center",
                        on:{
                            'onItemClick': function(id){
                                self.save();
                            }
                        }
                    },
                    {view:"label", label: "Сохранение абриса в файл" },
                    {
                        view:"icon",
                        tooltip:"Закрыть",
                        icon: "mdi mdi-close",
                        click:function(id,event){
                            self.props.selectPrintForm(undefined);
                        }
                    }
                ]
            },
            body:{
                view: "template",
                type:"clean",
                height:node.clientHeight,
                width:node.clientWidth,
                template: "<div id='saveasfile_background' style=';position: absolute;z-index: -1;'/>"
            },
        };

        this.ui = window.webix.ui(modalbox); 
        this.ui.show();
  
        this.background = document.getElementById('saveasfile_background')
        this.parentDiv  = this.background.parentNode;
        let SVG         = document.getElementById('SVG').cloneNode(true)
        var img         = node.querySelector('#background')

        if(img){
            let canvas = this.trimImage(img,
                img.offsetLeft,
                img.offsetTop,
                img.width,
                img.height,
                self.props.rotate,//нужен rotate и возможно прозрачность
                self.props.opacity,
            )
            this.background.appendChild(canvas);
        }
        SVG.querySelectorAll(".aim").forEach(
            e => e.parentNode.removeChild(e)
        )
        this.parentDiv.appendChild(SVG);              
        
    }
    
    componentWillReceiveProps(nextProps) {       
       
    }


    componentWillUnmount(){
        this.ui.destructor();
        this.ui = null;
    }

    render() {
        return null
    }
}

