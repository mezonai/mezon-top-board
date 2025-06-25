import { MigrationInterface, QueryRunner } from "typeorm";

export class SocialLinkPrefix1744954719413 implements MigrationInterface {
    name = 'SocialLinkPrefix1744954719413'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link_type" ADD "prefixUrl" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "link_type" DROP COLUMN "prefixUrl"`);
    }

}
