import {Entity, PrimaryGeneratedColumn, Column, OneToMany, AfterUpdate} from "typeorm";
import {getRepository} from "typeorm";

import {Subforestry} from "./subforestry";

@Entity()
export class Forestry {

    @PrimaryGeneratedColumn()
    id = undefined;

    @Column({ type: "int", nullable: true })
    status = 0;

    @Column({ type: "text", nullable: true })
    name = '';

    @Column({ type: "text", nullable: true })
    fullname = '';

    @Column({ type: "text", nullable: true })
    cod = '';

    @OneToMany(type => Subforestry, subforestry => subforestry.forestry)
    subforestrys: Subforestry[] = [];

    @AfterUpdate()
    afterUpdate() {
        const asyncProcess = async () => {
            let repository      = getRepository(Subforestry);
            let subforestrys = await repository.find({
                relations: ["forestry","tracts"],
                where: {forestry:this.id},
            });
            for (var i = 0; i < subforestrys.length; i++) {
                subforestrys[i].status = this.status
                await repository.save( subforestrys[i]);
            }            
        }
        asyncProcess()
    }

}


		
