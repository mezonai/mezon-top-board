import { MigrationInterface, QueryRunner } from "typeorm";

export class AppVersion1761722560702 implements MigrationInterface {
    name = 'AppVersion1761722560702'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "app_version" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "appId" uuid NOT NULL, "name" character varying NOT NULL, "status" "public"."app_version_status_enum" NOT NULL DEFAULT '0', "isAutoPublished" boolean NOT NULL DEFAULT false, "headline" character varying, "description" character varying, "prefix" character varying, "featuredImage" character varying, "supportUrl" character varying, "remark" character varying, "pricingTag" "public"."app_version_pricingtag_enum" NOT NULL DEFAULT 'FREE', "price" numeric(15,0), "version" character varying NOT NULL, "changelog" character varying, "approvedAt" TIMESTAMP, "approvedBy" character varying, CONSTRAINT "PK_f2573b981a7eac664875e7483ac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "app_version_tags_tag" ("appVersionId" uuid NOT NULL, "tagId" uuid NOT NULL, CONSTRAINT "PK_02fe213f434b0a55d2bacc777d8" PRIMARY KEY ("appVersionId", "tagId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_06583bf63ba60f75e4f45616e2" ON "app_version_tags_tag" ("appVersionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_12822b91a3b56576f793ba2f10" ON "app_version_tags_tag" ("tagId") `);
        await queryRunner.query(`CREATE TABLE "app_version_social_links_link" ("appVersionId" uuid NOT NULL, "linkId" uuid NOT NULL, CONSTRAINT "PK_bc9d24d5640cb36f6852adf6efe" PRIMARY KEY ("appVersionId", "linkId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_51086d152f83812dac4c8a5506" ON "app_version_social_links_link" ("appVersionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e96b5217bf5728e8fff3417ba9" ON "app_version_social_links_link" ("linkId") `);
        await queryRunner.query(`ALTER TABLE "app_version" ADD CONSTRAINT "FK_e9aeab5b1db8dc77708231ae44e" FOREIGN KEY ("appId") REFERENCES "app"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "app_version_tags_tag" ADD CONSTRAINT "FK_06583bf63ba60f75e4f45616e2c" FOREIGN KEY ("appVersionId") REFERENCES "app_version"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "app_version_tags_tag" ADD CONSTRAINT "FK_12822b91a3b56576f793ba2f10c" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "app_version_social_links_link" ADD CONSTRAINT "FK_51086d152f83812dac4c8a55066" FOREIGN KEY ("appVersionId") REFERENCES "app_version"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "app_version_social_links_link" ADD CONSTRAINT "FK_e96b5217bf5728e8fff3417ba95" FOREIGN KEY ("linkId") REFERENCES "link"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app_version_social_links_link" DROP CONSTRAINT "FK_e96b5217bf5728e8fff3417ba95"`);
        await queryRunner.query(`ALTER TABLE "app_version_social_links_link" DROP CONSTRAINT "FK_51086d152f83812dac4c8a55066"`);
        await queryRunner.query(`ALTER TABLE "app_version_tags_tag" DROP CONSTRAINT "FK_12822b91a3b56576f793ba2f10c"`);
        await queryRunner.query(`ALTER TABLE "app_version_tags_tag" DROP CONSTRAINT "FK_06583bf63ba60f75e4f45616e2c"`);
        await queryRunner.query(`ALTER TABLE "app_version" DROP CONSTRAINT "FK_e9aeab5b1db8dc77708231ae44e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e96b5217bf5728e8fff3417ba9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_51086d152f83812dac4c8a5506"`);
        await queryRunner.query(`DROP TABLE "app_version_social_links_link"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_12822b91a3b56576f793ba2f10"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_06583bf63ba60f75e4f45616e2"`);
        await queryRunner.query(`DROP TABLE "app_version_tags_tag"`);
        await queryRunner.query(`DROP TABLE "app_version"`);
    }

}
