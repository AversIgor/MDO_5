import React, { Component, PropTypes, Fragment } from "react";

let style ={
    'WebkitUserSelect':"none"
}

export default class GpsMark extends Component {

    constructor(props) {
        super(props);
    }   

    render() {

        let point = this.props.point

        let x = this.props.position.x+(point.x*this.props.zoom*(10000/this.props.scale))
		let y = this.props.position.y+(point.y*this.props.zoom*(10000/this.props.scale))
        
        let fill        = this.props.style.fill || '#2f89c6'
		let fillOpacity = this.props.style.fillOpacity || '1'
		let strokeWidth	= this.props.style.strokeWidth || '0.02802445'
		let d			= "M 8.4949198e-4,-10.409043 C -2.2102252,-10.409047 -4.0026563,-8.6166162 -4.0026521,-6.405542 -4.0026567,-4.1944684 8.4949198e-4,5.5427292e-5 8.4949198e-4,5.5427292e-5 c 0,0 4.00350660802,-4.194523827292 4.00350160802,-6.405597427292 4.2e-6,-2.2110742 -1.7924273,-4.003509 -4.00350160802,-4.003501 z m 0,1.8816309 C 1.1063866,-8.5273968 2.0025903,-7.6311698 2.0025731,-6.5256322 2.0025604,-5.4201146 1.1063656,-4.523922 8.4949198e-4,-4.5239067 -1.1046882,-4.5238914 -2.0009155,-5.4200955 -2.0009285,-6.5256322 c -1.72e-5,-1.1055605 0.8962193,-2.0017952 2.00177799198,-2.0017799 z"
		let size		= '3'

		return (<path
					id={point.id}
					strokeWidth = {strokeWidth}
					stroke = "black"
					fill =  {fill}
					fillOpacity = {fillOpacity}
					style={style}
					d={d}
					transform={"translate("+x+","+y+") scale("+size+", "+size+")"}
				></path>
        )
    }
}

