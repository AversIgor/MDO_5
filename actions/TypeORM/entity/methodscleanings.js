import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Methodscleanings {

    @PrimaryGeneratedColumn()
    id = undefined;

    @Column({ type: "int", nullable: true })
    status = 0;

    @Column({ type: "text", nullable: true })
    name = '';

    @Column({ type: "text", nullable: true })
    fullname = '';

}