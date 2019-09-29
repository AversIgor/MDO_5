import {
    CONTACTINFORMATION_FILL_SUCCESS,
    CONTACTINFORMATION_EDIT,
} from '../../constants/settings/contactinformation'


const initialState = {
    data:{
        adress:'',
        fon:'',
        email:'',
        site:'',
    }
}


export default function contactinformation (state = initialState, action) {    
    switch(action.type) {
        case CONTACTINFORMATION_FILL_SUCCESS:
            return { ...state,
                data: action.data,
            }       
        case CONTACTINFORMATION_EDIT:
            return { ...state,
                data: action.data,
            }
        default:
            return state
    }
}