import {
    CONTACTINFORMATION_FILL_SUCCESS,
    CONTACTINFORMATION_EDIT,
} from '../../../constants/settings/contactinformation'
import {getRepository} from "typeorm";
import {Contactinformation} from "../../TypeORM/entity/contactinformation";


export function fill_data() {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let repository = getRepository(Contactinformation);
            let rows = await repository.find();
            if(rows.length != 0){
                dispatch({
                    type: CONTACTINFORMATION_FILL_SUCCESS,
                    data: rows[0].contacts,
                })
            }
        }
        return asyncProcess()
    }
}

export function edit(contacts) {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let repository      = getRepository(Contactinformation);
            var row = {
                id: 1,
                contacts: contacts
            };
            await repository.save(row);
            let rows = await repository.find();
            if(rows.length != 0){
                dispatch({
                    type: CONTACTINFORMATION_EDIT,
                    data:  rows[0].contacts,
                })
            }
        }
        asyncProcess()
    }
}
