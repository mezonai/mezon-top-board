import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserIsverifiedFlag1776833000785 implements MigrationInterface {
    name = 'AddUserIsverifiedFlag1776833000785'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "isVerified" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isVerified"`);
    }

}
