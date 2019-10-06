import {Entity, PrimaryGeneratedColumn, Column, OneToMany, AfterUpdate} from "typeorm";
import {getRepository} from "typeorm";

import {Subforestry} from "./subforestry";

@Entity()
export class Foresttax {

    @PrimaryGeneratedColumn()
    id = undefined;

    @Column({ type: "int", nullable: true })
    status = 0;

    @Column({ type: "text", nullable: true })
    name = '';    

}


		
