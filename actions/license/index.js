import {
    LICENSE_CHECK,
} from '../../constants/license'


export function fill_data() {
    return (dispatch,getState) => {
        const asyncProcess = async () => { 
            let license  = new License()
            license.readlicense()
            sendingDataServer(getState(),license)
            dispatch({
                type: LICENSE_CHECK,
                numberlicense: license.numberlicense,
                dateactive:license.license
            })
        }
        return asyncProcess()
    }
}

class License {

    constructor() {
        this.numberlicense  = ''
        this.dateactive     = ''
        this.file           = ''
        if(NODE_ENV == 'node-webkit'){
            this.fs 	= require('fs');
            this.path 	= require('path')
            this.os 	= require('os');
            this.crypto	= require('crypto');	
        }
    }    
    
    readlicense() {
        if(NODE_ENV == 'node-webkit'){
            this.file  = this.path.join(this.licensepath(),'/license.txt');            
            if (!this.fs.existsSync(this.file)){
                this.newlicense();
            }
            let txt = this.fs.readFileSync(this.file, 'utf8');
            if(txt){
                let data            = JSON.parse(txt);
                this.numberlicense  = data.numberlicense;
                this.dateactive     = data.dateactive;
            }            
        }else{
            this.numberlicense = 'Лицензия WEB'
        }
    }

    newlicense() {
		let md5 		= this.crypto.createHash('md5');
		md5.update(new Date().toString());
        let hash 		= md5.digest('hex');        
		let license = {
			numberlicense : hash.match(/.{8}/g).join('-'),
			dateactive : '',		
		}
        this.fs.writeFileSync(this.file, JSON.stringify(license, '\t')) 
	}

    licensepath () {
        var localpath = '';	
        if(NODE_ENV == 'node-webkit'){        
            var pathsplit = this.os.tmpdir().split(this.path.sep);	        
            for (var index = 0; index < pathsplit.length-1; ++index) {
                if(index == 0){
                    localpath = this.path.join(localpath,pathsplit[index]+'/');	
                }else{
                    localpath = this.path.join(localpath,pathsplit[index]);	
                }
            }
            if (!this.fs.existsSync(this.path.join(localpath,'/Avers'))){
                this.fs.mkdirSync(this.path.join(localpath,'/Avers'));
            }
            if (!this.fs.existsSync(this.path.join(localpath,'/Avers/MDO5'))){
                this.fs.mkdirSync(this.path.join(localpath,'/Avers/MDO5'));
            }			
            localpath = this.path.join(localpath,'/Avers/MDO5');
        }
        return localpath;		
	}
}

function sendingDataServer(state,license) {
    
    let settings    = state.settings.data
    let typeORM     = state.typeORM

    var all = {};
    all.organization 	= settings.contacts.organization;
    all.responsible 	= settings.contacts.responsible;
    all.adress 			= settings.contacts.adress;
    all.fon 			= settings.contacts.fon;
    all.email 			= settings.contacts.email;
    all.site 			= settings.contacts.site;    
    all.version			= typeORM.curentVersion;
    
    all.numberlicense	= license.numberlicense;
    all.dateactive		= license.dateactive;
    all.id_db			= license.numberlicense;
    all.ip				= 'this.data.ip';
    
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://1c.aversit.ru/mdoappreg/hs/register", true);
    
    var login 	= 'license';
    var pass 	= 'pkj72VM3nKTqH0pT';
    var Authorization = 'Basic '+ window.btoa(login+':'+pass);	
    xhr.setRequestHeader("Authorization", Authorization);
    
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    xhr.timeout = 30000;

    xhr.onreadystatechange = function() { // (3)
        if (xhr.readyState != 4) return;

        if (xhr.status != 200) {
        } else {
            console.log(xhr.responseText)
            //проверим в переменной состояние активации лицензии
            //if(w2utils.isDate(MASTER.data.dateactive,'dd.mm.yyyy') == false){
              // console.log(xhr.responseText)
                // MASTER.updatelicense(xhr.responseText);	
           //}			
        }
    }
    xhr.send(JSON.stringify(all, '\t'));

}	
