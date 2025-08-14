import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNewsletterCampaign1754907828093 implements MigrationInterface {
    name = 'CreateNewsletterCampaign1754907828093'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "newsletter_campaign" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "title" character varying(255) NOT NULL, "headline" character varying(255), "description" text, CONSTRAINT "PK_2b40b934cee2f5e3fb2184681d6" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "newsletter_campaign"`);
    }

}
