import {
    UPDATE_CHECK,
    UPDATE_INIT,
    UPDATE_COMPLETE
} from '../../constants/update'

import {BD} from "../../js/dao";


async function getCurentversion(args) {
    let result;
    let url = 'http://update.theforest.ru/update/configs/mdo5/5.2/curentversion.txt';

    try {
        result = await $.ajax({
            url: url,
            cache		: false,
            timeout     : 60000,
        });
        return result;
    } catch (error) {
        //console.error(error);
    }
}

function checkVersion(obj) {

    let result = false 

    let str_oldversion = BD.curentVersion;
    let str_newversion = obj;

    let str_oldversionformat = '';
    let arrayoldversio = str_oldversion.split('.');

    for (var i = 0; i < arrayoldversio.length; i++) {
        let podstr = arrayoldversio[i];
        while (podstr.length < 3) {
            podstr = '0'+podstr;
        }
        str_oldversionformat = str_oldversionformat+podstr;
    }

    let str_newversionformat = '';
    let arraynewversio = str_newversion.split('.');

    for (var i = 0; i < arraynewversio.length; i++) {
        let podstr = arraynewversio[i];
        while (podstr.length < 3) {
            podstr = '0'+podstr;
        }
        str_newversionformat = str_newversionformat+podstr;
    }

    let number_oldversion = parseFloat(str_oldversionformat);
    let number_newversion = parseFloat(str_newversionformat);
    if(number_oldversion < number_newversion){
        result = true;
    }

    return result

}

export function check() {

    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let newversion = await getCurentversion()
            if(! newversion) return
            if(checkVersion(newversion)){
                dispatch({
                    type: UPDATE_CHECK,
                    isUpdate: true,
                    newversion: newversion,
                })
            }
        }

        if(NODE_ENV == 'node-webkit'){
            asyncProcess();
        }

    }
}

export function init(newversion) {

    return (dispatch,getState) => {

        if(NODE_ENV == 'node-webkit'){
            let http 	= require('http');
            let fs 		= require('fs');
            let path 	= require('path');

            let nameUpdate 	= '/setup_mdo5.exe';
            let nwDir 	    = path.dirname(process.execPath);
            let update 	    = path.join(nwDir,'/update');

            if (!fs.existsSync(path.join(nwDir,'/update'))){
                fs.mkdirSync(path.join(nwDir,'/update'));
            }


            let pathUpdate 	='http://update.theforest.ru/update/tmplts/mdo5/'+newversion.replace(/\./g,'_')+nameUpdate;

            http.get(pathUpdate, function (res) {
                let fileSize = res.headers['content-length'];
                res.setEncoding('binary');
                let a = "";
                let textUpdate = "";
                res.on('data', function (chunk) {
                    a += chunk;
                    let text = 'Получение файлов - '+Math.round(100*a.length/fileSize) + "%"
                    if(text != textUpdate){
                        textUpdate = text
                        dispatch({
                            type: UPDATE_INIT,
                            textUpdate: textUpdate,
                        })                        
                    }
                });
                res.on('end', function() {
                    fs.writeFile(update+nameUpdate, a, 'binary', function (err) {
                        var gui 	= require('nw.gui');
                        require('child_process').spawn(update+nameUpdate, ['/SP-','/silent','/dir='+nwDir], { detached: true});
                        gui.App.quit();
                    });
                });
            });
        }
    }
}





