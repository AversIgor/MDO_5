import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Curentproject {

    @PrimaryGeneratedColumn()
    id = undefined;

    @Column({ type: "text", nullable: true })
    name = '';

    @Column({ type: "simple-json", nullable: true })
    data = {};


}

