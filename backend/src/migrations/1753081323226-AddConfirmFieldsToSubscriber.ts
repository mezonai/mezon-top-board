import { MigrationInterface, QueryRunner } from "typeorm";

export class AddConfirmFieldsToSubscriber1753081323226 implements MigrationInterface {
    name = 'AddConfirmFieldsToSubscriber1753081323226'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscribers" ADD "confirmToken" character varying(64)`);
        await queryRunner.query(`ALTER TABLE "subscribers" ADD "isConfirmed" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscribers" DROP COLUMN "isConfirmed"`);
        await queryRunner.query(`ALTER TABLE "subscribers" DROP COLUMN "confirmToken"`);
    }

}
