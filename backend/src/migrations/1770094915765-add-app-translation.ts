import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAppTranslation1770094915765 implements MigrationInterface {
    name = 'AddAppTranslation1770094915765'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."app_translation_language_enum" AS ENUM('en', 'vi')`);
        await queryRunner.query(`CREATE TABLE "app_translation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "appId" uuid, "appVersionId" uuid, "language" "public"."app_translation_language_enum" NOT NULL DEFAULT 'en', "name" character varying NOT NULL, "headline" character varying, "description" text, CONSTRAINT "PK_app_translation_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."app_version_defaultlanguage_enum" AS ENUM('en', 'vi')`);
        await queryRunner.query(`ALTER TABLE "app_version" ADD "defaultLanguage" "public"."app_version_defaultlanguage_enum" NOT NULL DEFAULT 'en'`);
        await queryRunner.query(`CREATE TYPE "public"."app_defaultlanguage_enum" AS ENUM('en', 'vi')`);
        await queryRunner.query(`ALTER TABLE "app" ADD "defaultLanguage" "public"."app_defaultlanguage_enum" NOT NULL DEFAULT 'en'`);
        await queryRunner.query(`ALTER TABLE "app_translation" ADD CONSTRAINT "FK_app_translation_appId" FOREIGN KEY ("appId") REFERENCES "app"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "app_translation" ADD CONSTRAINT "FK_app_translation_appVersionId" FOREIGN KEY ("appVersionId") REFERENCES "app_version"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`
            INSERT INTO "app_translation" ("appId", "language", "name", "headline", "description")
            SELECT "id", 'en', "name", "headline", "description" 
            FROM "app"
            WHERE "name" IS NOT NULL
        `);
        await queryRunner.query(`
            INSERT INTO "app_translation" ("appVersionId", "language", "name", "headline", "description")
            SELECT "id", 'en', "name", "headline", "description" 
            FROM "app_version"
            WHERE "name" IS NOT NULL
        `);
        await queryRunner.query(`ALTER TABLE "app_version" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "app_version" DROP COLUMN "headline"`);
        await queryRunner.query(`ALTER TABLE "app_version" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "app" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "app" DROP COLUMN "headline"`);
        await queryRunner.query(`ALTER TABLE "app" DROP COLUMN "description"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app" ADD "description" text`);
        await queryRunner.query(`ALTER TABLE "app" ADD "headline" character varying`);
        await queryRunner.query(`ALTER TABLE "app" ADD "name" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "app_version" ADD "description" text`);
        await queryRunner.query(`ALTER TABLE "app_version" ADD "headline" character varying`);
        await queryRunner.query(`ALTER TABLE "app_version" ADD "name" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`
            UPDATE "app"
            SET 
                "name" = t."name",
                "headline" = t."headline",
                "description" = t."description"
            FROM "app_translation" t
            WHERE "app"."id" = t."appId" 
            AND t."language"::text = "app"."defaultLanguage"::text
        `);
        await queryRunner.query(`
            UPDATE "app_version"
            SET 
                "name" = t."name",
                "headline" = t."headline",
                "description" = t."description"
            FROM "app_translation" t
            WHERE "app_version"."id" = t."appVersionId" 
            AND t."language"::text = "app_version"."defaultLanguage"::text
        `);
        await queryRunner.query(`ALTER TABLE "app_translation" DROP CONSTRAINT "FK_app_translation_appVersionId"`);
        await queryRunner.query(`ALTER TABLE "app_translation" DROP CONSTRAINT "FK_app_translation_appId"`);
        await queryRunner.query(`ALTER TABLE "app" DROP COLUMN "defaultLanguage"`);
        await queryRunner.query(`DROP TYPE "public"."app_defaultlanguage_enum"`);
        await queryRunner.query(`ALTER TABLE "app_version" DROP COLUMN "defaultLanguage"`);
        await queryRunner.query(`DROP TYPE "public"."app_version_defaultlanguage_enum"`);
        await queryRunner.query(`DROP TABLE "app_translation"`);
        await queryRunner.query(`DROP TYPE "public"."app_translation_language_enum"`);
    }
}