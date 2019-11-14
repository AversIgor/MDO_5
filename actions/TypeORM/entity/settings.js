import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Settings {

    @PrimaryGeneratedColumn()
    id = undefined;

    @Column({ type: "simple-json", nullable: true })
    data = {};

}

