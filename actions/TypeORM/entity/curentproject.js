import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Curentproject {

    @PrimaryGeneratedColumn()
    id = undefined;

    @Column({ type: "text", nullable: true })
    name = '';

    @Column({ type: "boolean", nullable: true })
    saved = false;

    @Column({ type: "simple-json", nullable: true })
    plot = {};

    @Column({ type: "simple-json", nullable: true })
    abris = {};


}

