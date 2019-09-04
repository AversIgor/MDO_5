import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";

import {Subforestry} from "./subforestry";

@Entity()
export class Tract {

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

    @ManyToOne(type => Subforestry, subforestry => subforestry.tracts)
    subforestry: Subforestry = undefined;

}
