let header = function(template){
    return { view:"template",css:"headerref", template:template, type:"header" }
}

let addButton = function(context){
    return {
        view:"button",
        value:"Добавить",
        width:100,
        align:"center",
        on:{
            'onItemClick': function(id){
                context.props.handlerAdd();
            }
        }
    }
}

let copyButton = function(context){
    return {
        view:"button",
        value:"Копировать",
        width:100,
        align:"center",
        on:{
            'onItemClick': function(id){
                if(context.state.selected){
                    context.props.handlerAdd($$(context.id+'_datatable').getItem(context.state.selected.id));
                }
            }
        }
    }
}

let deleteButton = function(context){
    return {
        view:"button",
        value:"Удалить",
        width:100,
        align:"center",
        on:{
            'onItemClick': function(id){
                if(context.state.selected){
                    let text    = "Пометить выбранный элемент справочника на удаление?"
                    let status  = 1
                    if(context.state.selected.status){
                        text = "Снять пометку удаления у выбранного элемента справочника?"
                        status  = 0
                    }
                    window.webix.confirm({
                        text:text, ok:"Да", cancel:"Нет",
                        callback:(res) => {
                            if(res){
                                let values = {
                                    status:status,
                                }
                                context.props.handlerEdit($$(context.id+'_datatable').getItem(context.state.selected.id),values);
                            }
                        }
                    });
                }
            }
        }
    }
}

let search = function(context){
    return {
        view:"search", 
        align:"right", 
        placeholder:"Поиск..", 
        id:context.id+"_search", 
        width: 300}
}

let searchBind = function(context){
    $$(context.id+"_search").attachEvent("onTimedKeyPress",function(){
        //get user input value
        var value = this.getValue().toLowerCase();
        function equals(a,b){
            if(typeof(a) == 'object'){
                a = a.name.toString().toLowerCase();

            }else {
                a = a.toString().toLowerCase();
            }
            return a.indexOf(b) !== -1;
        }
        $$(context.id+"_datatable").filter(function(obj){
            for (var i = 0; i < context.search.length; i++) {
                if (equals(obj[context.search[i]], value)) return true;
            }
            return false;
        })
    });
}

let settingsButton = function(context){    
    return {
        view:"icon",
        icon: "cog",
        click: function(){
            $$(context.id+"_settings").show(this.getNode(), {pos:"bottom"});
        }
    }
}


let settingsMenu = function(context){
    return {
        view: "submenu",
        id: context.id+"_settings",
        width:350,
        data: context.menu,
        type:{
            template: function(obj){
                if(obj.type){
                    return "<div class='separator'></div>";
                }else {
                    return "</span><span>"+obj.value+"</span>";
                }
            },
            height:36
        },
        on:{
            onMenuItemClick:function(id){
                if(id == 'showDel'){
                    context.props.handlerShowAllStatus();
                }
                else if(id == 'deleteComplite'){
                    window.webix.confirm({
                        text:'Удалить все помеченные элементы?', ok:"Да", cancel:"Нет",
                        callback:(res) => {
                            if(res){
                                context.props.handlerDel();
                            }
                        }
                    });
                }else{                   
                   let target =  context.menu.find(x => x.id === id).target; 
                   if(target != undefined){
                        target.call(context);
                   }
                }
                this.hide()
            }
        },
    }
}


let menuButton = function(context,label,id,width=100){
    return {
        view:"button",
        label:label,
        width:width,
        align:"center",
        popup:context.id+"_"+id
    }
}

let popupMenu = function(context,id,template,width=300){
    return {
        view:"popup",
        id:context.id+"_"+id,
        width:width,
        body:{
            view:"list",
            id:context.id+"_"+id+'_list',
            autoheight:true,
            autowidth:true,
            select:true,
            template:template,
            on:{
                'onAfterSelect': function(id){
                    context.props.handlerAdd(id);
                    this.getParentView().hide();
                }
            }
        }
    }
}

let menuUpdate = function(context,id,data){
    let ui   = $$(context.id+"_"+id+'_list');
    ui.define("data",data);
    ui.refresh();    
}




let creatOn = function(context){

    let on = {}
    
    for (var i = 0; i < context.on.length; i++) {
        let command = context.on[i]
        if(command == "onAfterEditStop"){
            on.onAfterEditStop = function(state, editor, ignoreUpdate){
                if($$(context.id+'_datatable').validate(editor.row)){
                    let values = {
                        [editor.column]:state.value,
                    }
                    context.props.handlerEdit($$(context.id+'_datatable').getItem(editor.row),values);
                }
            }            
        }
        if(command == "onSelectChange"){
            on.onSelectChange = function(){
                context.setState({selected: this.getSelectedItem()})
            }
        }
        if(command == "onAfterSort"){
            on.onAfterSort = function(by, dir, as){
                if((context.sort.by != by) || (context.sort.dir != dir)){
                    context.props.handlerSorting(by, dir, as,this.getSelectedId(true,true)[0]);
                }
            }
        }
        if(command == "onItemDblClick"){
            on.onItemDblClick = function(id, e, node){
                context.props.handlerEditForm(this.getItem(id));
            }
        }       
    }
    return on
    
}

let datatable = function(context){
    return {
        view:"datatable",
        id:context.id+'_datatable',
        select:"row",
        multiselect:false,
        editable:context.editable,
        editaction:"dblclick",
        css:'box_shadow',
        borderless:true,
        columns:context.columns,
        on:creatOn(context),
        data: [],
        rules:context.rules,
    }
}

let datatableUpdate = function(context,props){
    
    let table   = $$(context.id+'_datatable');
    //новые данные
    table.clearAll();
    table.define("data",props.data);
    table.refresh();

    //позиционирование
    let lastId = props.currentId;
    try {
        table.select(lastId);
    } catch (err) {
        lastId = table.getLastId();
        if(lastId){
            table.select(lastId);
        }
    }

    //сортировка
    if(context.sort){
        context.sort = props.sort;
        table.sort(props.sort.by,props.sort.dir,props.sort.as);
        table.markSorting(props.sort.by,props.sort.dir);

        if(lastId){
            try {
                table.showItem(lastId);
            } catch (err) {

            }
        }
    }

    //фильтрация
    table.eachColumn(
        function (columnId){
            let columnName = table.getColumnConfig(columnId).id
            let filter = table.getFilter(columnName)
            if(filter){
                if(filter.value){
                    table.filter(function(obj){
                        if(obj[columnName] == filter.value){
                            return true;
                        }
                        return false;
                    })
                }
            }
        }
    )



}

let datatableRefreshColumns = function(context){    

    let table   = $$(context.id+'_datatable');
    table.refreshColumns(context.columns);
    
}

let datatableFieldID = function(){
    return { 
        id:"id",	    
        header:"Код", 
        sort:"int", 
        template:"<span>#id#</span><div class='status status#predefined#'></div><i class='material-icons statusdel statusdel#status#'>clear</i>"	
    }
}

let uiDestructor = function(context){
    for (var i = 0; i < context.ui.length; i++) {
        context.ui[i].destructor()
    }
}

let formResize = function(context){    
    let toolbar     = $('[view_id="toolbar"]');
    let left_menu   = $('#div_left_menu');
    let layout = $$(context.id+"_layout");

    if(left_menu.width() < 50){
        layout.define("css", 'content_min');
    }else {
        layout.define("css", 'content');
    }
    layout.define("height", left_menu.height());
    layout.define("width", toolbar.width()-left_menu.width());

    layout.resize(true);    
}




export {header,addButton,copyButton,deleteButton,search,settingsButton,settingsMenu,datatable,datatableUpdate,datatableRefreshColumns,datatableFieldID,searchBind,uiDestructor,formResize,menuButton,popupMenu,menuUpdate};