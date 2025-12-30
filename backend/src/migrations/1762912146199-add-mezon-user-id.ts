import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMezonUserId1762912146199 implements MigrationInterface {
    name = 'AddMezonUserId1762912146199'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "mezonUserId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "mezonUserId"`);
    }

}
