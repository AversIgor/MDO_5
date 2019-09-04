import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Abrissettings {

    @PrimaryGeneratedColumn()
    id = undefined;

    @Column({ type: "text", nullable: true })
    settings = '';

}

