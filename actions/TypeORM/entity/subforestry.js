import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany,AfterUpdate} from "typeorm";
import {getRepository} from "typeorm";

import {Forestry} from "./forestry";
import {Tract} from "./tract";


@Entity()
export class Subforestry {

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

    @ManyToOne(type => Forestry, forestry => forestry.subforestrys)
    forestry: Forestry = undefined;

    @OneToMany(type => Tract, tract => tract.subforestry)
    tracts: Tract[] = [];
    
    @AfterUpdate()
    afterUpdate() {
        const asyncProcess = async () => {
            let repository      = getRepository(Tract);
            let tructs = await repository.find({
                relations: ["subforestry"],
                where: {subforestry:this.id},
            });
            for (var i = 0; i < tructs.length; i++) {
                tructs[i].status = this.status
                await repository.save(tructs[i]);
            }
        }
        asyncProcess()
    }
    
}
