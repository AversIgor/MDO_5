import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Cuttingmethods {

    @PrimaryGeneratedColumn()
    id = undefined;

    @Column({ type: "int", nullable: true })
    status = 0;

    @Column({ type: "text", nullable: true })
    name = '';

    @Column({ type: "int", nullable: true })
    cod = 0;

    @Column({ type: "int", nullable: true })
    formCutting = 0;

    @Column({ type: "int", nullable: true })
    groupCutting = 0;

}




		
