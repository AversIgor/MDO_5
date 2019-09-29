import {
    TOOLBAR_QUESTIONMENU_ID
} from '../../constants/decktop/toolbar'

import {MASTER} from "../../js/master";
import {ALLCONSTANT} from "../../js/allconstant";
import {INFOMSGS} from "../../js/infomsg";

export function clickQuestionMenu(id) {

    if(id == "site"){
        if(NODE_ENV == 'node-webkit'){
            require('child_process').exec('explorer http://mdoles.ru/');
        }else{
            location.href = 'http://mdoles.ru/';
        }
    }
    if(id == "question"){
        var exec = 'http://mdoles.ru/'
        exec = exec+'?lic='+MASTER.data.numberlicense;
        exec = exec+'&name='+encodeURIComponent(ALLCONSTANT.data.responsible);
        exec = exec+'&p=feedback';
        if('contacts' in ALLCONSTANT.data){
            var contacts = JSON.parse(ALLCONSTANT.data.contacts);
            if(contacts != null){
                exec = exec+'&email='+contacts.email;
                exec = exec+'&fon='+contacts.fon;
            }
        }
        window.open( exec,"feedback", "width='450',height='250'" );
    }
    if(id == "infomsg"){
        INFOMSGS.init(true);
    }

    return (dispatch,getState) => {
        dispatch({
            type: TOOLBAR_QUESTIONMENU_ID,
            id: id,
        })
    }


}