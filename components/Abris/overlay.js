import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';

export default class Overlay extends Component {

    constructor(props) {
        super(props);
    }

    getBackground = (props) => {
        let label   = '<span class="webix_icon alerts fa-image" style="color: black;"></span>'
        let tooltip = 'Выбор подложки из файла'

        let background   = $$('abris_overlay_background')
        background.define("label",label);
        background.define("tooltip",tooltip);
        background.refresh()
        if((props.mode == 2) || (props.src != "")){
            background.disable()
        }else {
            background.enable()
        }
        if(!background.hasEvent('onItemClick')){
            background.attachEvent("onItemClick", function(id, e){
                props.handlerBackground()
            });
        }
    }

    getPrint = (props) => {

        let label   = '<i class="material-icons" style="color: black;">print</i>'
        let tooltip = 'Печать'
        let print   = $$('abris_overlay_print')
        print.define("label",label);
        print.define("tooltip",tooltip);
        print.refresh()

        if(props.mode == 2){
            print.disable()
        }else {
            print.enable()
        }

        if(!print.hasEvent('onItemClick')){
            print.attachEvent("onItemClick", function(id, e){
                props.handlerOpenSelectPrintForm();
            });
        }
    }

    getMode = (props) => {

        let label   = '<i class="material-icons" style="color: black;">create</i>'
        let tooltip = 'Выбор режима'
        let mode   = $$('abris_overlay_mode')
        mode.define("label",label);
        mode.define("tooltip",tooltip);

        if(props.mode == 2){
            mode.disable()
        }else {
            mode.enable()
        }
        mode.refresh()

        if(props.mode == 1){
            $('.abris_overlay_mode button').removeClass('abris_overlay_mode_button_active')
        }
        if(props.mode == 0){
            $('.abris_overlay_mode button').addClass('abris_overlay_mode_button_active')
        }

        if(!mode.hasEvent('onItemClick')){
            mode.attachEvent("onItemClick", function(id, e){
               props.handlerChangeMode()

            });
        }
    }

    getCreat = (props) => {

        let label   = '<div class="webix_icon"><i class="material-icons" style="color: black;">add</i></div><div class="text" style="color: black;float: right;padding-top: 4px;padding-right: 10px;">Создать</div>'
        let tooltip = 'Создание нового объекта'
        let creat   = $$('abris_overlay_creat')
        creat.define("label",label);
        creat.define("tooltip",tooltip);
        creat.refresh()

        if(props.mode == 2){
            creat.disable()
        }else {
            creat.enable()
        }

        if(!creat.hasEvent('onItemClick')){
            creat.attachEvent("onItemClick", function(id, e){
                props.handlerСreatObject()
            });
        }
    }

    getList = (props) => {

        let label   = '<div class="webix_icon"><i class="material-icons" style="color: black;">list</i></div><div class="text" style="color: black;float: right;padding-top: 4px;padding-right: 10px;">Список объектов</div>'

        let tooltip = 'Список объектов'
        let list   = $$('abris_overlay_list')
        list.define("label",label);
        list.define("tooltip",tooltip);
        list.refresh()
        if(props.mode == 2){
            list.disable()
        }else {
            list.enable()
        }
        if(!list.hasEvent('onItemClick')){
            list.attachEvent("onItemClick", function(id, e){
                props.handlerOpenListForm()
            });
        }
    }

    allactionsSubmenu = () => {
        let self = this
        return {
            view: "submenu",
            id: "allactionsSubmenu",
            autowidth: true,
            padding:0,
            css:'allactionsSubmenu',
            data: [
                {id: "selectprintform", icon: "print", value: "Печать",},
                { $template:"Separator" },
                {id: "background", icon: "image", value: "Выбор подложки",},
                {id: "backgroundclear", icon: "", value: "Удаление подложки",},
                {id: "scale", icon: "", value: "Изменение масштаба",},
                {id: "opacity", icon: "", value: "Изменение прозрачности",},
                { $template:"Separator" },
                {id: "calibrate", icon: "map-pin", value: "Калибровка",},
				{id: "clearcalibrate", icon: "", value: "Отмена калибровка",},
				{ $template:"Separator" },
				{id: "gpsbinding", icon: "", value: "Географической привязка подложки",},
                {id: "magneticdeclination", icon: "", value: "Ввод магнитного склонения",},
                { $template:"Separator" },
                {id: "SaveGeoJson", icon: "", value: "Сохранить в geoJson",},
                {id: "loadGeoJson", icon: "", value: "Загрузить из geoJson",},
            ],
            type:{
                template: function(obj){
                    if(obj.type){
                        return "<div class='separator'></div>";
                    }else {
                        return "<span class='webix_icon alerts fa-"+obj.icon+"'></span><span>"+obj.value+"</span>";
                    }
                },
                height:36
            },
            on:{
                onMenuItemClick:function(id){
                    if(id == 'selectprintform'){
                        self.props.handlerOpenSelectPrintForm();
                    }
                    if(id == 'background'){
                        self.props.handlerBackground(true);
                    }
                    if(id == 'backgroundclear'){
                        window.webix.confirm({
                            text:"Удалить подложку?", ok:"Да", cancel:"Нет",
                            callback:(res) => {
                                if(res){
                                    self.props.handlerBackground(false);
                                    self.props.handlerClearCalibrate();
                                }
                            }
                        });
                    }
                    if(id == 'scale'){
                        self.props.handlerOpenScaleForm();
                    }
                    if(id == 'opacity'){
                        self.props.handlerOpenOpacityForm();
                    }
                    if(id == 'calibrate'){
                        self.props.handlerCalibrate();
                    }
                    if(id == 'clearcalibrate'){
                        self.props.handlerClearCalibrate();
					}
					if(id == 'gpsbinding'){
                        self.props.handlerGpsBinding();
					}
                    if(id == 'magneticdeclination'){
                        self.props.handlerMagneticDeclination();
                    }
                    if(id == 'SaveGeoJson'){
                        self.props.handlerSaveGeoJson();
                    }
                    if(id == 'loadGeoJson'){
                        self.props.handlerLoadGeoJson();
                    }                    
                    self.allactionsSubmenu.hide()
                }
            },
        };
    }

    getАllactions = (props) => {

        let self = this
        let label   = '<i class="material-icons" style="color: black;">reorder</i>'
        let tooltip = 'Все действия'
        let list   = $$('abris_overlay_allactions')
        list.define("label",label);
        list.define("tooltip",tooltip);
        list.refresh()
        if(!list.hasEvent('onItemClick')){
            list.attachEvent("onItemClick", function(id, e){
                self.allactionsSubmenu.show(this.getNode(),{pos:"right"})
            });
        }
    }

    getZoom = (props) => {
        let href   = $$('abris_overlay_zoom')
        let zoomPercent = Math.round(props.zoom*100);
        let textzoom = "<label style='text-align: right; z-index: 20;position: absolute;margin-top: -10px;'>Zoom: </label><a id='zoomOverlay' href='#' style='z-index: 20;position: absolute; margin-left: 40px;;margin-top: -10px;'>"+zoomPercent+" %</a>";
        href.define("template",textzoom);
        href.refresh();
        href.show()
        $( "#zoomOverlay" ).bind( "click", function() {
            props.handlerOpenZoomForm()
        });
    }

    getRotate = (props) => {
        let href   = $$('abris_overlay_rotate')
        let roundRotate = Math.round(props.rotate);
        let textrotate = "<label style='text-align: right; z-index: 20;position: absolute;margin-top: -10px;'>Поворот: </label><a id='rotateOverlay' href='#' style='z-index: 20;position: absolute; margin-left: 60px;;margin-top: -10px;'>"+roundRotate+"&deg;</a>";
        href.define("template",textrotate);
        href.refresh();
        href.show()
        $( "#rotateOverlay" ).bind( "click", function() {
            props.handlerOpenRotateForm()
        });
    }

    componentDidMount(){

        var overlay = {
            id:"abris_overlay",
            css:"abris_overlay",
            type: "clean",
            padding:5,
            rows:[
                {
                    responsive:true,
                    cols:[
                        {
                            view:"button",
                            id:"abris_overlay_background",
                            type:"htmlbutton",
                            css:"abris_overlay_background",
                            width:55,
                            height:55,
                        },
                        /*{
                            view:"button",
                            id:"abris_overlay_mode",
                            type:"htmlbutton",
                            css:"abris_overlay_mode",
                            width:55,
                            height:55,
                        },*/
                        {
                            view:"button",
                            id:"abris_overlay_print",
                            type:"htmlbutton",
                            css:"abris_overlay_print",
                            width:55,
                            height:55,
                        },
                        {},
                        {
                            view:"button",
                            id:"abris_overlay_creat",
                            type:"htmlbutton",
                            css:"abris_overlay_creat",
                            width:120,
                            height:55,
                        },
                        {
                            view:"button",
                            id:"abris_overlay_list",
                            type:"htmlbutton",
                            css:"abris_overlay_list",
                            width:200,
                            height:55,
                        }
                    ]
                },
                {},
                {
                    responsive:true,
                    cols:[
                        {
                            view:"button",
                            id:"abris_overlay_allactions",
                            type:"htmlbutton",
                            css:"abris_overlay_allactions",
                            width:55,
                            height:55,
                        },
                        {}
                    ]
                },
                {
                    responsive:true,
                    cols:[
                        {},
                        {
                            view:"template",
                            id:"abris_overlay_zoom",
                            css:"abris_background_status",
                            autoheight:true,
                            width:100,
                        },
                        {
                            view:"template",
                            id:"abris_overlay_rotate",
                            css:"abris_background_status",
                            autoheight:true,
                            width:100,
                        },
                    ]

                }
            ]
        }

        this.ui = window.webix.ui(overlay,ReactDOM.findDOMNode(this.refs.root));

        this.allactionsSubmenu = window.webix.ui(this.allactionsSubmenu());

        this.getBackground(this.props)
        this.getPrint(this.props)
        this.getCreat(this.props)
        this.getList(this.props)
        this.getZoom(this.props)
        this.getRotate(this.props)
        this.getАllactions(this.props)

        this.ui.show()

    }

    componentWillReceiveProps(nextProps)
    {
        this.getBackground(nextProps)
        this.getPrint(nextProps)
        this.getCreat(nextProps)
        this.getList(nextProps)
        this.getZoom(nextProps)
        this.getRotate(nextProps)
        this.getАllactions(nextProps)

    }

    componentWillUnmount(){
        this.ui.destructor();
        this.ui = null;
        this.allactionsSubmenu.destructor();
        this.allactionsSubmenu = null;
    }

   

    render() {
       
        return (
            <div
                ref="root"
                id="overlay"
                style={                {
                    height: "100%",
                    width:  "100%",
                }}
            >
                {this.props.children}
            </div>
        )
    }
    
}

