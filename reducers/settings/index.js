import {
    SETTINGS_EDIT,
    SETTINGS_FILL_SUCCESS,
} from '../../constants/settings/index'

const initialState = {
    contacts:{
        adress:'',
        fon:'',
        email:'',
        site:'',
    },
    abris:{
        main:{
			typeangle:'Румбы',
        },
        rounding:{
            square:100, //1 - 1.0, 10  - 1.1,100  - 1.11,
            angle:30,//60 - грудусы, 30  - 30 минут , 10  - 10 минут, 1 - минуты
            lengths:10,//1 - 1.0, 10  - 1.1,100  - 1.11,
        },
        residual:{
            linear:1, //1 метр на 300 метров
            angle:30,//60 - грудусы, 30  - 30 минут , 10  - 10 минут, 1 - минуты
        },
    },
}

export default function settings (state = initialState, action) {
    switch(action.type) {
        case SETTINGS_FILL_SUCCESS:
            return { ...state,
                data: action.data,
            }       
        case SETTINGS_EDIT:
            return { ...state,
                data: action.data,
            }
        default:
            return state
    }
}

