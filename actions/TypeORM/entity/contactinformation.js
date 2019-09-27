import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Contactinformation {

    @PrimaryGeneratedColumn()
    id = undefined;
    
    @Column({ type: "simple-json", nullable: true })
    contacts = {};

}