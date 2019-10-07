import {
    LEFTMENU_ID
} from '../../constants/decktop/leftMenu'

const initialState = {
    data: [        
        {id: "mdo", icon: "calculator",value:"Расчет МДО"},
        {id: "abrisv2", icon: "map-o",value:"Абрис (схема)"},        
        {id: "nsi",icon: "sliders", value:"НСИ", data:[
            { id: "coefficients", value:"Коэффициенты", data:[
                { id: "coefficientsformcutting", value: "на форму рубки"},
                { id: "coefficientsrangesliquidation", value: "на ликвидный запас"},
                { id: "coefficientsdamage", value: "на степень повреждения"},
            ]},              
            {id: "reference", value:"Справочники (базовые)", data:[
                { id: "forestry", value: "Лесничества"},
                { id: "subforestry", value: "Участковые лесничества"},
                { id: "tract", value: "Урочища"},
                { id: "breed", value: "Породы"},
                { id: "cuttingmethods", value: "Способы рубки"},                
                { id: "methodscleanings", value: "Способы очистки"},
                { id: "typesrates", value: "Виды ставок платы"},
            ]}, 
            {id: "mdoreference", value:"Справочники (МДО)", data:[
                { id: "publications", value: "Сортиментные таблицы"}, 
                { id: "feedrates", value: "Установка ставок платы"},
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
