import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Abrisprintforms {

    @PrimaryGeneratedColumn("uuid")
    id = '';

    @Column({ type: "int", nullable: true })
    status = 0;

    @Column({ type: "boolean", nullable: true })
    predefined = false;

    @Column({ type: "text", nullable: true })
    name = '';

    @Column({ type: "text", nullable: true })
    printform= '';
}

