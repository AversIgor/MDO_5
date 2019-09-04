import {Entity, PrimaryColumn, Column,OneToMany, AfterUpdate} from "typeorm";
import {getRepository} from "typeorm";

import {Tables} from "./tables";


@Entity()
export class Publications {

    @PrimaryColumn({ type: "text", })
    id = '';

    @Column({ type: "int", nullable: true })
    status = 0;

    @Column({ type: "text", nullable: true })
    name = '';

    @Column({ type: "text", nullable: true })
    fullname = '';

    @Column({ type: "text", nullable: true })
    version = '';

    @Column({ type: "text", nullable: true })
    loadversion = '';

    @Column({ type: "text", nullable: true })
    official = ''

    @Column({ type: "text", nullable: true })
    developer = ''

    @Column({ type: "text", nullable: true })
    barklindenindividualreserves = ''

    @Column({ type: "text", nullable: true })
    load = ''

    @OneToMany(type => Tables, table => table.publication)
    tables: Tables[] = []

    @AfterUpdate()
    afterUpdate() {
        const asyncProcess = async () => {
            let repository      = getRepository(Tables);
            let tables = await repository.find({
                relations: ["publication"],
                where: {publication:this.id},
            });
            for (var i = 0; i < tables.length; i++) {
                tables[i].status = this.status
                await repository.save(tables[i]);
            }
        }
        asyncProcess()
    }

}

