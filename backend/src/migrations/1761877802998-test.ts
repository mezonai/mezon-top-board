import { MigrationInterface, QueryRunner } from "typeorm";

export class Test1761877802998 implements MigrationInterface {
    name = 'Test1761877802998'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriber" DROP COLUMN "confirmationTokenExpires"`);
        await queryRunner.query(`ALTER TABLE "subscriber" DROP COLUMN "confirmationToken"`);
        await queryRunner.query(`ALTER TABLE "app" ADD "currentVersion" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "app" ADD "hasNewUpdate" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app" DROP COLUMN "hasNewUpdate"`);
        await queryRunner.query(`ALTER TABLE "app" DROP COLUMN "currentVersion"`);
        await queryRunner.query(`ALTER TABLE "subscriber" ADD "confirmationToken" character varying`);
        await queryRunner.query(`ALTER TABLE "subscriber" ADD "confirmationTokenExpires" TIMESTAMP WITH TIME ZONE`);
    }

}
