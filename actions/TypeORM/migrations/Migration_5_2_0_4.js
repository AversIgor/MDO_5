import {createConnection, getManager, TableColumn} from "typeorm";
import {Styles} from "../entity/styles"
import {Abrissettings} from "../entity/abrissettings"
import {Forestry} from "../entity/forestry"
import {Subforestry} from "../entity/subforestry"
import {Tract} from "../entity/tract"
import {Cuttingmethods} from "../entity/cuttingmethods"
import {Publications} from "../entity/publications"
import {Tables} from "../entity/tables";
import {Breed} from "../entity/breed";
import {Abrisprintforms} from "../entity/abrisprintforms"

export function Migration_5_2_0_4(conectionOption) {
    const asyncProcess = async (conectionOption) => {
        let newOption = {...conectionOption}
        newOption.synchronize = true;
        try {
            newOption.entities = [
                Styles
            ]
            let connection      = await createConnection(newOption);
            await connection.close();
        } catch (error) {

        }

        try {
            newOption.entities = [
                Abrissettings
            ]
            let connection      = await createConnection(newOption);
            await connection.close();
        } catch (error) {

        }

        try {
            newOption.entities = [
                Forestry
            ]
            let connection      = await createConnection(newOption);
            await connection.close();
        } catch (error) {

        }

        try {
            newOption.entities = [
                Subforestry
            ]
            let connection      = await createConnection(newOption);
            await connection.close();
        } catch (error) {

        }
        
        try {
            newOption.entities = [
                Tract
            ]
            let connection      = await createConnection(newOption);
            await connection.close();
        } catch (error) {

        }

        try {
            newOption.entities = [
                Cuttingmethods
            ]
            let connection      = await createConnection(newOption);
            await connection.close();
        } catch (error) {

        }

        try {
            newOption.entities = [
                Publications
            ]
            let connection      = await createConnection(newOption);
            await connection.close();
        } catch (error) {

        }
        
        try {
            newOption.entities = [
                Tables
            ]
            let connection      = await createConnection(newOption);
            await connection.close();
        } catch (error) {

        }


        try {
            newOption.entities = [
                Breed
            ]
            let connection      = await createConnection(newOption);
            await connection.close();
        } catch (error) {

        }
        try {
            newOption.entities = [
                Abrisprintforms
            ]
            let connection      = await createConnection(newOption);
            await connection.close();
        } catch (error) {

        }

    }
    return asyncProcess(conectionOption);
}
