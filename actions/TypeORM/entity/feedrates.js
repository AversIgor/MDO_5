import {Entity, PrimaryGeneratedColumn, Column, OneToMany, AfterUpdate} from "typeorm";
import {getRepository} from "typeorm";


@Entity()
export class Feedrates {

    @PrimaryGeneratedColumn()
    id = undefined;

    @Column({ type: "int", nullable: true })
    status = 0;

    @Column({ type: "int", nullable: true })
    typesrates_id = 0;

    @Column({ type: "int", nullable: true })
    breeds_id = 0;

    @Column({ type: "int", nullable: true })
    ranktax_id = 0;

    @Column({ type: "float", nullable: true })
    large = 0;

    @Column({ type: "float", nullable: true })
    average = 0;

    @Column({ type: "float", nullable: true })
    small = 0;

    @Column({ type: "float", nullable: true })
    firewood = 0;



    

}


		
