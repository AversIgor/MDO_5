import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from "typeorm";

import {Publications} from "./publications";
import {Tables} from "./tables";

@Entity()
export class Breed {

    @PrimaryGeneratedColumn()
    id = undefined;

    @Column({ type: "int", nullable: true })
    status = 0;

    @Column({ type: "text", nullable: true })
    name = '';

    @Column({ type: "text", nullable: true })
    kodGulf = '';

    @OneToOne(type => Publications, {
        eager: true,
        nullable: true,
        onDelete: "SET NULL"
    })
    @JoinColumn({referencedColumnName: "id"})
    publication: Publications = undefined;


    @OneToOne(type => Tables, {
        eager: true,
        nullable: true,
        onDelete: "SET NULL"
    })
    @JoinColumn({referencedColumnName: "id"})
    table: Tables = undefined;

    @OneToOne(type => Tables, {
        eager: true,
        nullable: true,
        onDelete: "SET NULL"
    })
    @JoinColumn({referencedColumnName: "id"})
    tablefirewood: Tables = undefined;
    
}



