import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Printforms {

    @PrimaryGeneratedColumn("uuid")
    id = '';

    @Column({ type: "int", nullable: true })
    status = 0;

    @Column({ type: "boolean", nullable: true })
    predefined = false;

    @Column({ type: "text", nullable: true })
    name = '';

    @Column({ type: "int", nullable: true })
    type = 0;

    @Column({ type: "text", nullable: true })
    printform= '';

}

