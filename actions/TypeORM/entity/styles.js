import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Styles {

    @PrimaryGeneratedColumn()
    id = undefined;

    @Column({ type: "int", nullable: true })
    status = 0;

    @Column({ type: "text", nullable: true })
    name = '';

    @Column({ type: "text", nullable: true })
    style = '';

    @Column({ type: "boolean", nullable: true })
    main = false;

}

