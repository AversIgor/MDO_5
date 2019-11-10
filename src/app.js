import React from 'react';
import {render} from 'react-dom';
import { Provider } from 'react-redux'

import configureStore from '../store/configureStore';

import Desktop from '../containers/Desktop';
import TypeORM from '../containers/TypeORM';
import Update from '../containers/update';

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