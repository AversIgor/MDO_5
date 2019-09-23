import {
    LEFTMENU_ID
} from '../../constants/decktop/leftMenu'

const initialState = {
    data: [        
        {id: "mdo", icon: "calculator",value:"Расчет МДО"},
        {id: "abrisv2", icon: "map-o",value:"Абрис (схема)"},
        {id: "parameters_mdo",icon: "sliders", value:"Параметры расчета МДО", data:[
            { id: "constants", value: "Настройки расчета МДО"},
            { id: "breed", value: "Породы"},
            { id: "publications", value: "Сортиментные таблицы"},
            { id: "typesrates", value: "Ставки платы"},
            { id: "coefficients", value:"Коэффициенты", data:[
                { id: "coefficientsformcutting", value: "на форму рубки"},
                { id: "coefficientsrangesliquidation", value: "на ликвидный запас"},
                { id: "coefficientsdamage", value: "на степень повреждения"},
            ]},
        ]},
        {id: "parameters_abris",icon: "sliders", value:"Параметры абриса", data:[
            { id: "abrissettings", value: "Настройки абриса"},
            { id: "styles", value: "Стили отображения абриса"},
            { id: "abrisprintforms", value: "Печатные формы"},
        ]},
        {id: "reference",icon: "list-ul", value:"Справочники", data:[
            { id: "forestry", value: "Лесничества"},
            { id: "subforestry", value: "Участковые лесничества"},
            { id: "tract", value: "Урочища"},
            { id: "cuttingmethods", value: "Способы рубки"},
            { id: "methodscleanings", value: "Способы очистки"},
        ]},
        {id: "servise",icon: "cogs", value:"Сервис", data:[
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
