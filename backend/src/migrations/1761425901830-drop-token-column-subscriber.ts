import { MigrationInterface, QueryRunner } from "typeorm";

export class DropTokenColumnSubscriber1761425901830 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriber" DROP COLUMN "confirmationTokenExpires"`);
        await queryRunner.query(`ALTER TABLE "subscriber" DROP COLUMN "confirmationToken"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriber" ADD "confirmationToken" character varying`);
        await queryRunner.query(`ALTER TABLE "subscriber" ADD "confirmationTokenExpires" TIMESTAMP WITH TIME ZONE`);
    }

}