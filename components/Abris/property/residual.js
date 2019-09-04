import {
    thumb_azimut_format
} from "../../../actions/Abris/common";

let ui = function(props){



    return {
        type: "clean",
        padding:5,
        borderless:true,
        css:"layot_background_white",
        rows:[
            { template:"Невязка", id:'residual', type:"section"},
            { cols:[
                { view:"text",id:'linearResidual', value:'', label:"Линейная", disabled:true,css:"layot_background_white"},
                { view:"text",id:'angleResidual', value:'', label:"Угловая", disabled:true,css:"layot_background_white"},
                {
                    view:"icon",
                    id:'permissibleResidual',
                    icon: "external-link-square",
                    tooltip:"Замкнуть полигон",
                    on:{
                        onItemClick:function(id, e){
                                props.contourCorrect()
                            }
                        }
                    }
                ]
            },
        ]
    }
}

let update = function(curentObject){

    let linearResidual   = $$('linearResidual');
    linearResidual.setValue(curentObject.linearResidual+' м.');
    linearResidual.refresh();

    let angleResidual   = $$('angleResidual');
    angleResidual.setValue(thumb_azimut_format(curentObject.angleResidual,true));
    angleResidual.refresh();

    let permissibleResidual   = $$('permissibleResidual');
    permissibleResidual.define("disabled",!curentObject.permissibleResidual);
    permissibleResidual.refresh();

    let residual   = $$('residual');
    if(curentObject.permissibleResidual){
        residual.define("template","Невязка");
    }else{
        residual.define("template","Невязка - недопустимая");
    }
    residual.refresh();
}

export {ui,update};