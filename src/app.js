import React from 'react';
import {render} from 'react-dom';
import { Provider } from 'react-redux'

import configureStore from '../store/configureStore';

import Desktop from '../containers/Desktop';
import TypeORM from '../containers/TypeORM';
import Update from '../containers/update';

import {BD} from "../js/dao";
import {DESKTOP} from "../js/desktop";
import * as MDO from "../js/mdo";
w2utils.locale('other/ru-ru.json');
import materialIcons from 'material-design-icons/iconfont/material-icons.css'
webix.codebase = "../other/tinymce/";

//отсюда начинается react и redux
export const store = configureStore();


render(<Provider store={store}>
    <div style={{height:"100%",width:"100%"}}>
        <TypeORM />
        <Desktop />
        <Update />
    </div>
    </Provider>,
    document.getElementById('box')
)


if(NODE_ENV == 'node-webkit'){
    const handler = confirmSave;
    const callback = function () {
        nw.Window.get().close(true);
    };
    nw.Window.get().on('close', function() {
        handler(callback);
    });
}


export function confirmSave(callback) {
    if(MDO.objectMDO.projectModified) {

        //если уже открыт какой-либо popup, то закрываем его
        if ($('#w2ui-popup').length > 0) {
            w2popup.close();
        }

        window.APP_handlerNo = function () {
            w2popup.close();
            callback();
        };
        window.APP_handlerYes = function () {
            w2popup.close();
            MDO.save(callback);
        };
        var btnStyle = 'width: 80px; margin:0 10px; padding: 5px; border-radius: 4px; border: 1px solid #B6B6B6;';
        w2popup.open({
            title     : '',
            body      : '<div style="padding: 30px; text-align: center">Сохранить изменения в проекте?</div>',
            buttons   : 
            '<button style="' + btnStyle + '" onclick="APP_handlerYes()">Да</button> '+
            '<button style="' + btnStyle + '" onclick="APP_handlerNo();">Нет</button> '+
            '<button style="' + btnStyle + '" onclick="w2popup.close();">Отмена</button>',
            width     : 400,
            height    : 150,
            overflow  : 'hidden',
            color     : '#333',
            speed     : '0.3',
            opacity   : '0.8',
            modal     : true,
            showClose : false,
            showMax   : false
        });
    } else {
        callback();
    }
}


BD.open();
DESKTOP.init();