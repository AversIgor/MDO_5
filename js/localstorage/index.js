
export function clear(){
    window.webix.storage.local.clear()
}

export function put(name,value){
    window.webix.storage.local.put(name, value);
}

export function get(name){
    return window.webix.storage.local.get(name);
}

export function remove(name){
    window.webix.storage.local.remove(name);
}


