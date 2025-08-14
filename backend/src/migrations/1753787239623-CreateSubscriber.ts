import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSubscriber1753787239623 implements MigrationInterface {
    name = 'CreateSubscriber1753787239623'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "subscribers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "email" character varying NOT NULL, "confirmToken" character varying(64), "isConfirmed" boolean NOT NULL DEFAULT false, "subscribedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_1a7163c08f0e57bd1c9821508b1" UNIQUE ("email"), CONSTRAINT "PK_cbe0a7a9256c826f403c0236b67" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "subscribers"`);
    }

}
