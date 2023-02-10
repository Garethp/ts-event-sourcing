import { MigrationInterface, QueryRunner } from "typeorm";

export class generateSchema1676002951944 implements MigrationInterface {
    name = 'generateSchema1676002951944'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "eventsourcing"."bank_event_entity" (
                "id" SERIAL NOT NULL,
                "type" character varying NOT NULL,
                "data" jsonb NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_1a0ae27731e095ffa24ca324fc4" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "eventsourcing"."bank_event_entity"
        `);
    }

}
