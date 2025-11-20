import { MigrationInterface, QueryRunner } from "typeorm";

export class AddActivatebyUser1763652229826 implements MigrationInterface {
    name = 'AddActivatebyUser1763652229826'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_deactiveby_enum" AS ENUM('ADMIN', 'DEVELOPER')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "deactiveBy" "public"."user_deactiveby_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deactiveBy"`);
        await queryRunner.query(`DROP TYPE "public"."user_deactiveby_enum"`);
    }

}
