import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateChangelogAndRemoveRemark1769412537865 implements MigrationInterface {
    name = 'UpdateChangelogAndRemoveRemark1769412537865'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            UPDATE "app_version"
            SET "changelog" = 'Version ' || "version" || ' - ' || "name"
            WHERE "changelog" IS NULL
        `);

        await queryRunner.query(`ALTER TABLE "app" DROP COLUMN "remark"`);
        await queryRunner.query(`ALTER TABLE "app_version" DROP COLUMN "remark"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app_version" ADD "remark" character varying`);
        await queryRunner.query(`ALTER TABLE "app" ADD "remark" character varying`);
    }
}