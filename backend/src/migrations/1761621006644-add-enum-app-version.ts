import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEnumAppVersion1761621006644 implements MigrationInterface {
    name = 'AddEnumAppVersion1761621006644'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app" ADD "currentVersion" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "app" ADD "hasNewUpdate" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`CREATE TYPE "public"."app_version_type_enum" AS ENUM('app', 'bot')`);
        await queryRunner.query(`CREATE TYPE "public"."app_version_status_enum" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`CREATE TYPE "public"."app_version_pricingtag_enum" AS ENUM('FREE', 'PAID')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app" DROP COLUMN "hasNewUpdate"`);
        await queryRunner.query(`ALTER TABLE "app" DROP COLUMN "currentVersion"`);
    }

}
