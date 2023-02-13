import { MigrationInterface, QueryRunner } from "typeorm";

export class createSchema1676298399070 implements MigrationInterface {
    name = 'createSchema1676298399070'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "projections"."monthly_income" (
                "id" SERIAL NOT NULL,
                "accountId" character varying NOT NULL,
                "month" integer NOT NULL,
                "amount" integer NOT NULL,
                CONSTRAINT "PK_e030371b648b334c9379cf75342" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "projections"."projection_state" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "latestSequenceId" integer NOT NULL,
                CONSTRAINT "PK_1b2fdf4388ee126daaea6e15f78" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "projections"."projection_state"
        `);
        await queryRunner.query(`
            DROP TABLE "projections"."monthly_income"
        `);
    }

}
