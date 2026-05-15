import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveRemark1769584364727 implements MigrationInterface {
    name = 'RemoveRemark1769584364727'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app" DROP COLUMN "remark"`);
        await queryRunner.query(`ALTER TABLE "app_version" DROP COLUMN "remark"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app_version" ADD "remark" character varying`);
        await queryRunner.query(`ALTER TABLE "app" ADD "remark" character varying`);
    }

}
