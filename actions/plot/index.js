import {
    CHANGE_PROPERTY,
} from '../../constants/plot'


export function changeProperty(newProperty) {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            dispatch({
                type: CHANGE_PROPERTY,
                property: newProperty
            })
        }
        return asyncProcess()
    }
}
