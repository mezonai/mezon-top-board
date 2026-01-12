import { MigrationInterface, QueryRunner } from "typeorm";

export class FixFeaturedImagePath1768204319854 implements MigrationInterface {
    name = 'FixFeaturedImagePath1768204319854'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE "app" SET "featuredImage" = SUBSTRING("featuredImage" FROM '/uploads/.*') WHERE "featuredImage" LIKE '%/api/uploads/%';`);
        await queryRunner.query(`UPDATE "app_version" SET "featuredImage" = SUBSTRING("featuredImage" FROM '/uploads/.*') WHERE "featuredImage" LIKE '%/api/uploads/%';`);
        await queryRunner.query(`UPDATE "user" SET "profileImage" = SUBSTRING("profileImage" FROM '/uploads/.*') WHERE "profileImage" LIKE '%/api/uploads/%';`);
        await queryRunner.query(`UPDATE "link_type" SET "icon" = SUBSTRING("icon" FROM '/uploads/.*') WHERE "icon" LIKE '%/api/uploads/%';`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> { }
}
