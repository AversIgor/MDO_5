import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import {getRepository} from "typeorm";

import {Typesrates} from "./typesrates";

@Entity()
export class Feedrates {

    @PrimaryGeneratedColumn()
    id = undefined;

    @Column({ type: "int", nullable: true })
    status = 0;

    @Column({ type: "int", nullable: true })
    breed = 0;

    @Column({ type: "int", nullable: true })
    ranktax = 0;

    @Column({ type: "float", nullable: true })
    large = 0;

    @Column({ type: "float", nullable: true })
    average = 0;

    @Column({ type: "float", nullable: true })
    small = 0;

    @Column({ type: "float", nullable: true })
    firewood = 0;



}


		
