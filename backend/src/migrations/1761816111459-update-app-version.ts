import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAppVersion1761816111459 implements MigrationInterface {
    name = 'UpdateAppVersion1761816111459'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app" ADD "currentVersion" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "app" ADD "hasNewUpdate" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`CREATE TYPE "public"."app_version_type_enum" AS ENUM('app', 'bot')`);
        await queryRunner.query(`CREATE TYPE "public"."app_version_status_enum" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`CREATE TYPE "public"."app_version_pricingtag_enum" AS ENUM('FREE', 'PAID')`);
        await queryRunner.query(`CREATE TABLE "app_version" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "status" "public"."app_version_status_enum" NOT NULL DEFAULT '0', "isAutoPublished" boolean NOT NULL DEFAULT false, "headline" character varying, "description" character varying, "prefix" character varying, "featuredImage" character varying, "supportUrl" character varying, "remark" character varying, "pricingTag" "public"."app_version_pricingtag_enum" NOT NULL DEFAULT 'FREE', "price" numeric(15,0), "appId" uuid NOT NULL, "version" integer NOT NULL DEFAULT '1', "changelog" character varying, CONSTRAINT "PK_f2573b981a7eac664875e7483ac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "app_version_tags" ("appVersionId" uuid NOT NULL, "tagId" uuid NOT NULL, CONSTRAINT "PK_7c535250eb4d7bbec4e0e12025e" PRIMARY KEY ("appVersionId", "tagId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c58be179e2f32a0ffcaa5e04d1" ON "app_version_tags" ("appVersionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_7c99fd7c8731a3d18c0807498d" ON "app_version_tags" ("tagId") `);
        await queryRunner.query(`CREATE TABLE "app_version_links" ("appVersionId" uuid NOT NULL, "linkId" uuid NOT NULL, CONSTRAINT "PK_f1b1cf7e2c2eadc74fb733b6bfe" PRIMARY KEY ("appVersionId", "linkId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a486d9951b21e3fd3a1f46dff8" ON "app_version_links" ("appVersionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_7187cff12729f5eea90e7d7229" ON "app_version_links" ("linkId") `);
        await queryRunner.query(`ALTER TABLE "app_version" ADD CONSTRAINT "FK_e9aeab5b1db8dc77708231ae44e" FOREIGN KEY ("appId") REFERENCES "app"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "app_version_tags" ADD CONSTRAINT "FK_c58be179e2f32a0ffcaa5e04d10" FOREIGN KEY ("appVersionId") REFERENCES "app_version"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "app_version_tags" ADD CONSTRAINT "FK_7c99fd7c8731a3d18c0807498d0" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "app_version_links" ADD CONSTRAINT "FK_a486d9951b21e3fd3a1f46dff8c" FOREIGN KEY ("appVersionId") REFERENCES "app_version"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "app_version_links" ADD CONSTRAINT "FK_7187cff12729f5eea90e7d72293" FOREIGN KEY ("linkId") REFERENCES "link"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app" DROP COLUMN "hasNewUpdate"`);
        await queryRunner.query(`ALTER TABLE "app" DROP COLUMN "currentVersion"`);
        await queryRunner.query(`DROP TYPE "public"."app_version_pricingtag_enum"`);
        await queryRunner.query(`DROP TYPE "public"."app_version_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."app_version_type_enum"`);
        await queryRunner.query(`ALTER TABLE "app_version_links" DROP CONSTRAINT "FK_7187cff12729f5eea90e7d72293"`);
        await queryRunner.query(`ALTER TABLE "app_version_links" DROP CONSTRAINT "FK_a486d9951b21e3fd3a1f46dff8c"`);
        await queryRunner.query(`ALTER TABLE "app_version_tags" DROP CONSTRAINT "FK_7c99fd7c8731a3d18c0807498d0"`);
        await queryRunner.query(`ALTER TABLE "app_version_tags" DROP CONSTRAINT "FK_c58be179e2f32a0ffcaa5e04d10"`);
        await queryRunner.query(`ALTER TABLE "app_version" DROP CONSTRAINT "FK_e9aeab5b1db8dc77708231ae44e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7187cff12729f5eea90e7d7229"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a486d9951b21e3fd3a1f46dff8"`);
        await queryRunner.query(`DROP TABLE "app_version_links"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7c99fd7c8731a3d18c0807498d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c58be179e2f32a0ffcaa5e04d1"`);
        await queryRunner.query(`DROP TABLE "app_version_tags"`);
        await queryRunner.query(`DROP TABLE "app_version"`);
    }

}
