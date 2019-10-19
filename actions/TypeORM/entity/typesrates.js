import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";


@Entity()
export class Typesrates {

    @PrimaryGeneratedColumn()
    id = undefined;

    @Column({ type: "int", nullable: true })
    status = 0;

    @Column({ type: "boolean", nullable: true })
    predefined = false;

    @Column({ type: "int", nullable: true })
    orderroundingrates = 0;

    @Column({ type: "text", nullable: true })
    name = '';

    @Column({ type: "text", nullable: true })
    region = '';

    @Column({ type: "float", nullable: true })
    coefficientsindexing= 0.00;

    //СТАВКИ ПЛАТЫ
    @Column({ type: "simple-json", nullable: true  })
    feedrates = {}

    //КОЭФФИЦИЕНТЫ НА ЛИКВИДНЫЙ ЗАПАС
    @Column({ type: "simple-json", nullable: true  })
    coefficientsrangesliquidation = {}

    
}

