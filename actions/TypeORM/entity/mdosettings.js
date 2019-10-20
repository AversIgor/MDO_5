import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Mdosettings {

    @PrimaryGeneratedColumn()
    id = undefined;
    
    @Column({ type: "simple-json", nullable: true })
    settings = {};

}