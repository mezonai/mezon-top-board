import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMezonAppIdAndTypeToApp1750135879832 implements MigrationInterface {
    name = 'AddMezonAppIdAndTypeToApp1750135879832'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app" ADD "mezonAppId" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."app_type_enum" AS ENUM('app', 'bot')`);
        await queryRunner.query(`ALTER TABLE "app" ADD "type" "public"."app_type_enum" NOT NULL DEFAULT 'bot'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."app_type_enum"`);
        await queryRunner.query(`ALTER TABLE "app" DROP COLUMN "mezonAppId"`);
    }

}
