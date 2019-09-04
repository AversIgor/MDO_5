import React, { Component, PropTypes } from "react";

export default class Confirm extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(){

        let _this = this;
        var form = {
            title:"<b>Внимание!</b>",
            ok:"Да", cancel:"Нет",
            type:"confirm-warning",
            text:"Загрузка файла региональных настроек стирает все данные, введенные в программу!<br>Вы хотите продолжить?",
            callback:function(result){
                if(result) _this.props.restoreDB();
            }
        }

        window.webix.confirm(form);

    }

    componentWillUnmount(){

    }

    shouldComponentUpdate(){
        return false;
    }

    render() {
        return (
            <div ref="root"></div>
        )
    }

}