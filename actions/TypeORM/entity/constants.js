import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

/*КОНСТАНТЫ
distributionhalfbusiness - порядок распределения полуделовых: 0 - в деловые, 1 - в дрова
assessfirewoodcommonstock - Оценивать дровяную древесину по общему запасу
assesswastefirewood - Оценивать отходы от дровяных стволов
firewoodtrunkslindencountedinbark - Дровяные стволы липы учитывать в коре
barklindenindividualreserves - Липа в сортиментных таблицах отдельным параметром
orderRoundingRates - порядок округления сумм
orderRoundingValues - порядок округления объема
organization - Организация
responsible - Ответственный
contacts - данные контактным данным в json формате
publication - Основная сортиментная таблица - ссылка на идентификатор
foresttax - Текущие ставки платы
id_db - идентификатор базы данных
 */


@Entity()
export class Constants {

    @PrimaryGeneratedColumn()
    id = undefined;

    @Column({ type: "int", nullable: true })
    distributionhalfbusiness = 0;

    @Column({ type: "int", nullable: true })
    assessfirewoodcommonstock = 0;

    @Column({ type: "int", nullable: true })
    assesswastefirewood = 0;

    @Column({ type: "int", nullable: true })
    firewoodtrunkslindencountedinbark = 0;

    @Column({ type: "int", nullable: true })
    barklindenindividualreserves = 0;

    @Column({ type: "int", nullable: true })
    orderRoundingRates = 0;

    @Column({ type: "int", nullable: true })
    orderRoundingValues = 0;

    @Column({ type: "text", nullable: true })
    organization = '';

    @Column({ type: "text", nullable: true })
    responsible = '';

    @Column({ type: "simple-json", nullable: true })
    contacts = {};

    @Column({ type: "text", nullable: true })
    publication = '';

    @Column({ type: "int", nullable: true })
    foresttax = 0;

    @Column({ type: "text", nullable: true })
    id_db = '';

}




		
