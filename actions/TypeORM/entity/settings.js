import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Settings {

    @PrimaryGeneratedColumn()
    id = undefined;

    @Column({ type: "text", nullable: true })
    data = '';

}

