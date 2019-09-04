import React, { Component, PropTypes, Fragment} from "react";
import { bindActionCreators  } from 'redux'
import { connect } from 'react-redux'
import Name from "./name";
import Polyline from "./polyline";
import Circle from "./circle";
import TextCircle from "./textcircle";


class PlotArray extends Component {

    constructor(props) {
        super(props);       
    } 

    render() {

        let self = this

        this.paint         = $("div#paint")
        let target         = {
            x: this.paint.width()/2,
            y: this.paint.height()/2
        }

        this.globalPosition = {
            x:target.x+(this.props.shift.x*this.props.zoom),
            y:target.y+(this.props.shift.y*this.props.zoom),

        }

        return (<Fragment>
                <Fragment>
                    {
                        Object.keys(this.props.objects).map(function (id) {
                            if(self.props.mode == 2 ) return null
                            if((self.props.curentObject) && (id == self.props.curentObject.id)){
                                return null
                            }else {
                                let curentObject = self.props.objects[id]
                                return(
                                    <Polyline
                                        key             = {id}
                                        curentContour   = {curentObject.contour}
                                        curentObject    = {curentObject}
                                        events          = {false}
                                        position        = {self.globalPosition}
                                    />
                                )
                            }
                        })
                    }
                </Fragment>
                <Fragment>
                    {
                        Object.keys(this.props.objects).map(function (id) {
                            if(self.props.mode == 2 ) return null
                            if((self.props.curentObject) && (id == self.props.curentObject.id)){
                                return null
                            }else {
                                let curentObject = self.props.objects[id]

                                return(
                                    <Circle
                                        key           = {id}
                                        curentContour = {curentObject.contour}
                                        curentObject  = {curentObject}
                                        position      = {self.globalPosition}
                                        events        = {false}
                                    />
                                )
                            }
                        })
                    }
                </Fragment>
                <Fragment>
                    {
                        Object.keys(this.props.objects).map(function (id) {
                            if(self.props.mode == 2 ) return null
                            if((self.props.curentObject) && (id == self.props.curentObject.id)){
                                return null
                            }else {
                                let curentObject = self.props.objects[id]
                                return(
                                    <TextCircle
                                        key           = {id}
                                        curentContour = {curentObject.contour}
                                        curentObject  = {curentObject}
                                        position      = {self.globalPosition}
                                        events        = {false}
                                    />
                                )
                            }
                        })
                    }
                </Fragment>
                <Fragment>
                    {
                        Object.keys(this.props.objects).map(function (id) {
                            if(self.props.mode == 2 ) return null
                            if((self.props.curentObject) && (id == self.props.curentObject.id)){
                                return null
                            }else {
                                let curentObject = self.props.objects[id]
                                let positionName =  {
                                    x:curentObject.xname,
                                    y:curentObject.yname
                                }
                                return(
                                    <Name
                                        key             = {id}
                                        curentObject    = {curentObject}
                                        position        = {self.globalPosition}
                                        positionName    = {positionName}
                                        events          = {false}
                                    />
                                )
                            }
                        })
                    }
                </Fragment>

        </Fragment>)
    }
}


function mapStateToProps (state) {

    return {
        zoom: state.background.zoom,
        shift: state.background.shift,
        mode: state.polygons.mode,
    }
}

function mapDispatchToProps(dispatch) {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlotArray)