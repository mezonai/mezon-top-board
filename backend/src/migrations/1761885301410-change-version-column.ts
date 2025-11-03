import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeVersionColumn1761885301410 implements MigrationInterface {
    name = 'ChangeVersionColumn1761885301410'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app_version" ALTER COLUMN "version" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "app_version_version_seq"`);
        await queryRunner.query(`ALTER TABLE "app_version" ALTER COLUMN "version" SET DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app_version" ALTER COLUMN "version" DROP DEFAULT`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "app_version_version_seq" OWNED BY "app_version"."version"`);
        await queryRunner.query(`ALTER TABLE "app_version" ALTER COLUMN "version" SET DEFAULT nextval('"app_version_version_seq"')`);
    }

}
