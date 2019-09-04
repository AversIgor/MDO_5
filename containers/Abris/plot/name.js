import React, { Component, PropTypes} from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'

import ComponentName from "../../../components/Abris/plot/name";
import {namePositionCorrect} from '../../../actions/Abris/objects';

class Name extends Component {

    constructor(props) {
        super(props);
        this.eventmousedown = true;
        this.startX         = 0;
        this.startY         = 0;
        this.startName      = undefined;
    }

    handlerMousedown = (event) => {
        if((this.props.mode == 0) && (event.which == 1)){
            this.startX = event.pageX;
            this.startY = event.pageY;
            this.startName = {
                xname: this.props.curentObject.xname,
                yname: this.props.curentObject.yname,
            }
            this.eventmousedown = true;
            event.stopPropagation()
        }
    }

    handlerMouseup = (event) => {        
        if (!this.startName) return
        window.getSelection().removeAllRanges()
        this.props.namePositionCorrect(this.props.curentObject,this.props.positionName)
        this.startName = undefined
        event.stopPropagation()        
    }

    events = (off = false) => {

        let self = this;
        let ui = $("#"+this.props.curentObject.id+"_name")
        ui.attr({
            'user-select':"none",
        })

        ui.off()
        if(off) return
        let old = {}
        ui.on('mouseenter', function(event) {
            old.fontSize    = ui.attr('font-size')
            old.fill        = ui.attr('fill')
            ui.attr({
                'font-size':Number(old.fontSize.replace(/[^.\d]+/g,""))+7+'px',
                'fill':'#27ae60',
            })
        });
        ui.on('mouseleave', function(event) {
            ui.attr({
                'font-size':old.fontSize,
                'fill':old.fill,
            })
        });
        ui.on('mousedown', function(event) {
            self.handlerMousedown(event)
        });
        ui.on('mouseup', function(event) {
            self.handlerMouseup(event)
        });


        this.ui.off('.name')
        if(off) return
        this.ui.on('mousemove.name', function(e) {
            if(self.props.mode != 0) return
            if (!self.eventmousedown) return
            if (!self.startName) return
            let shiftX = (event.pageX - self.startX) / self.props.zoom / (10000 / self.props.scale);
            let shiftY = (event.pageY - self.startY) / self.props.zoom / (10000 / self.props.scale);
            let position = {
                x: self.startName.xname + shiftX,
                y: self.startName.yname + shiftY
            }
            self.props.update_positionName(position)
            this.eventmousedown = false;
        });
        
    }

    componentDidUpdate(prevProps, prevState) {
        if((prevProps.mode != 0) && (this.props.mode == 0)){
            this.events(false)
        }
        if((prevProps.mode == 0) && (this.props.mode != 0)){
            this.events(true)
        }
    }

    componentDidMount(){
        this.ui = $("#SVG");
        if (this.props.mode == 0) {
            this.events(false)
        }else{
            this.events(true)
        }
    }


    shouldComponentUpdate(nextProps, nextState) {
        let update = false
        for(let key in nextProps){
            let newValue = nextProps[key];
            let oldValue = this.props[key];
            if(newValue != oldValue){
                update = true
                break
            }
        }
        return update
    }

    render() {

        //центр+сдвиг фона-сдвиг объекта относительно фона+(-)сдвиг внутри объекта
        let position = {
            x:this.props.position.x+(this.props.positionName.x*this.props.zoom*(10000/this.props.scale)),
            y:this.props.position.y+(this.props.positionName.y*this.props.zoom*(10000/this.props.scale)),
        }

        return (<ComponentName
            curentObject = {this.props.curentObject}
            position = {position}
        />)
    }
}

function mapStateToProps (state) {
    return {
        zoom: state.background.zoom,
        scale: state.background.scale,
        mode: state.polygons.mode,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        namePositionCorrect: bindActionCreators(namePositionCorrect, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Name)