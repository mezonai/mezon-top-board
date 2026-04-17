import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserVerifiedFlag1776393871874 implements MigrationInterface {
    name = 'AddUserVerifiedFlag1776393871874'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app_translation" DROP CONSTRAINT "FK_app_translation_appVersionId"`);
        await queryRunner.query(`ALTER TABLE "app_translation" DROP CONSTRAINT "FK_app_translation_appId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "isVerified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "app_translation" ADD CONSTRAINT "FK_629a1c43aeb608f13d0d7bc1eb0" FOREIGN KEY ("appId") REFERENCES "app"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "app_translation" ADD CONSTRAINT "FK_3aa50a84a666d0ce38aeceb1c64" FOREIGN KEY ("appVersionId") REFERENCES "app_version"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app_translation" DROP CONSTRAINT "FK_3aa50a84a666d0ce38aeceb1c64"`);
        await queryRunner.query(`ALTER TABLE "app_translation" DROP CONSTRAINT "FK_629a1c43aeb608f13d0d7bc1eb0"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isVerified"`);
        await queryRunner.query(`ALTER TABLE "app_translation" ADD CONSTRAINT "FK_app_translation_appId" FOREIGN KEY ("appId") REFERENCES "app"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "app_translation" ADD CONSTRAINT "FK_app_translation_appVersionId" FOREIGN KEY ("appVersionId") REFERENCES "app_version"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
