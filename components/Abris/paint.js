import React, { Component, PropTypes } from "react";

export default class Paint extends Component {

    constructor(props) {
        super(props);
    }

    keydown = (e) => {
        this.props.keydown(e)
    };
 
    events = () => {
        let self = this;        
        this.ui.on('mousewheel.paint', function(e) {
            self.props.mousewheel(e)
        });
        this.ui.on('mousemove.paint', function(e) {
            self.props.mousemove(e,self.ui)
        });
        this.ui.on('mousedown.paint', function(e) {
            self.props.mousedown(e,self.ui)
        });

        $('body').bind('keydown', this.keydown);

    }


    componentDidMount(){
        this.ui = $("div#paint");
        this.events()
        this.props.handlerComplite()
        let target      = {
            x:this.ui.width()/2,
            y:this.ui.height()/2
        }
        this.props.setTarget(target)

    }


    componentWillReceiveProps(nextProps) {
        let target      = {
            x:this.ui.width()/2,
            y:this.ui.height()/2
        }
        this.props.setTarget(target)
    }

    componentWillUnmount(){
        $('body').unbind('keydown', this.keydown);
    }

    render() {
        return (
            <div
                ref="root"
                id="paint"
                style={
                {
                    height: "100%",
                    width:  "100%",
                    zIndex:10,
                    position: 'absolute',
                }}
            >
                {this.props.children}
            </div>
        )
    }
}