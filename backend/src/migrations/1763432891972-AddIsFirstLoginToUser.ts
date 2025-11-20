import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsFirstLoginToUser1763432891972 implements MigrationInterface {
    name = 'AddIsFirstLoginToUser1763432891972'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "isFirstLogin" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isFirstLogin"`);
    }

}
