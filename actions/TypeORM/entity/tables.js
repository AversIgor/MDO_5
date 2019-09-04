import {Entity, PrimaryColumn, Column,ManyToOne} from "typeorm";

import {Publications} from "./publications";

@Entity()
export class Tables {

    @PrimaryColumn({ type: "text", })
    id = '';

    @Column({ type: "int", nullable: true })
    status = 0;

    @Column({ type: "text", nullable: true })
    name = '';

    @Column({ type: "text", nullable: true })
    kodGulf = '';

    @Column({ type: "text", nullable: true })
    breed = ''

    @Column({ type: "simple-json", nullable: true  })
    sorttables = {}

    @ManyToOne(type => Publications, publication => publication.tables)
    publication: Publications = undefined;

}


