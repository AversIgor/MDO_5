import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";

import {Feedrates} from "./feedrates";

@Entity()
export class Typesrates {


    @PrimaryGeneratedColumn()
    id = undefined;

    @Column({ type: "int", nullable: true })
    status = 0;

    @Column({ type: "boolean", nullable: true })
    predefined = false;

    @Column({ type: "int", nullable: true })
    orderroundingrates = 0;

    @Column({ type: "text", nullable: true })
    name = '';

    @Column({ type: "float", nullable: true })
    coefficientsindexing= 0.00;

    @Column({ type: "simple-json", nullable: true  })
    feedrates = {}

    
}

