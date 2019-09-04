
import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class GlobalParameters {

    @PrimaryGeneratedColumn()
    recid = undefined;

    @Column("text")
    versionDB = '';

}

