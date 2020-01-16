import {
    LICENSE_CHECK,
} from '../../constants/license'

export function fill_data() {
    return (dispatch,getState) => {
        const asyncProcess = async () => { 
            //лицензирование
            let license  = new License()
            license.readlicense()

            if(NODE_ENV == 'node-webkit'){
                //статистика и активация лицензии
                let info  = new Info()
                let resultIP = await makeRequest("GET",info.IPserver,undefined,{});
                info.setData(getState(),license,resultIP)
                let result = await makeRequest("POST",info.server,info.data,info.getOptions());
                if(result){
                    if(license.dateactive == ''){
                        license.updatelicense(result)
                    }	
                } 
            }
            dispatch({
                type: LICENSE_CHECK,
                numberlicense: license.numberlicense,
                dateactive:license.dateactive
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
    
    updatelicense(text) {
		var obj = JSON.parse(text);		
		if(this.numberlicense == obj.numberlicense){	
			this.dateactive = obj.dateactive;	
			let license = {
				numberlicense : this.numberlicense,
				dateactive : this.dateactive,		
			}		
            this.fs.writeFileSync(this.file, JSON.stringify(license, '\t')) 
        }
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

class Info {

    constructor() {
        this.data           = {}
        this.login          = 'license'
        this.pass           = 'pkj72VM3nKTqH0pT'
        this.server         = 'http://1c.aversit.ru/mdoappreg/hs/register'
        this.IPserver       = 'https://api.ipify.org/?format=json'
    }   

    getOptions(){
        return {
            Authorization:'Basic '+ window.btoa(this.login+':'+this.pass),
            ContentType:'application/json; charset=utf-8',
            timeout:30000
        }
    }

    setData(state,license,dataIP) {
        let settings    = state.settings.data
        let typeORM     = state.typeORM    
        this.data.organization 	= settings.contacts.organization;
        this.data.responsible 	= settings.contacts.responsible;
        this.data.adress 		= settings.contacts.adress;
        this.data.fon 			= settings.contacts.fon;
        this.data.email 		= settings.contacts.email;
        this.data.site 			= settings.contacts.site;    
        this.data.version		= typeORM.curentVersion;
        
        this.data.numberlicense	= license.numberlicense;
        this.data.dateactive	= license.dateactive;
        this.data.id_db			= license.numberlicense;

        let objIP = JSON.parse(dataIP)
        if(objIP){
            this.data.ip		= objIP.ip;
        }else{
            this.data.ip		= "не установлен";
        }
    }
} 

function makeRequest(method, url,send,options) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url,true);
        if(options.Authorization){
            xhr.setRequestHeader("Authorization", options.Authorization);
        }
        if(options.ContentType){
            xhr.setRequestHeader("Content-Type", options.ContentType);
        }
        if(options.timeout){
            xhr.timeout = options.timeout;
        }        
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        if(send){
            xhr.send(JSON.stringify(send, '\t'));
        }else{
            xhr.send();
        }        
    });
}