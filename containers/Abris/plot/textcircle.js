import React, { Component, PropTypes, Fragment} from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'

import ComponentTextCircle from "../../../components/Abris/plot/textCircle";

class TextCircle extends Component {

    constructor(props) {
        super(props);
        this.eventmousedown = true;
        this.startX         = 0;
        this.startY         = 0;
        this.startText     = undefined;
    }


    textMousedown = (event,row,index) => {
        if(this.props.mode != 0) return
        this.startX = event.pageX;
        this.startY = event.pageY;
        this.startText = {
			index: index,
			xtext: row.xtext,
			ytext: row.ytext,
        }
        this.eventmousedown = true;
    }

    textMouseup = (event) => {
        if (!this.startText) return
        this.startText = undefined
    }


    events = (off = false) => {
        let self = this;
        for (let i = 0; i < self.props.curentContour.length; i++) {
            let row     = self.props.curentContour[i];
            let textPoint = $("#"+row.id+"_text")
            let index = i
            if(textPoint){
                textPoint.off()
                if(off) continue
                textPoint.on('mouseenter', function(event) {
                    textPoint.attr({
                        'font-size':Number(textPoint.attr('font-size').replace(/[^.\d]+/g,""))+7+'px',
                    })
                });
                textPoint.on('mouseleave', function(event) {
                    textPoint.attr({
                        'font-size':self.props.curentObject.style.points.fontSize,
                    })
                });
                textPoint.on('mousedown', function(event) {
                    if(event.which == 1){
                        self.textMousedown(event,row,index)
                    }
                    event.stopPropagation()
                });
                textPoint.on('mouseup', function(event) {
                    self.textMouseup(event)
                    event.stopPropagation()
                });
            }          
        }
        this.ui.off('.text')
        if(off) return
        this.ui.on('mousemove.text', function(e) {
            if(self.props.mode != 0) return
            if (!self.eventmousedown) return
            if (!self.startText) return

            let shiftX = (event.pageX - self.startX) / self.props.zoom / (10000 / self.props.scale);
            let shiftY = (event.pageY - self.startY) / self.props.zoom / (10000 / self.props.scale);


            let newContour = self.props.curentContour.slice();
            let row = newContour[self.startText.index]
            if (row) {
                row.xtext = self.startText.xtext + shiftX
                row.ytext = self.startText.ytext + shiftY
            }
            self.props.update_contour(newContour)
            this.eventmousedown = false;
        });
    }

    componentDidUpdate(prevProps, prevState) {
        this.events(!this.props.events)
    }
    
    componentDidMount(){
        this.ui = $("#SVG");
        this.events(!this.props.events)
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

        return (<Fragment>
            {
                this.props.curentContour.map((point,index)=>{
                    return (
                        <ComponentTextCircle
                            key = {point.id}
                            point = {point}
                            position    = {this.props.position}
                            index = {index}
                            zoom = {this.props.zoom}
                            scale           = {this.props.scale}
                            mode = {this.props.mode}
                            style = {this.props.curentObject.style.points}
                        />
                    )
                })
            }
        </Fragment>)
        
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TextCircle)