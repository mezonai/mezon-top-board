import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAppVersionRefToReviewHistory1761817949943 implements MigrationInterface {
    name = 'AddAppVersionRefToReviewHistory1761817949943'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app_review_history" ADD "appVersionId" uuid NULL`);
        await queryRunner.query(`
            UPDATE "app_review_history" arh
            SET "appVersionId" = av."id"
            FROM "app_version" av
            WHERE av."appId" = arh."appId" AND av."version" = 1
        `);
        await queryRunner.query(`ALTER TABLE "app_review_history" ADD CONSTRAINT "FK_f78f2d3b07772972ff9432343ce" FOREIGN KEY ("appVersionId") REFERENCES "app_version"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`
            ALTER TABLE "app_review_history"
            ALTER COLUMN "appVersionId" SET NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app_review_history" DROP CONSTRAINT "FK_f78f2d3b07772972ff9432343ce"`);
        await queryRunner.query(`ALTER TABLE "app_review_history" DROP COLUMN "appVersionId"`);
    }

}
