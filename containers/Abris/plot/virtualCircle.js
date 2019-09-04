import React, { Component, PropTypes, Fragment} from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'

import ComponentVirtualCircle from "../../../components/Abris/plot/virtualCircle";


class VirtualCircle extends Component {

    constructor(props) {
        super(props);
    }

    events = (off = false) => {

        let self = this;
        for (let i = 0; i < self.props.curentContour.length; i++) {
            let row     = self.props.curentContour[i];
            if((row.x == row.xc) && (row.y == row.yc)) continue
            let virtualPoint = $("#"+i+"_virtual")
            let index = i
            if(virtualPoint){
                virtualPoint.off()
                if(off) continue
                virtualPoint.on('mouseenter', function(event) {
                    virtualPoint.attr({
                        r:'6',
                        fill:'#27ae60'
                    })
                });
                virtualPoint.on('mouseleave', function(event) {
                    virtualPoint.attr({
                        r:'4',
                        fill:'white'
                    })
                    virtualPoint.attr(self.props.curentObject.style.points)
                });
                virtualPoint.on('mousedown', function(event) {
                    event.stopPropagation()
                });
                virtualPoint.on('dblclick', function(event) {
                    if(event.which == 1){
                        self.props.polygonMousedown(event,index)
                    }
                    event.stopPropagation()
                });
                
            }          
        }
    }


    componentDidUpdate(prevProps, prevState) {
        if((prevProps.mode != 0) && (this.props.mode == 0)){
            this.events(false)
        }
        if((prevProps.mode == 0) && (this.props.mode != 0)){
            this.events(true)
        }
        if(prevProps.curentContour.length != this.props.curentContour.length){
            this.events(false)
        }
    }

    componentDidMount(){        
        if (this.props.mode == 0) {
            this.events(false)
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

        if(this.props.mode) return null

        return (<Fragment>
            {
                this.props.curentContour.map((point,index)=>{
                    return (
                        <ComponentVirtualCircle
                            key = {point.id}
                            point = {point}
                            curentContour = {this.props.curentContour}
                            position    = {this.props.position}
                            zoom = {this.props.zoom}
                            scale       = {this.props.scale}
                            index = {index}
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

export default connect(mapStateToProps, mapDispatchToProps)(VirtualCircle)