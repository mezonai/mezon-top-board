import { MigrationInterface, QueryRunner } from "typeorm";

export class FillDataToAppVersion1761816888104 implements MigrationInterface {
    name = 'FillDataToAppVersion1761816888104'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        INSERT INTO "app_version" (
            "id",
            "appId",
            "version",
            "name",
            "status",
            "headline",
            "description",
            "prefix",
            "featuredImage",
            "supportUrl",
            "remark",
            "price",
            "pricingTag",
            "createdAt",
            "updatedAt"
        )
        SELECT
            gen_random_uuid(),
            "id" AS "appId",
            1 AS "version",
            "name",
            "status"::text::app_version_status_enum,
            "headline",
            "description",
            "prefix",
            "featuredImage",
            "supportUrl",
            "remark",
            "price",
            "pricingTag"::text::app_version_pricingtag_enum,
            now(),
            now()
        FROM "app";
        `);

        await queryRunner.query(`
            INSERT INTO "app_version_tags" ("appVersionId", "tagId")
            SELECT av."id", at."tagId"
            FROM "app_version" av
            JOIN "app" a ON av."appId" = a."id"
            JOIN "app_tags_tag" at ON at."appId" = a."id"
            WHERE av."version" = 1;
        `);

        await queryRunner.query(`
            INSERT INTO "app_version_links" ("appVersionId", "linkId")
            SELECT av."id", al."linkId"
            FROM "app_version" av
            JOIN "app" a ON av."appId" = a."id"
            JOIN "app_social_links_link" al ON al."appId" = a."id"
            WHERE av."version" = 1;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "app_version_links" WHERE "appVersionId" IN (
                SELECT "id" FROM "app_version" WHERE "version" = 1
            );
        `);
        await queryRunner.query(`
            DELETE FROM "app_version_tags" WHERE "appVersionId" IN (
                SELECT "id" FROM "app_version" WHERE "version" = 1
            );
        `);
        await queryRunner.query(`
            DELETE FROM "app_version" WHERE "version" = 1;
        `);
    }

}
