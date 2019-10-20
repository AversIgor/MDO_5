import {
    LEFTMENU_ID
} from '../../constants/decktop/leftMenu'

const initialState = {
    data: [        
        {id: "mdo", icon: "calculator",value:"Расчет МДО"},
        {id: "abrisv2", icon: "map-o",value:"Абрис (схема)"},        
        {id: "nsi",icon: "sliders", value:"НСИ", data:[        
            {id: "reference", value:"Справочники (базовые)", data:[
                { id: "forestry", value: "Лесничества"},
                { id: "subforestry", value: "Участковые лесничества"},
                { id: "tract", value: "Урочища"},
                { id: "breed", value: "Породы"},
                { id: "cuttingmethods", value: "Способы рубки"},                
            ]}, 
            {id: "mdoreference", value:"Справочники (МДО)", data:[
                { id: "publications", value: "Сортиментные таблицы"}, 
                { id: "typesrates", value: "Cтавки платы и коэффициенты"},
                { id: "methodscleanings", value: "Способы очистки"},
            ]}, 
            {id: "abrisreference", value:"Справочники (Абрис)", data:[
                { id: "styles", value: "Стили отображения абриса"},
                { id: "abrisprintforms", value: "Печатные формы"},
            ]},
        ]},
        {id: "servise",icon: "cogs", value:"Сервис", data:[
            {id: "allconstants", value:"Константы", data:[
                {id: "contactinformation", value:"Контактная информация"},
                { id: "constants", value: "Настройки расчета МДО"},
                { id: "abrissettings", value: "Настройки абриса"},                
            ]},              
            {id: "master", value:"Стартовый помощник"},
        ]},
    ],
    id: "",
}

export default function leftMenu (state = initialState, action) {
    switch(action.type) {
        case LEFTMENU_ID:
            return {...state,
                id:action.id,
            }
        default:
            return state
    }
}
