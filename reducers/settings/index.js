import {
    SETTINGS_EDIT,
    SETTINGS_FILL_SUCCESS,
} from '../../constants/settings/index'


/*distributionhalfbusiness - порядок распределения полуделовых: 0 - в деловые, 1 - в дрова
assessfirewoodcommonstock - Оценивать дровяную древесину по общему запасу
assesswastefirewood - Оценивать отходы от дровяных стволов
firewoodtrunkslindencountedinbark - Дровяные стволы липы учитывать в коре
orderRoundingRates - порядок округления сумм
orderRoundingValues - порядок округления объема
*/

const initialState = {
    data:{
        mdo:{
            distributionhalfbusiness:0,
            assessfirewoodcommonstock:false,
            assesswastefirewood:true,
            firewoodtrunkslindencountedinbark:false,
            orderRoundingRates:1,
            orderRoundingValues:1,
        },
        contacts:{
            organization:'',
            responsible:'',
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

