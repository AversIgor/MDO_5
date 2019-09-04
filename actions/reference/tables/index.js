import {
    TABLES_FILL_SUCCESS,
} from '../../../constants/reference/tables'
import {getRepository} from "typeorm";

import {Tables} from "../../TypeORM/entity/tables";


export function fill_data(where = {}) {
    return (dispatch,getState) => {
        const asyncProcess = async () => {
            let repository = getRepository(Tables);
            let data = await repository.find({
                relations: ["publication"],
                where: where,
            });
            dispatch({
                type: TABLES_FILL_SUCCESS,
                data: data,
                where: where
            })
        }
        return asyncProcess()
    }
}
