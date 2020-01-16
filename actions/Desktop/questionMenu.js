import {
    TOOLBAR_QUESTIONMENU_ID
} from '../../constants/decktop/toolbar'

export function clickQuestionMenu(id) {

    if(id == "site"){
        if(NODE_ENV == 'node-webkit'){
            require('child_process').exec('explorer http://mdoles.ru/');
        }else{
            location.href = 'http://mdoles.ru/';
        }
    }    

    return (dispatch,getState) => {

        if(id == "question"){
            var exec = 'http://mdoles.ru/'
            let settings = getState().settings.data;
            exec = exec+'?lic='+getState().license.numberlicense;
            exec = exec+'&name='+encodeURIComponent(settings.contacts.responsible);
            exec = exec+'&p=feedback';
            exec = exec+'&email='+settings.contacts.email;
            exec = exec+'&fon='+settings.contacts.fon;
            window.open( exec,"feedback", "width='450',height='250'" );
        }

        dispatch({
            type: TOOLBAR_QUESTIONMENU_ID,
            id: id,
        })
    }

}